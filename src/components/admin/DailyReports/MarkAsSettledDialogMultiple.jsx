import React from "react";
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
import { CheckCircle, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

const MarkAsSettledDialogMultiple = ({
  open,
  onOpenChange,
  reports = [],
  notes,
  setNotes,
  onMarkAsSettled,
  loading = false
}) => {
  const { t } = useTranslation();

  if (!reports?.length) return null;

  const totalAmount = reports.reduce(
    (sum, report) => sum + parseFloat(report.money_collection?.amount ?? report.total_revenue ?? 0),
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {t("Mark Reports as Settled")}
          </DialogTitle>
          <DialogDescription>
            {t("Mark selected submitted reports as settled")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">{t("Reports")}:</span>{" "}
              <span className="font-medium">{reports.length}</span>
            </p>
            <p>
              <span className="text-muted-foreground">{t("Total Amount")}:</span>{" "}
              <span className="font-bold text-green-600">OMR {totalAmount.toFixed(2)}</span>
            </p>
          </div>

          <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-2 text-sm">
            {reports.map((report) => (
              <div key={report.id} className="flex justify-between gap-2">
                <span>
                  {new Date(report.date).toLocaleDateString()} — {report.sales_manager?.name}
                </span>
                <span className="font-medium">
                  OMR {parseFloat(report.money_collection?.amount ?? report.total_revenue ?? 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="settle-notes-multiple" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t("Settlement Notes")} ({t("Optional")})
            </Label>
            <Textarea
              id="settle-notes-multiple"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("Add any notes about marking these reports as settled...")}
              rows={3}
              maxLength={500}
            />
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
            onClick={onMarkAsSettled}
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

export default MarkAsSettledDialogMultiple;
