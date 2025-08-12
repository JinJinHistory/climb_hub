import React from 'react';
import { Card } from '@/components/ui/card';

interface EventBannerProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  isAd?: boolean;
}

const EventBanner: React.FC<EventBannerProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  isAd = false
}) => {
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="flex">
        {/* Left side - Orange background */}
        <div className="flex-1 bg-orange-500 p-6 text-white">
          <div className="mb-4">
            <div className="text-2xl font-bold mb-2">World Vision</div>
            <div className="text-lg mb-1">{subtitle}</div>
            <div className="text-xl font-semibold">{description}</div>
          </div>
        </div>
        
        {/* Right side - Image background */}
        <div className="flex-1 relative bg-gradient-to-br from-amber-100 to-amber-200 p-6">
          {imageUrl && (
            <div className="absolute inset-0 opacity-20">
              <img 
                src={imageUrl} 
                alt="Event" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          </div>
        </div>
        
        {/* Ad label */}
        {isAd && (
          <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-1 rounded">
            광고
          </div>
        )}
      </div>
      
      {/* Carousel dots */}
      <div className="flex justify-center py-2 bg-gray-50">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-white rounded-full border border-gray-300"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </Card>
  );
};

export default EventBanner;
