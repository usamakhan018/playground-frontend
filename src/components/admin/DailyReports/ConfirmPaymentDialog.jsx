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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  DollarSign, 
  Calendar, 
  User, 
  FileText,
  AlertCircle,
  Send
} from "lucide-react";
import { useTranslation } from "react-i18next";

const SubmitReportDialog = ({ 
  open, 
  onOpenChange, 
  reportData, 
  amount,
  setAmount,
  notes,
  setNotes,
  onSubmit,
  loading = false
}) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});

  if (!reportData?.report) return null;

  const { report } = reportData;

  const validateForm = () => {
    const newErrors = {};
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = t("Amount must be greater than 0");
    }
    
    if (parseFloat(amount) > (report.total_revenue || report.actual_revenue || 0)) {
      newErrors.amount = t("Amount cannot exceed total revenue");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            {t("Submit Daily Report")}
          </DialogTitle>
          <DialogDescription>
            {t("Submit the daily report with money collection details")}
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
                <span className="text-muted-foreground">{t("Total Sales")}:</span>
                <span className="font-medium">{report.total_transactions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Total Revenue")}:</span>
                <span className="font-bold text-green-600">
                  ${parseFloat(report.total_revenue)?.toFixed(2) || parseFloat(report.actual_revenue)?.toFixed(2) || '0.00'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Collection Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t("Amount Collected")} *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={report.total_revenue || report.actual_revenue || 0}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) {
                    setErrors(prev => ({ ...prev, amount: null }));
                  }
                }}
                placeholder={t("Enter amount collected from sales manager")}
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.amount}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {t("Maximum amount")}: ${parseFloat(report.total_revenue || report.actual_revenue)?.toFixed(2) || '0.00'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t("Collection Notes")} ({t("Optional")})
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("Add any notes about the money collection...")}
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {notes.length}/500 {t("characters")}
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">{t("Information")}</p>
                <p className="text-blue-700">
                  {t("This will submit the report and record the money collection. The report status will become 'submitted'.")}
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
            onClick={handleSubmit}
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="flex items-center gap-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {loading ? t("Submitting...") : t("Submit Report")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitReportDialog; 