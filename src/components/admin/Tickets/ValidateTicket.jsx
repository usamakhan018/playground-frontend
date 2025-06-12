import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader, QrCode, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { handleError } from "@/utils/helpers";
import { useTranslation } from "react-i18next";

function ValidateTicket() {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [ticketBarcode, setTicketBarcode] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticketBarcode.trim()) return;

    setIsLoading(true);
    setValidationResult(null);

    try {
      const response = await axiosClient.post("tickets/validate", {
        ticket_code: ticketBarcode.trim()
      });
      
      setValidationResult({
        success: true,
        message: response.data.message,
        ticket: response.data.data
      });
      
      toast.success(response.data.message);
    } catch (error) {
      setValidationResult({
        success: false,
        message: error.response?.data?.message || t("Validation failed"),
        ticket: null
      });
      
      toast.error(error.response?.data?.message || t("Validation failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTicketBarcode("");
    setValidationResult(null);
  };

  const handleClose = () => {
    setShowDialog(false);
    handleReset();
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <QrCode className="w-4 h-4" />
          <span>{t("Validate Ticket")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Validate Ticket Barcode")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="ticket_barcode" className="block text-sm font-medium">
                {t("Ticket Barcode")}
              </label>
              <Input
                id="ticket_barcode"
                name="ticket_barcode"
                type="text"
                value={ticketBarcode}
                onChange={(e) => setTicketBarcode(e.target.value)}
                required
                autoComplete="off"
                placeholder={t("Enter ticket barcode")}
                className="font-mono"
              />
            </div>
          </div>

          {validationResult && (
            <div className={`p-4 rounded-lg border ${
              validationResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {validationResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  validationResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {validationResult.message}
                </span>
              </div>
              
              {validationResult.success && validationResult.ticket && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t("Barcode")}:</span>
                    <span className="font-mono">{validationResult.ticket.barcode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Status")}:</span>
                    <Badge variant={validationResult.ticket.is_used ? "used" : "available"}>
                      {validationResult.ticket.is_used ? t("Used") : t("Available")}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Created")}:</span>
                    <span>{new Date(validationResult.ticket.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={handleClose}>
                {t("Close")}
              </Button>
            </DialogClose>
            {validationResult && (
              <Button type="button" variant="outline" onClick={handleReset}>
                {t("Reset")}
              </Button>
            )}
            <Button type="submit" disabled={isLoading || !ticketBarcode.trim()}>
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                t("Validate")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ValidateTicket; 