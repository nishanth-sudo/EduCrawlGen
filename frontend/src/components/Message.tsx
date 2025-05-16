import React from 'react';
import { Message as MessageType } from '../types';
import Markdown from './ui/Markdown';
import { User, Bot } from 'lucide-react';
import { cn } from '../lib/utils';
import CopyButton from './ui/CopyButton';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      'py-6 first:pt-8 last:pb-8 px-4 md:px-6 lg:px-8',
      isUser ? 'bg-white' : 'bg-gray-50',
      'animate-fade-in'
    )}>
      <div className="max-w-4xl mx-auto flex gap-4 md:gap-6">
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
              <User size={18} />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-700">
              <Bot size={18} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 mb-1">
            {isUser ? 'You' : 'AI Assistant'}
          </div>
          <div className="relative group">
            {isUser ? (
              <div className="text-gray-700 text-sm md:text-base whitespace-pre-wrap">
                {message.content}
              </div>
            ) : (
              <Markdown content={message.content} />
            )}
            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <CopyButton content={message.content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;