import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface YearNavigationProps {
  currentYear: number;
  onYearChange: (year: number) => void;
}

const YearNavigation: React.FC<YearNavigationProps> = ({
  currentYear,
  onYearChange
}) => {
  const handlePreviousYear = () => {
    onYearChange(currentYear - 1);
  };

  const handleNextYear = () => {
    onYearChange(currentYear + 1);
  };

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <button
        onClick={handlePreviousYear}
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Previous year"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        <span className="text-xl font-bold text-gray-900">{currentYear}</span>
      </div>
      
      <button
        onClick={handleNextYear}
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Next year"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default YearNavigation;
