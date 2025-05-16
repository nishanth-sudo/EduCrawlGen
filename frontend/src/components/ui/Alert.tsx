import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  title?: string;
  message: string;
  variant?: AlertVariant;
  className?: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  title,
  message,
  variant = 'info',
  className,
  onClose,
}) => {
  const variantStyles = {
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: <Info className="h-5 w-5 text-blue-500" />,
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'flex w-full rounded-md border p-4',
        styles.bg,
        styles.border,
        className
      )}
    >
      <div className="mr-3 flex-shrink-0">{styles.icon}</div>
      <div className="flex-1">
        {title && (
          <h3 className={cn('text-sm font-medium', styles.text)}>{title}</h3>
        )}
        <div className={cn('text-sm', styles.text)}>{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn('ml-3 flex-shrink-0', styles.text)}
        >
          <XCircle className="h-5 w-5 opacity-70 hover:opacity-100" />
        </button>
      )}
    </div>
  );
};

export default Alert;