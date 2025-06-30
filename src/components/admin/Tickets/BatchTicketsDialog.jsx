import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Printer, 
  Package, 
  Hash, 
  Calendar, 
  Users, 
  Ticket, 
  Check, 
  X,
  QrCode,
  FileText
} from "lucide-react";
import axiosClient from "@/axios";
import { handleError } from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import Loader from "@/components/Loader";
import NoRecordFound from "@/components/NoRecordFound";
import { toast } from "react-hot-toast";

const BatchTicketsDialog = ({ open, onClose, batch, onRefresh }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (open && batch) {
      fetchBatchTickets();
    }
  }, [open, batch]);

  const fetchBatchTickets = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`tickets/batch/${batch.id}`);
      setTickets(response.data.data || []);
    } catch (error) {
      handleError(error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintBatchTickets = async () => {
    setPrinting(true);
    try {
      // Create a download link for the PDF
      const downloadUrl = `${axiosClient.defaults.baseURL}tickets/batch/${batch.id}/print`;
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `batch_${batch.id}_tickets.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(t("PDF download started"));
    } catch (error) {
      handleError(error);
    } finally {
      setPrinting(false);
    }
  };

  const getStatusBadge = (ticket) => {
    if (ticket.is_used) {
      return (
        <Badge variant="destructive" className="gap-1">
          <X className="h-3 w-3" />
          {t("Used")}
        </Badge>
      );
    }
    if (ticket.status === 'available') {
      return (
        <Badge variant="default" className="gap-1 bg-green-100 text-green-800 hover:bg-green-200">
          <Check className="h-3 w-3" />
          {t("Available")}
        </Badge>
      );
    }
    if (ticket.status === 'sold') {
      return (
        <Badge variant="secondary" className="gap-1">
          <QrCode className="h-3 w-3" />
          {t("Sold")}
        </Badge>
      );
    }
    return <Badge variant="outline">{ticket.status}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const usedTickets = tickets.filter(ticket => ticket.is_used).length;
  const availableTickets = tickets.filter(ticket => !ticket.is_used).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            {t("Batch Tickets")} - {batch?.name || `Batch #${batch?.id}`}
          </DialogTitle>
          <DialogDescription>
            {t("View and manage all tickets in this batch")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {/* Batch Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Total Tickets")}</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tickets.length}</div>
                <p className="text-xs text-muted-foreground">
                  {t("In this batch")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Available")}</CardTitle>
                <Check className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{availableTickets}</div>
                <p className="text-xs text-muted-foreground">
                  {t("Ready to use")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Used")}</CardTitle>
                <X className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{usedTickets}</div>
                <p className="text-xs text-muted-foreground">
                  {t("Already used")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Created By")}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{batch?.created_by?.name || 'System'}</div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(batch?.created_at)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Print Button */}
          <div className="flex justify-end">
            <Button
              onClick={handlePrintBatchTickets}
              disabled={printing || tickets.length === 0}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              {printing ? t("Downloading PDF...") : t("Download PDF")}
            </Button>
          </div>

          {/* Tickets Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("Tickets in Batch")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>{t("Barcode")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead>{t("Game")}</TableHead>
                    <TableHead>{t("Sale Info")}</TableHead>
                    <TableHead>{t("Created Date")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        <Loader />
                      </TableCell>
                    </TableRow>
                  ) : tickets.length > 0 ? (
                    tickets.map((ticket, index) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center gap-2">
                            <QrCode className="h-4 w-4 text-muted-foreground" />
                            {ticket.barcode || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(ticket)}
                        </TableCell>
                        <TableCell>
                          {ticket.game ? (
                            <div className="flex items-center gap-2">
                              <Ticket className="h-4 w-4 text-muted-foreground" />
                              {ticket.game.name}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {ticket.sale ? (
                            <div className="text-sm">
                              <div className="font-medium">Sale #{ticket.sale.id}</div>
                              <div className="text-muted-foreground">
                                ${ticket.sale.amount || '0'}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDate(ticket.created_at)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        <NoRecordFound />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            {t("Close")}
          </Button>
          <Button
            onClick={handlePrintBatchTickets}
            disabled={printing || tickets.length === 0}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            {printing ? t("Downloading PDF...") : t("Download PDF")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchTicketsDialog; 