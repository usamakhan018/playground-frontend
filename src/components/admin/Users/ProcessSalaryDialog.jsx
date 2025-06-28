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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DollarSign, 
  FileText,
  AlertCircle,
  Calculator,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useTranslation } from "react-i18next";
import axiosClient from "@/axios";
import { handleError } from "@/utils/helpers";

const ProcessSalaryDialog = ({ 
  open, 
  onOpenChange, 
  userId,
  onSalaryProcessed
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [salaryData, setSalaryData] = useState(null);
  const [fixedSalary, setFixedSalary] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && userId) {
      fetchSalaryData();
    }
  }, [open, userId]);

  const fetchSalaryData = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`salaries/salary-data/${userId}`);
      setSalaryData(response.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!fixedSalary || parseFloat(fixedSalary) <= 0) {
      newErrors.fixedSalary = t("Salary amount must be greater than 0");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProcessSalary = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axiosClient.post('salaries/process', {
        user_id: userId,
        fixed_salary: parseFloat(fixedSalary),
        notes: notes
      });

      onSalaryProcessed();
      onOpenChange(false);
      setFixedSalary("");
      setNotes("");
      setErrors({});
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!salaryData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("Process Salary")}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <div className="text-center">
              {loading ? t("Loading...") : t("No data available")}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t("Process Salary")} - {salaryData.user.name}
          </DialogTitle>
          <DialogDescription>
            {t("Review and process salary for submitted reports")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t("Total Sales")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  OMR {salaryData.totals.total_sales || '0.00'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("Games")}: OMR {salaryData.totals.total_game_sales || '0.00'} | {t("Products")}: OMR {salaryData.totals.total_product_sales || '0.00'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t("Total Expenses")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  OMR {salaryData.totals.total_expenses || '0.00'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t("Net Amount")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  salaryData.totals.net_amount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  OMR {salaryData.totals.net_amount || '0.00'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t("Reports Count")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {salaryData.totals.reports_count || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Submitted Reports")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Date")}</TableHead>
                    <TableHead>{t("Revenue")}</TableHead>
                    <TableHead>{t("Collection")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaryData.submitted_reports?.length > 0 ? (
                    salaryData.submitted_reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="text-green-600 font-medium">
                              OMR {report.total_revenue || '0.00'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("Games")}: OMR {report.game_revenue || '0.00'} | {t("Products")}: OMR {report.product_revenue || '0.00'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-blue-600">
                          OMR {report.collection_amount || '0.00'}
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                            {t("Submitted")}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        {t("No submitted reports found")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Salary Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Salary Payment")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fixedSalary" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {t("Fixed Salary Amount")} *
                </Label>
                <Input
                  id="fixedSalary"
                  type="number"
                  step="0.01"
                  min="0"
                  value={fixedSalary}
                  onChange={(e) => {
                    setFixedSalary(e.target.value);
                    if (errors.fixedSalary) {
                      setErrors(prev => ({ ...prev, fixedSalary: null }));
                    }
                  }}
                  placeholder={t("Enter fixed salary amount")}
                  className={errors.fixedSalary ? "border-red-500" : ""}
                />
                {errors.fixedSalary && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.fixedSalary}
                  </p>
                )}
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
                  placeholder={t("Add any notes about the salary payment...")}
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {notes.length}/500 {t("characters")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">{t("Important")}</p>
                <p className="text-yellow-700">
                  {t("Processing salary will mark all submitted reports as settled and create a salary record.")}
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
            onClick={handleProcessSalary}
            disabled={loading || !fixedSalary || parseFloat(fixedSalary) <= 0}
          >
            {loading ? t("Processing...") : t("Pay Salary")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessSalaryDialog; 