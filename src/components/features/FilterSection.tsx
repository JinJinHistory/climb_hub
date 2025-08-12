import React from 'react';
import Button from '@/components/ui/button';
import Toggle from '@/components/ui/toggle';
import { Card, CardContent } from '@/components/ui/card';

interface FilterSectionProps {
  selectedRegion: string;
  selectedCourse: string;
  showOnlyOpen: boolean;
  showPastEvents: boolean;
  onRegionChange: (region: string) => void;
  onCourseChange: (course: string) => void;
  onShowOnlyOpenChange: (show: boolean) => void;
  onShowPastEventsChange: (show: boolean) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  selectedRegion,
  selectedCourse,
  showOnlyOpen,
  showPastEvents,
  onRegionChange,
  onCourseChange,
  onShowOnlyOpenChange,
  onShowPastEventsChange
}) => {
  const regions = [
    { value: 'all', label: '전체' },
    { value: 'seoul', label: '수도권' },
    { value: 'non-seoul', label: '비수도권' }
  ];

  const courses = [
    { value: 'all', label: '전체' },
    { value: 'full', label: '풀' },
    { value: 'half', label: '하프' },
    { value: '10km', label: '10km' },
    { value: '5km', label: '5km' }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* Region filters */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">지역</h3>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <Button
                key={region.value}
                variant={selectedRegion === region.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onRegionChange(region.value)}
                className={selectedRegion === region.value ? 'bg-blue-600 text-white' : ''}
              >
                {region.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Course filters */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">코스</h3>
          <div className="flex flex-wrap gap-2">
            {courses.map((course) => (
              <Button
                key={course.value}
                variant={selectedCourse === course.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCourseChange(course.value)}
                className={selectedCourse === course.value ? 'bg-blue-600 text-white' : ''}
              >
                {course.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Toggle switches */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Toggle
            checked={showOnlyOpen}
            onCheckedChange={onShowOnlyOpenChange}
            label="접수중인 대회만 보기"
          />
          <Toggle
            checked={showPastEvents}
            onCheckedChange={onShowPastEventsChange}
            label="지난 대회 보기"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;
