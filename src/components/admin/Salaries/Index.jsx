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
  CardDescription,
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
import { 
  MoreHorizontal, 
  RefreshCw, 
  SearchIcon, 
  Eye, 
  DollarSign,
  FileText,
  Calculator,
  User,
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock
} from "lucide-react";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import { useTranslation } from "react-i18next";
import ProcessSalaryDialog from "../Users/ProcessSalaryDialog";
import SalaryHistoryDialog from "./SalaryHistoryDialog";
import { useDispatch } from "react-redux";
import FilterComponent from "@/components/misc/FilterComponent";

const SalaryIndex = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [salaryData, setSalaryData] = useState([]);
  const [search, setSearch] = useState("");
  const [showRefresh, setShowRefresh] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({ report_status: 'settled' });
  const [stats, setStats] = useState({
    total_users: 0,
    total_pending_salaries: 0,
    total_submitted_reports: 0,
    total_pending_amount: 0
  });

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dispatch } = useDispatch();

  const accessAbility = can("Salary access");
  const processAbility = can("Salary create");

  const reportStatusOptions = [
    { value: 'settled', label: 'Settled' },
    { value: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    if (!accessAbility) navigate("/unauthorized");
    fetchSalaryData(currentPage, currentFilters);
  }, [currentPage, currentFilters]);

  const fetchSalaryData = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({ page: page.toString() });
      
      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await axiosClient.get(`salaries/index-data?${params}`);
      
      setSalaryData(response.data.data.data);
      setStats(response.data.data.stats);
      
      // Set pagination links if available
      if (response.data.data.pagination) {
        const pagination = response.data.data.pagination;
        setLinks(pagination.links || []);
      }
      
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    setShowRefresh(true);
    try {
      const response = await axiosClient.get(`salaries/index-data?query=${search.trim()}`);
      setSalaryData(response.data.data.data);
      setStats(response.data.data.stats);
      setLinks([]);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearch("");
    setShowRefresh(false);
    setCurrentFilters({ report_status: 'settled' });
    fetchSalaryData(1, { report_status: 'settled' });
  };

  const handleFilter = (filters) => {
    // Ensure we always have a report_status filter for salary processing
    const salaryFilters = { report_status: 'settled', ...filters };
    setCurrentFilters(salaryFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setCurrentFilters({ report_status: 'settled' });
    setCurrentPage(1);
  };

  const handleProcessSalary = (userId) => {
    setSelectedUserId(userId);
    setShowProcessDialog(true);
  };

  const handleSalaryProcessed = () => {
    // Refresh the data after salary is processed
    fetchSalaryData();
  };

  const formatCurrency = (amount) => {
    return `OMR ${parseFloat(amount).toFixed(2)}`;
  };

  const getDaysAgo = (dateString) => {
    if (!dateString) return t("Never");
    
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return t("Today");
    } else if (diffDays === 1) {
      return t("1 day ago");
    } else {
      return `${diffDays} ${t("days ago")}`;
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle title={t("Salary Management")} />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Users")}</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users}</div>
            <p className="text-xs text-muted-foreground">
              {t("With submitted reports")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Pending Salaries")}</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.total_pending_salaries}</div>
            <p className="text-xs text-muted-foreground">
              {t("Awaiting processing")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Reports")}</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total_submitted_reports}</div>
            <p className="text-xs text-muted-foreground">
              {t("Submitted reports")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FilterComponent
        onFilter={handleFilter}
        onReset={handleResetFilters}
        statusOptions={reportStatusOptions.map(option => ({
          value: option.value,
          label: option.label
        }))}
        defaultStatus="settled"
        loading={loading}
        showStatusFilter={false} // Hide status filter since we manage report_status separately
      />

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {t("Manage employee salaries and payroll")}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex gap-2">
            <Input
              id="search"
              name="search"
              value={search}
              placeholder={t("Search by employee name or email...")}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Button type="submit" aria-label={t("Search")}>
              <SearchIcon className="h-4 w-4" />
            </Button>
            {showRefresh && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRefresh}
                aria-label={t("Refresh")}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Salary Table */}
      <div className="bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>{t("Employee")}</TableHead>
              <TableHead>{t("Reports Count")}</TableHead>
              <TableHead>{t("Total Revenue")}</TableHead>
              <TableHead>{t("Total Expenses")}</TableHead>
              <TableHead>{t("Net Amount")}</TableHead>
              <TableHead>{t("Latest Report")}</TableHead>
              <TableHead>{t("Last Salary")}</TableHead>
              <TableHead className="text-right w-[150px]">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-24">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : salaryData.length > 0 ? (
              salaryData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">{item.user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3 text-blue-600" />
                      <span className="font-medium text-blue-600">{item.submitted_reports_count}</span>
                      <span className="text-xs text-muted-foreground">{t("reports")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <span>{formatCurrency(item.total_revenue)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium text-red-600">
                      <TrendingDown className="h-3 w-3" />
                      <span>{formatCurrency(item.total_expenses)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 font-bold ${
                      item.net_amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <DollarSign className="h-3 w-3" />
                      <span>{formatCurrency(item.net_amount)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(item.latest_report_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {getDaysAgo(item.last_salary_date)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {processAbility && (
                        <Button
                          size="sm"
          
                          onClick={() => handleProcessSalary(item.user.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Calculator className="mr-1 h-3 w-3" />
                          {t("Process")}
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">{t("Open menu")}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(item.user.id);
                            setShowHistoryDialog(true);
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("Salary History")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-24">
                  <NoRecordFound />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {links.length > 0 && (
          <Pagination
            links={links}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            className="p-4"
          />
        )}
      </div>

      {/* Process Salary Dialog */}
      <ProcessSalaryDialog
        open={showProcessDialog}
        onOpenChange={setShowProcessDialog}
        userId={selectedUserId}
        onSalaryProcessed={handleSalaryProcessed}
      />

      {/* Salary History Dialog */}
      <SalaryHistoryDialog
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
        userId={selectedUser}
      />
    </div>
  );
};

export default SalaryIndex;
