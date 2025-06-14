import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const StatCard = ({ title, count, icon: Icon, to, bgColor, textColor, iconColor, description }) => {
  const CardWrapper = to ? Link : 'div';
  const cardProps = to ? { to } : {};

  return (
    <CardWrapper {...cardProps}>
      <Card className={`${to ? 'hover:bg-muted/50 transition-colors cursor-pointer' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${bgColor}`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{title}</p>
              <p className={`text-2xl font-bold ${textColor}`}>
                {typeof count === 'number' ? count.toLocaleString() : count}
              </p>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

export default StatCard; 