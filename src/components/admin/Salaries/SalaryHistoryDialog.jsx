import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  DollarSign, 
  FileText,
  User,
  Calendar,
  TrendingUp,
  TrendingDown,
  Download
} from "lucide-react";
import { useTranslation } from "react-i18next";
import axiosClient from "@/axios";
import { handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import NoRecordFound from "@/components/NoRecordFound";

const SalaryHistoryDialog = ({ 
  open, 
  onOpenChange, 
  userId,
  salaryId
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [reportHistory, setReportHistory] = useState(null);

  useEffect(() => {
    if (open && userId && salaryId) {
      fetchReportHistory();
    }
  }, [open, userId, salaryId]);

  const fetchReportHistory = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`salaries/user/${userId}/${salaryId}/history`);
      setReportHistory(response.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `OMR ${parseFloat(amount).toFixed(2)}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { className: "bg-orange-500 text-white", label: t("Pending") },
      submitted: { className: "bg-blue-500 text-white", label: t("Submitted") },
      settled: { className: "bg-green-500 text-white", label: t("Settled") },
      completed: { className: "bg-gray-600 text-white", label: t("Completed") }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge className={`${config.className} text-xs`}>
        {config.label}
      </Badge>
    );
  };

  if (!reportHistory && !loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("Daily Reports History")}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <div className="text-center">
              {t("No data available")}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("Daily Reports History")} - {reportHistory?.user?.name}
          </DialogTitle>
          <DialogDescription>
            {t("View all daily reports for this salary cycle")}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader />
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("Employee Information")}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("Name")}</p>
                  <p className="font-medium">{reportHistory?.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("Email")}</p>
                  <p className="font-medium">{reportHistory?.user?.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Daily Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Daily Reports")} ({reportHistory?.salaries?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {reportHistory?.salaries?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Report Date")}</TableHead>
                        <TableHead>{t("Game Sales")}</TableHead>
                        <TableHead>{t("Product Revenue")}</TableHead>
                        <TableHead>{t("Total Amount")}</TableHead>
                        <TableHead>{t("Status")}</TableHead>
                        <TableHead>{t("Submitted At")}</TableHead>
                        <TableHead>{t("Settled At")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportHistory.salaries.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {new Date(report.date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="h-3 w-3" />
                              <span className="font-medium">{formatCurrency(report.total_sales)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-blue-600">
                              <DollarSign className="h-3 w-3" />
                              <span className="font-medium">{formatCurrency(report.total_revenue)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 font-bold text-purple-600">
                              <DollarSign className="h-3 w-3" />
                              <span>{formatCurrency(report.total_amount)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(report.status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {report.submitted_at ? new Date(report.submitted_at).toLocaleDateString() : t("Not submitted")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {report.settled_at ? new Date(report.settled_at).toLocaleDateString() : t("Not settled")}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <NoRecordFound />
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SalaryHistoryDialog; 