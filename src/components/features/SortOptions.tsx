import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SortOptionsProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  sortBy,
  onSortChange
}) => {
  const sortOptions = [
    { value: 'date', label: '날짜순' },
    { value: 'name', label: '이름순' },
    { value: 'location', label: '지역순' },
    { value: 'status', label: '상태순' }
  ];

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm font-medium text-gray-700">정렬:</span>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default SortOptions;
