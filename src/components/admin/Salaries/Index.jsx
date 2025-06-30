import axiosClient from "@/axios";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageTitle from "../Layouts/PageTitle";
import NoRecordFound from "@/components/NoRecordFound";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { toast } from 'react-hot-toast';
import { 
  RefreshCw, 
  SearchIcon, 
  Eye, 
  Download, 
  MoreHorizontal,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  User,
  Calculator,
  History
} from "lucide-react";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import { useTranslation } from "react-i18next";
import ProcessSalaryDialog from "../Users/ProcessSalaryDialog";
import SalaryHistoryDialog from "./SalaryHistoryDialog";

const SalaryIndex = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [salaries, setSalaries] = useState([]);
  const [search, setSearch] = useState("");
  const [showRefresh, setShowRefresh] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [stats, setStats] = useState({
    total_records: 0,
    total_paid: 0,
    total_pending: 0,
    total_cancelled: 0,
    total_amount: 0,
  });

  const navigate = useNavigate();
  const { t } = useTranslation();

  const accessAbility = can("Salary access");
  const processAbility = can("Salary create"); // Assuming salary processing requires create permission

  useEffect(() => {
    if (!accessAbility) navigate("/unauthorized");
    fetchSalaries(currentPage);
  }, [currentPage]);

  const fetchSalaries = async (page = 1, query = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page });
      if (query) params.append("query", query);
      const response = await axiosClient.get(`salaries/index-data?${params}`);
      if (response.data) {
        setSalaries(response.data.data.data);
        setStats(response.data.data.stats);
        setLinks(response.data.data.pagination.links || []);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => `OMR ${parseFloat(amount || 0).toFixed(2)}`;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setShowRefresh(true);
    fetchSalaries(1, search.trim());
  };

  const handleRefresh = () => {
    setSearch("");
    setShowRefresh(false);
    fetchSalaries();
  };

  const handleProcessSalary = (salary) => {
    setSelectedSalary(salary);
    setShowProcessDialog(true);
  };

  const handleViewHistory = (salary) => {
    setSelectedSalary(salary);
    setShowHistoryDialog(true);
  };

  const handleSalaryProcessed = () => {
    fetchSalaries(currentPage);
    setShowProcessDialog(false);
    toast.success(t("Salary processed successfully"));
  };

  const viewSlip = async (salaryId) => {
    try {
      const resp = await axiosClient.get(`salaries/slip/${salaryId}`);
      if (resp.data.success) {
        window.open(resp.data.data.slip_url, "_blank");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { variant: "default", className: "bg-green-600 text-white", label: t("Paid") },
      pending: { variant: "secondary", className: "bg-orange-500 text-white", label: t("Pending") },
      cancelled: { variant: "destructive", className: "bg-red-600 text-white", label: t("Cancelled") },
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge className={`${config.className} text-xs`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <PageTitle title={t("Salary Management")} />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Records")}</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_records}</div>
            <p className="text-xs text-muted-foreground">
              {t("All salary records")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Paid")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.total_paid)}</div>
            <p className="text-xs text-muted-foreground">
              {t("Successfully paid salaries")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Pending")}</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{formatCurrency(stats.total_pending)}</div>
            <p className="text-xs text-muted-foreground">
              {t("Awaiting payment")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Amount")}</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.total_amount)}</div>
            <p className="text-xs text-muted-foreground">
              {t("Overall total")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1" />
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder={t("Search by employee name or email...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px]"
          />
          <Button type="submit" variant="outline" size="icon">
            <SearchIcon className="h-4 w-4" />
          </Button>
          {showRefresh && (
            <Button type="button" variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </form>
      </div>

      {/* Salary Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Salary Records")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{t("Employee")}</TableHead>
                <TableHead>{t("Salary Date")}</TableHead>
                <TableHead>{t("Amounts")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead>{t("Paid By")}</TableHead>
                <TableHead className="text-right">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : salaries.length > 0 ? (
                salaries.map((salary, idx) => (
                  <TableRow key={salary.id}>
                    <TableCell className="font-medium">
                      {(currentPage - 1) * 15 + idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{salary.user?.name}</div>
                        <div className="text-xs text-muted-foreground">{salary.user?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(salary.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-green-600 font-medium">
                          <TrendingUp className="h-3 w-3" />
                          <span>{formatCurrency(salary.final_amount)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t("Gross")}: {formatCurrency(salary.gross_amount)} | 
                          {t("Expenses")}: {formatCurrency(salary.total_expenses)}
                        </div>
                        {salary.settled_amount !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            {t("Settled")}: {formatCurrency(salary.settled_amount)} | 
                            {t("Pending")}: {formatCurrency(salary.pending_amount)} | 
                            {t("Submitted")}: {formatCurrency(salary.submitted_amount)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(salary.status)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{salary.paid_by_user?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {salary.paid_at ? new Date(salary.paid_at).toLocaleDateString() : t("Not paid")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t("Open menu")}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          {processAbility && salary.status === "pending" && (
                            <DropdownMenuItem onClick={() => handleProcessSalary(salary)}>
                              <Calculator className="mr-2 h-4 w-4" />
                              {t("Process Salary")}
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem onClick={() => handleViewHistory(salary)}>
                            <History className="mr-2 h-4 w-4" />
                            {t("View History")}
                          </DropdownMenuItem>
                          
                          {salary.slip_path && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => viewSlip(salary.id)}>
                                <Download className="mr-2 h-4 w-4" />
                                {t("Download Slip")}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    <NoRecordFound />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {links.length > 0 && (
            <div className="mt-4">
              <Pagination 
                links={links} 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {showProcessDialog && selectedSalary && (
        <ProcessSalaryDialog
          open={showProcessDialog}
          onOpenChange={setShowProcessDialog}
          userId={selectedSalary.user?.id}
          onSalaryProcessed={handleSalaryProcessed}
        />
      )}

      {showHistoryDialog && selectedSalary && (
        <SalaryHistoryDialog
          open={showHistoryDialog}
          onOpenChange={setShowHistoryDialog}
          userId={selectedSalary.user?.id}
        />
      )}
    </div>
  );
};

export default SalaryIndex;