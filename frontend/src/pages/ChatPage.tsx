import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import Header from '../components/Header';
import ConversationList from '../components/ConversationList';
import Message from '../components/Message';
import MessageInput from '../components/MessageInput';
import EmptyState from '../components/EmptyState';
import Alert from '../components/ui/Alert';
import { cn } from '../lib/utils';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const { currentConversation, sendMessage, loading, error } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, authLoading, navigate]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse-slow">
          <svg className="w-12 h-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen flex-col">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            'bg-gray-50 border-r border-gray-200 w-64 flex-shrink-0',
            'transform transition-transform duration-300 ease-in-out lg:transform-none',
            'fixed inset-y-0 z-20 top-14 left-0 lg:relative',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <ConversationList />
        </aside>
        
        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
              <Alert
                variant="error"
                message={error.message}
              />
            </div>
          )}
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto bg-white">
            {!currentConversation || currentConversation.messages.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="pb-24">
                {currentConversation.messages.map((message) => (
                  <Message key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Message input */}
          <div className="border-t border-gray-200 bg-gray-50 fixed bottom-0 left-0 right-0 lg:left-64">
            <MessageInput onSendMessage={sendMessage} isLoading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;