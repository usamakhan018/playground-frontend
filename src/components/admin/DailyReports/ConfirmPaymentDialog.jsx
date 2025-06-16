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
  AlertCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";

const ConfirmPaymentDialog = ({ 
  open, 
  onOpenChange, 
  reportData, 
  amount,
  setAmount,
  notes,
  setNotes,
  onConfirm,
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

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t("Confirm Payment Collection")}
          </DialogTitle>
          <DialogDescription>
            {t("Confirm the payment received from the sales manager")}
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
                  ${report.total_revenue?.toFixed(2) || report.actual_revenue?.toFixed(2) || '0.00'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t("Amount Received")} *
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
                placeholder={t("Enter amount received")}
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.amount}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {t("Maximum amount")}: ${(report.total_revenue || report.actual_revenue)?.toFixed(2) || '0.00'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t("Notes")} ({t("Optional")})
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("Add any notes about the payment collection...")}
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {notes.length}/500 {t("characters")}
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">{t("Important")}</p>
                <p className="text-yellow-700">
                  {t("Once confirmed, this report will be marked as settled and cannot be modified.")}
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
            onClick={handleConfirm}
            disabled={loading || !amount || parseFloat(amount) <= 0}
          >
            {loading ? t("Processing...") : t("Confirm Payment")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPaymentDialog; 