import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Conversation, Message, ApiError } from '../types';
import { API_URL } from '../lib/utils';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  sendMessage: (content: string) => Promise<void>;
  startNewConversation: () => void;
  selectConversation: (id: string) => void;
  error: ApiError | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, getToken } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Fetch conversations and history when user changes
  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      setCurrentConversation(null);
      return;
    }

    const fetchConversationsAndHistory = async () => {
      setLoading(true);
      try {
        // Get token for API calls
        const token = await getToken();
        if (!token) {
          throw new Error('Authentication token not available');
        }

        // Fetch chat history from backend
        const historyResponse = await fetch(`${API_URL}/history/${currentUser.uid}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!historyResponse.ok) {
          throw new Error('Failed to fetch chat history');
        }

        const historyData = await historyResponse.json();

        // Convert history items to conversations
        const conversationsFromHistory = historyData.map((item: any) => ({
          id: item.id, // Firebase returns 'id' instead of '_id'
          title: item.question.slice(0, 30),
          messages: [
            {
              id: `user-${item.id}`,
              content: item.question,
              role: 'user' as const,
              timestamp: new Date(item.timestamp).getTime(),
            },
            {
              id: `assistant-${item.id}`,
              content: item.answer,
              role: 'assistant' as const,
              timestamp: new Date(item.timestamp).getTime() + 1000, // Add 1 second to ensure proper ordering
            },
          ],
          timestamp: new Date(item.timestamp).getTime(),
          userId: item.user_id,
        }));

        setConversations(conversationsFromHistory);
        
        // Select the most recent conversation or create a new one
        if (conversationsFromHistory.length > 0) {
          setCurrentConversation(conversationsFromHistory[0]);
        } else {
          startNewConversation();
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        // More detailed error logging
        if (err instanceof Error) {
          console.error('Error details:', err.message);
        }
        // Don't set error state to avoid showing error to user on initial load
        // Just log it and continue with an empty conversation list
        setConversations([]);
        startNewConversation();
      } finally {
        setLoading(false);
      }
    };

    fetchConversationsAndHistory();
  }, [currentUser]);

  const startNewConversation = () => {
    if (!currentUser) return;
    
    const newConversation: Conversation = {
      id: `temp-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      timestamp: Date.now(),
      userId: currentUser.uid,
    };
    
    setCurrentConversation(newConversation);
    setConversations(prev => [newConversation, ...prev]);
  };

  const selectConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentUser || !content.trim() || !currentConversation) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Create a new user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content,
        role: 'user',
        timestamp: Date.now(),
      };
      
      // Add user message to the conversation
      const updatedMessages = [...(currentConversation.messages || []), userMessage];
      const updatedConversation = {
        ...currentConversation,
        messages: updatedMessages,
        title: currentConversation.messages.length === 0 ? content.slice(0, 30) : currentConversation.title,
      };
      
      setCurrentConversation(updatedConversation);
      
      // Update the conversations list
      setConversations(conversations.map(c => 
        c.id === currentConversation.id ? updatedConversation : c
      ));
      
      // Send request to API
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }
      
      const response = await fetch(`${API_URL}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: content,
          user_id: currentUser.uid,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Create assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: data.answer,
        role: 'assistant',
        timestamp: Date.now(),
      };
      
      // Add assistant message to conversation
      const finalMessages = [...updatedMessages, assistantMessage];
      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages,
      };
      
      setCurrentConversation(finalConversation);
      
      // Update conversations list
      setConversations(conversations.map(c => 
        c.id === currentConversation.id ? finalConversation : c
      ));
      
      // Save to history in the backend
      await fetch(`${API_URL}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: content,
          answer: data.answer,
          user_id: currentUser.uid,
          timestamp: new Date().toISOString(),
        }),
      });
      
      // Update the conversation ID if it's temporary
      if (currentConversation.id.startsWith('temp-')) {
        const conversationWithId = {
          ...finalConversation,
          id: data.id || `conv-${Date.now()}`, // Firebase returns 'id' instead of '_id'
        };
        
        setCurrentConversation(conversationWithId);
        setConversations(conversations.map(c => 
          c.id === currentConversation.id ? conversationWithId : c
        ));
      }
      
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError({
        status: err.status || 500,
        message: err.message || 'Failed to send message',
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    conversations,
    currentConversation,
    loading,
    sendMessage,
    startNewConversation,
    selectConversation,
    error,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};