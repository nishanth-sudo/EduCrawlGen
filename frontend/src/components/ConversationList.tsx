import React from 'react';
import { PlusCircle, MessageSquare } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { cn, truncate, formatDate } from '../lib/utils';
import Button from './ui/Button';

const ConversationList: React.FC = () => {
  const { conversations, currentConversation, selectConversation, startNewConversation } = useChat();

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 flex-shrink-0">
        <Button
          onClick={startNewConversation}
          leftIcon={<PlusCircle size={18} />}
          className="w-full justify-start"
          variant="outline"
        >
          New Chat
        </Button>
      </div>
      <div className="overflow-y-auto flex-1">
        {conversations.length === 0 ? (
          <div className="text-sm text-gray-500 p-4 text-center">
            No conversations yet
          </div>
        ) : (
          <ul className="space-y-1 p-2">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  onClick={() => selectConversation(conversation.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md transition-colors',
                    'flex items-start gap-3 text-sm',
                    conversation.id === currentConversation?.id
                      ? 'bg-gray-200 text-gray-900'
                      : 'hover:bg-gray-100 text-gray-700'
                  )}
                >
                  <MessageSquare size={18} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{truncate(conversation.title, 20)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(conversation.timestamp)}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationList;