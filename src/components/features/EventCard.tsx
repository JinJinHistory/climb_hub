import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown, MapPin, Globe, Calendar } from 'lucide-react';
import { formatDate, getDayOfWeek } from '@/lib/utils';
import FavoriteButton from './FavoriteButton';
import NotificationButton from './NotificationButton';

interface EventCardProps {
  event: {
    id: string;
    date: string;
    name: string;
    location: string;
    region: string;
    courses: string[];
    status: 'open' | 'closed' | 'tbd';
    organizer: string;
    prize: string;
    fee: string;
    website?: string;
    logo?: string;
    image?: string;
  };
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  isFavorite = false, 
  onFavoriteToggle 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'open':
        return { label: '접수중', color: 'bg-green-100 text-green-800' };
      case 'closed':
        return { label: '마감', color: 'bg-red-100 text-red-800' };
      case 'tbd':
        return { label: '미정', color: 'bg-gray-100 text-gray-800' };
      default:
        return { label: '미정', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const statusInfo = getStatusInfo(event.status);

  const handleFavoriteToggle = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(event.id);
    }
  };

  const handleNotificationToggle = () => {
    setIsNotificationEnabled(!isNotificationEnabled);
    // 여기에 알림 설정 로직 추가
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          {/* Left side - Date and event info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              {/* Date */}
              <div className="text-center min-w-[60px]">
                <div className="text-2xl font-bold text-blue-600">
                  {formatDate(event.date, 'M/dd')}
                </div>
                <div className="text-sm text-gray-500">
                  {getDayOfWeek(event.date)}
                </div>
              </div>
              
              {/* Event name and location */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {event.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>◎ {event.location}</span>
                </div>
                
                {/* Status badge */}
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
            </div>

            {/* Course options */}
            {event.courses.length > 0 && (
              <div className="flex gap-2 mb-3">
                {event.courses.map((course) => (
                  <span
                    key={course}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {course}
                  </span>
                ))}
              </div>
            )}

            {/* Expanded content */}
            {isExpanded && (
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <div>
                  <span className="font-medium">주최사:</span> {event.organizer}
                </div>
                <div>
                  <span className="font-medium">참가상품:</span> {event.prize}
                </div>
                <div>
                  <span className="font-medium">참가비:</span> {event.fee}
                </div>
                {event.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      대회 홈페이지
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side - Logo/image, action buttons, and expand button */}
          <div className="flex flex-col items-end gap-3 ml-4">
            {/* Logo or image */}
            {event.logo && (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500 font-medium">{event.logo}</span>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex gap-2">
              <FavoriteButton
                isFavorite={isFavorite}
                onToggle={handleFavoriteToggle}
              />
              <NotificationButton
                isEnabled={isNotificationEnabled}
                onToggle={handleNotificationToggle}
              />
            </div>
            
            {/* Expand/collapse button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
