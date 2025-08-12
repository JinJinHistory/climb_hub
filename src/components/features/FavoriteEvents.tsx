import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Calendar, MapPin } from 'lucide-react';
import { formatDate, getDayOfWeek } from '@/lib/utils';

interface FavoriteEvent {
  id: string;
  date: string;
  name: string;
  location: string;
  status: 'open' | 'closed' | 'tbd';
}

interface FavoriteEventsProps {
  events: FavoriteEvent[];
  onRemoveFavorite: (id: string) => void;
}

const FavoriteEvents: React.FC<FavoriteEventsProps> = ({
  events,
  onRemoveFavorite
}) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">즐겨찾기한 대회</h3>
          <span className="text-sm text-gray-500">({events.length})</span>
        </div>
        
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="text-center min-w-[50px]">
                  <div className="text-lg font-bold text-blue-600">
                    {formatDate(event.date, 'M/dd')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getDayOfWeek(event.date)}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">{event.name}</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.status === 'open' ? 'bg-green-100 text-green-800' :
                  event.status === 'closed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.status === 'open' ? '접수중' :
                   event.status === 'closed' ? '마감' : '미정'}
                </span>
                
                <button
                  onClick={() => onRemoveFavorite(event.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="즐겨찾기 제거"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoriteEvents;
