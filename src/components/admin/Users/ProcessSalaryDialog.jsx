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
import { Badge } from "@/components/ui/badge";
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
  TrendingDown,
  User,
  Calendar,
  CheckCircle,
  Download,
  Receipt
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from 'react-hot-toast';
import axiosClient from "@/axios";
import { handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import NoRecordFound from "@/components/NoRecordFound";

const ProcessSalaryDialog = ({ 
  open, 
  onOpenChange, 
  userId,
  salaryId,
  onSalaryProcessed
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [salaryData, setSalaryData] = useState(null);
  const [fixedSalary, setFixedSalary] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && userId) {
      fetchSalaryData();
      // Reset form when dialog opens
      setFixedSalary("");
      setNotes("");
      setErrors({});
    }
  }, [open, userId]);

  const fetchSalaryData = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`salaries/salary-data/${userId}/${salaryId}`);
      setSalaryData(response.data.data);
    } catch (error) {
      handleError(error);
      // Close dialog if there's an error fetching data
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!fixedSalary || parseFloat(fixedSalary) <= 0) {
      newErrors.fixedSalary = t("Salary amount must be greater than 0");
    }

    if (parseFloat(fixedSalary) > 10000) {
      newErrors.fixedSalary = t("Salary amount seems too high. Please verify.");
    }

    if (notes && notes.length > 500) {
      newErrors.notes = t("Notes cannot exceed 500 characters");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProcessSalary = async () => {
    if (!validateForm()) return;

    try {
      setProcessing(true);
      // Process salary on the server
      await axiosClient.post('salaries/process', {
        user_id: userId,
        fixed_salary: parseFloat(fixedSalary),
        notes: notes.trim()
      });

      // Close dialog and notify parent to refresh data
      onOpenChange(false);
      onSalaryProcessed();

      // Reset form fields
      setFixedSalary("");
      setNotes("");
      setErrors({});
    } catch (error) {
      handleError(error);
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount) => `OMR ${parseFloat(amount || 0).toFixed(2)}`;

  // Loading state
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              {t("Process Salary")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <Loader />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // No data state
  if (!salaryData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              {t("Process Salary")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <div className="text-center space-y-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">{t("No salary data available for this user")}</p>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t("Close")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // No reports to process
  if (!salaryData.settled_reports || salaryData.settled_reports.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              {t("Process Salary")} - {salaryData.user?.name}
            </DialogTitle>
            <DialogDescription>
              {t("No settled reports available for salary processing")}
            </DialogDescription>
          </DialogHeader>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium">{t("No Reports to Process")}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("This employee has no settled reports that haven't been processed for salary yet.")}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("Reports must be marked as 'settled' before they can be included in salary processing.")}
                </p>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("Close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t("Process Salary")} - {salaryData.user?.name}
          </DialogTitle>
          <DialogDescription>
            {t("Review settled reports and process salary payment")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("Employee Information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("Name")}</p>
                <p className="font-medium">{salaryData.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("Email")}</p>
                <p className="font-medium">{salaryData.user?.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Total Sales")}</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(salaryData.totals.total_sales)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("Games")}: {formatCurrency(salaryData.totals.total_game_sales)} | {t("Products")}: {formatCurrency(salaryData.totals.total_product_sales)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Total Expenses")}</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(salaryData.totals.total_expenses)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Net Amount")}</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  salaryData.totals.net_amount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(salaryData.totals.net_amount)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Reports Count")}</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle>{t("Settled Reports to Process")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Date")}</TableHead>
                    <TableHead>{t("Revenue Breakdown")}</TableHead>
                    <TableHead>{t("Collection")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaryData.settled_reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-green-600 font-medium">
                            <TrendingUp className="h-3 w-3" />
                            <span>{formatCurrency(report.total_revenue)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t("Games")}: {formatCurrency(report.game_revenue)} | {t("Products")}: {formatCurrency(report.product_revenue)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-blue-600 font-medium">
                          {formatCurrency(report.collection_amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {t("Settled")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Salary Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {t("Salary Payment Details")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    max="10000"
                    value={fixedSalary}
                    onChange={(e) => {
                      setFixedSalary(e.target.value);
                      if (errors.fixedSalary) {
                        setErrors(prev => ({ ...prev, fixedSalary: null }));
                      }
                    }}
                    placeholder={t("Enter fixed salary amount (OMR)")}
                    className={errors.fixedSalary ? "border-red-500" : ""}
                  />
                  {errors.fixedSalary && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.fixedSalary}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {t("This is the final amount to be paid to the employee")}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">{t("Summary")}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("Gross Revenue")}:</span>
                      <span className="text-green-600">{formatCurrency(salaryData.totals.total_sales)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("Total Expenses")}:</span>
                      <span className="text-red-600">-{formatCurrency(salaryData.totals.total_expenses)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="font-medium">{t("Net Amount")}:</span>
                      <span className={`font-medium ${salaryData.totals.net_amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(salaryData.totals.net_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t("Notes")} ({t("Optional")})
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    if (errors.notes) {
                      setErrors(prev => ({ ...prev, notes: null }));
                    }
                  }}
                  placeholder={t("Add any notes about the salary payment...")}
                  rows={3}
                  maxLength={500}
                  className={errors.notes ? "border-red-500" : ""}
                />
                {errors.notes && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.notes}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {notes.length}/500 {t("characters")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-yellow-800">{t("Important Notice")}</p>
                <p className="text-yellow-700 text-sm">
                  {t("Processing this salary will:")}
                </p>
                <ul className="text-yellow-700 text-sm list-disc list-inside space-y-1 ml-2">
                  <li>{t("Mark all settled reports as 'completed'")}</li>
                  <li>{t("Create a salary record with payment details")}</li>
                  <li>{t("Generate a salary slip automatically")}</li>
                  <li>{t("This action cannot be undone")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={processing}
          >
            {t("Cancel")}
          </Button>
          <Button 
            onClick={handleProcessSalary}
            disabled={processing || !fixedSalary || parseFloat(fixedSalary) <= 0}
            className="min-w-[120px]"
          >
            {processing ? (
              <>
                <Loader className="mr-2 h-4 w-4" />
                {t("Processing...")}
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {t("Pay Salary")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessSalaryDialog; 