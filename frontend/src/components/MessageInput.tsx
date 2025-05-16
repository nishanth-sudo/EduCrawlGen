import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Button from './ui/Button';
import { cn } from '../lib/utils';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto px-4 py-4 md:px-6 lg:px-8"
    >
      <div className={cn(
        'flex items-end gap-2 w-full relative',
        'border border-gray-300 rounded-lg',
        'focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500',
        'bg-white shadow-sm'
      )}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          className={cn(
            'w-full p-3 resize-none outline-none text-sm md:text-base',
            'rounded-lg max-h-[200px] min-h-[44px]'
          )}
          disabled={isLoading}
        />
        <div className="flex-shrink-0 p-2">
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            isLoading={isLoading}
            size="icon"
            variant="primary"
            className="rounded-full"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500 text-center">
        Press Enter to send, Shift + Enter for a new line
      </div>
    </form>
  );
};

export default MessageInput;