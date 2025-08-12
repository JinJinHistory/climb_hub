import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, Award } from 'lucide-react';

interface EventStatsProps {
  totalEvents: number;
  openEvents: number;
  regions: string[];
  courses: string[];
}

const EventStats: React.FC<EventStatsProps> = ({
  totalEvents,
  openEvents,
  regions,
  courses
}) => {
  const stats = [
    {
      icon: Calendar,
      label: '전체 대회',
      value: totalEvents,
      color: 'text-blue-600'
    },
    {
      icon: Users,
      label: '접수중',
      value: openEvents,
      color: 'text-green-600'
    },
    {
      icon: MapPin,
      label: '지역',
      value: regions.length,
      color: 'text-purple-600'
    },
    {
      icon: Award,
      label: '코스',
      value: courses.length,
      color: 'text-orange-600'
    }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">대회 현황</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`${stat.color} mb-2`}>
                <stat.icon className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventStats;
