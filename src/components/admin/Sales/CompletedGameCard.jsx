import React from 'react';
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { CheckCircle, Clock, Trophy, DollarSign } from "lucide-react";

const CompletedGameCard = ({ sale }) => {
  const { t } = useTranslation();

  // Calculate game duration
  const startTime = new Date(sale.tickets?.scanned_at);
  const endTime = new Date(sale.updated_at);
  const actualDurationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
  
  // Expected duration from game settings
  const expectedDurationMinutes = sale.game?.duration ? parseInt(sale.game.duration.match(/\d+/)?.[0] || 60) : 60;
  
  // Determine if game was completed early or on time
  const wasCompletedEarly = actualDurationMinutes < expectedDurationMinutes;

  return (
    <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-lg">{sale.game?.name}</h4>
            <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              {t("COMPLETED")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{sale.game_asset?.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("Ticket")}: <span className="font-mono font-medium">{sale.tickets?.barcode}</span>
          </p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-green-600">
            <DollarSign className="h-4 w-4" />
            <span className="text-lg font-bold">${sale.game?.price}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {t("Revenue")}
          </div>
        </div>
      </div>

      {/* Game Duration Info */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div className="bg-white/70 rounded p-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {t("Actual Duration")}
          </div>
          <div className="font-medium">{actualDurationMinutes} {t("minutes")}</div>
        </div>
        <div className="bg-white/70 rounded p-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Trophy className="h-3 w-3" />
            {t("Expected Duration")}
          </div>
          <div className="font-medium">{expectedDurationMinutes} {t("minutes")}</div>
        </div>
      </div>

      {/* Time Information */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{t("Started")}:</span>
          <span className="font-medium">{startTime.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{t("Completed")}:</span>
          <span className="font-medium">{endTime.toLocaleString()}</span>
        </div>
        {wasCompletedEarly && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t("Completed Early")}:</span>
            <span className="font-medium text-blue-600">
              {expectedDurationMinutes - actualDurationMinutes} {t("minutes")}
            </span>
          </div>
        )}
      </div>

      {/* Performance Badge */}
      <div className="mt-3 pt-3 border-t border-blue-200">
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {t("Handled by")}: {sale.user?.name}
          </div>
          <div className="flex gap-1">
            {wasCompletedEarly && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                <Trophy className="h-3 w-3 mr-1" />
                {t("Early Finish")}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              #{sale.id}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedGameCard; 