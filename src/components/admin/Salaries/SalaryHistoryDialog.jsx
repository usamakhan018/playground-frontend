import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  userId
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [salaryHistory, setSalaryHistory] = useState(null);

  useEffect(() => {
    if (open && userId) {
      fetchSalaryHistory();
    }
  }, [open, userId]);

  const fetchSalaryHistory = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`salaries/user/${userId}/history`);
      setSalaryHistory(response.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `OMR ${parseFloat(amount).toFixed(2)}`;
  };

  const handleDownloadSlip = async (salaryId) => {
    try {
      const response = await axiosClient.get(`salaries/slip/${salaryId}`);
      if (response.data.data.slip_url) {
        window.open(response.data.data.slip_url, '_blank');
      }
    } catch (error) {
      handleError(error);
    }
  };

  if (!salaryHistory && !loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("Salary History")}</DialogTitle>
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("Salary History")} - {salaryHistory?.user?.name}
          </DialogTitle>
          <DialogDescription>
            {t("View all salary payments for this user")}
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
                  <p className="font-medium">{salaryHistory?.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("Email")}</p>
                  <p className="font-medium">{salaryHistory?.user?.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Salary History Table */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Salary Records")}</CardTitle>
              </CardHeader>
              <CardContent>
                {salaryHistory?.salaries?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Salary Date")}</TableHead>
                        <TableHead>{t("Gross Amount")}</TableHead>
                        <TableHead>{t("Total Expenses")}</TableHead>
                        <TableHead>{t("Final Amount")}</TableHead>
                        <TableHead>{t("Paid By")}</TableHead>
                        <TableHead>{t("Paid At")}</TableHead>
                        <TableHead className="text-right">{t("Actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salaryHistory.salaries.map((salary) => (
                        <TableRow key={salary.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {new Date(salary.salary_date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="h-3 w-3" />
                              <span className="font-medium">{formatCurrency(salary.gross_amount)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-red-600">
                              <TrendingDown className="h-3 w-3" />
                              <span className="font-medium">{formatCurrency(salary.total_expenses)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 font-bold text-blue-600">
                              <DollarSign className="h-3 w-3" />
                              <span>{formatCurrency(salary.final_amount)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{salary.paid_by_user?.name}</div>
                              <div className="text-muted-foreground">{salary.paid_by_user?.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(salary.paid_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {salary.slip_path ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadSlip(salary.id)}
                              >
                                <Download className="mr-1 h-3 w-3" />
                                {t("Slip")}
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">{t("No slip")}</span>
                            )}
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