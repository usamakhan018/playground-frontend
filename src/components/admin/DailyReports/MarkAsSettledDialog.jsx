import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Calendar,
  User,
  FileText,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";

const MarkAsSettledDialog = ({
  open,
  onOpenChange,
  reportData,
  notes,
  setNotes,
  onMarkAsSettled,
  loading = false
}) => {
  const { t } = useTranslation();

  if (!reportData?.report) return null;

  const { report } = reportData;

  const handleMarkAsSettled = () => {
    onMarkAsSettled();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {t("Mark Report as Settled")}
          </DialogTitle>
          <DialogDescription>
            {t("Mark this submitted report as settled (processed in salary)")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Report Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{t("Report Summary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Date")}:</span>
                <span className="font-medium">
                  {new Date(report.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Sales Manager")}:</span>
                <span className="font-medium">{report.sales_manager?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Status")}:</span>
                <span className="font-medium text-orange-600">{t("Submitted")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Amount Collected")}:</span>
                <span className="font-bold text-green-600">
                  OMR {parseFloat(report.money_collection?.amount)?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Submitted At")}:</span>
                <span className="font-medium">
                  {report.submitted_at ? new Date(report.submitted_at).toLocaleString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Settlement Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t("Settlement Notes")} ({t("Optional")})
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("Add any notes about marking this report as settled...")}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {notes.length}/500 {t("characters")}
            </p>
          </div>

          {/* Information */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-800">{t("Settlement Process")}</p>
                <p className="text-green-700">
                  {t("This will mark the report as settled, indicating it has been processed in salary calculations.")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleMarkAsSettled}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? t("Processing...") : t("Mark as Settled")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarkAsSettledDialog; 