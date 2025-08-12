import React from 'react';
import { Bell, BellOff } from 'lucide-react';

interface NotificationButtonProps {
  isEnabled: boolean;
  onToggle: () => void;
  className?: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  isEnabled,
  onToggle,
  className = ""
}) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-full transition-colors ${
        isEnabled
          ? 'text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100'
          : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
      } ${className}`}
      aria-label={isEnabled ? '알림 비활성화' : '알림 활성화'}
    >
      {isEnabled ? (
        <Bell className="w-5 h-5" />
      ) : (
        <BellOff className="w-5 h-5" />
      )}
    </button>
  );
};

export default NotificationButton;
