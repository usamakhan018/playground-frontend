import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { CheckCircle, Clock, AlertTriangle, Zap, Infinity } from "lucide-react";

const ActiveGameCard = ({ sale, onComplete, onExpired }) => {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Check if this is an unlimited game
  const isUnlimitedGame = sale.game?.type === 'unlimited';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // For limited games - calculate remaining time
  let remainingTime = 0;
  let isExpired = false;
  let isExpiringSoon = false;
  let progressPercentage = 0;
  let elapsedTime = 0;
  let startTime = new Date(sale.tickets?.scanned_at || sale.created_at);

  if (!isUnlimitedGame) {
    const gameDurationMinutes = sale.game_pricing?.duration ? 
      parseInt(sale.game_pricing.duration.match(/\d+/)?.[0] || 60) : 
      (sale.game?.duration ? parseInt(sale.game.duration.match(/\d+/)?.[0] || 60) : 60);
    
    const endTime = new Date(startTime.getTime() + gameDurationMinutes * 60 * 1000);
    remainingTime = Math.max(0, Math.floor((endTime.getTime() - currentTime) / 1000));
    
    isExpired = remainingTime <= 0;
    isExpiringSoon = remainingTime <= 300 && remainingTime > 0; // 5 minutes
    const totalDurationSeconds = gameDurationMinutes * 60;
    elapsedTime = totalDurationSeconds - remainingTime;
    progressPercentage = Math.min(100, Math.max(0, (elapsedTime / totalDurationSeconds) * 100));
  }

  // For unlimited games - calculate elapsed time
  const elapsedMinutes = Math.floor((currentTime - startTime.getTime()) / (1000 * 60));

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Play expiration sound when limited game expires
  useEffect(() => {
    if (isExpired && onExpired && !isUnlimitedGame) {
      onExpired();
    }
  }, [isExpired, onExpired, isUnlimitedGame]);

  // Determine card styling based on game state
  const getCardStyling = () => {
    if (isUnlimitedGame) {
      return {
        container: 'border-purple-500 bg-purple-50',
        badge: 'secondary',
        timer: 'text-purple-600',
        icon: <Infinity className="h-4 w-4" />
      };
    } else if (isExpired) {
      return {
        container: 'border-red-500 bg-red-50 animate-pulse',
        badge: 'destructive',
        progress: 'bg-red-500',
        timer: 'text-red-600',
        icon: <AlertTriangle className="h-4 w-4" />
      };
    } else if (isExpiringSoon) {
      return {
        container: 'border-yellow-500 bg-yellow-50',
        badge: 'secondary',
        progress: 'bg-yellow-500',
        timer: 'text-yellow-600',
        icon: <Clock className="h-4 w-4" />
      };
    } else {
      return {
        container: 'border-green-500 bg-green-50',
        badge: 'default',
        progress: 'bg-green-500',
        timer: 'text-green-600',
        icon: <Zap className="h-4 w-4" />
      };
    }
  };

  const styling = getCardStyling();

  return (
    <div className={`border-2 rounded-lg p-4 transition-all duration-500 ${styling.container}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-lg">{sale.game?.name}</h4>
            <Badge variant={styling.badge} className="text-xs">
              {styling.icon}
              <span className="ml-1">
                {isUnlimitedGame ? t("UNLIMITED") : 
                 isExpired ? t("EXPIRED") : 
                 isExpiringSoon ? t("EXPIRING") : t("ACTIVE")}
              </span>
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{sale.game_asset?.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("Ticket")}: <span className="font-mono font-medium">{sale.tickets?.barcode || sale.ticket_barcode}</span>
          </p>
        </div>
        
        <div className={`text-right ${styling.timer}`}>
          {isUnlimitedGame ? (
            <>
              <div className="text-2xl font-bold font-mono">
                {elapsedMinutes}m
              </div>
              <div className="text-xs font-medium">
                {t("Playing")}
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold font-mono">
                {formatTime(remainingTime)}
              </div>
              <div className="text-xs font-medium">
                {isExpired ? t("TIME UP!") : t("Remaining")}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Game Info */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div className="bg-white/50 rounded p-2">
          <div className="text-xs text-muted-foreground">{t("Duration")}</div>
          <div className="font-medium">
            {isUnlimitedGame ? t("Unlimited") : 
             (sale.game_pricing?.duration || sale.game?.duration)}
          </div>
        </div>
        <div className="bg-white/50 rounded p-2">
          <div className="text-xs text-muted-foreground">{t("Price")}</div>
          <div className="font-medium text-green-600">
            ${sale.game_pricing?.price || sale.game?.price}
          </div>
        </div>
      </div>

      {/* Progress Bar - Only for Limited Games */}
      {!isUnlimitedGame && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-linear ${styling.progress}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{t("Started")}: {startTime.toLocaleTimeString()}</span>
            <span>{progressPercentage.toFixed(1)}% {t("completed")}</span>
          </div>
        </div>
      )}

      {/* Unlimited Game Info */}
      {isUnlimitedGame && (
        <div className="mb-4 bg-white/50 rounded p-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{t("Started")}: {startTime.toLocaleTimeString()}</span>
            <span>{t("Duration")}: {elapsedMinutes} {t("minutes")}</span>
          </div>
          <div className="text-sm text-center text-purple-600 font-medium">
            <Infinity className="h-4 w-4 inline mr-1" />
            {t("No time limit - Play as long as you want!")}
          </div>
        </div>
      )}

      {/* Action Button */}
      {!isUnlimitedGame && isExpired ? (
        <Button
          size="sm"
          variant="destructive"
          className="w-full animate-pulse"
          onClick={() => onComplete(sale.id)}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {t("Complete Game")}
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => onComplete(sale.id)}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {isUnlimitedGame ? t("Complete Game") : t("Force Complete")}
        </Button>
      )}

      {/* Additional Info */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{t("Started by")}: {sale.user?.name}</span>
          <span>{t("Sale ID")}: #{sale.id}</span>
        </div>
      </div>
    </div>
  );
};

export default ActiveGameCard; 