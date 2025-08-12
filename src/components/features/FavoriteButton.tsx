import React from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  className = ""
}) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-full transition-colors ${
        isFavorite
          ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100'
          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
      } ${className}`}
      aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
    >
      <Heart
        className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}
      />
    </button>
  );
};

export default FavoriteButton;
