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
import { Link, useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  RefreshCw,
  SearchIcon,
  Eye,
  DollarSign,
  FileText,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Settings
} from "lucide-react";
import { can, handleError, humanizeText } from "@/utils/helpers";
import Loader from "@/components/Loader";
import { useTranslation } from "react-i18next";
import ConfirmPaymentDialog from "./ConfirmPaymentDialog";
import MarkAsSettledDialog from "./MarkAsSettledDialog";
import FilterComponent from "@/components/misc/FilterComponent";

const DailyReportsIndex = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [showRefresh, setShowRefresh] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSettleDialog, setShowSettleDialog] = useState(false);
  const [confirmAmount, setConfirmAmount] = useState("");
  const [confirmNotes, setConfirmNotes] = useState("");
  const [settleNotes, setSettleNotes] = useState("");
  const [settleLoading, setSettleLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total_reports: 0,
    pending_reports: 0,
    submitted_reports: 0,
    total_pending_amount: 0
  });

  const navigate = useNavigate();
  const { t } = useTranslation();

  const accessAbility = can("Daily Report access");
  const settleAbility = can("Daily Report settle");

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'settled', label: 'Settled' },
    { value: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    if (!accessAbility) navigate("/unauthorized");
    fetchReports(currentPage, currentFilters);
  }, [currentPage, currentFilters]);

  const fetchReports = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({ page: page.toString() });

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (typeof value === 'object' && value.value !== undefined) {
            // Handle react-select object
            if (value.value !== '') {
              params.append(key, value.value);
            }
          } else if (value !== '') {
            // Handle regular value
            params.append(key, value);
          }
        }
      });

      const response = await axiosClient.get(`daily-reports/all-reports?${params}`);

      setLinks(response.data.data.links);
      setReports(response.data.data.data);

      // Calculate stats from the API response
      const apiStats = {
        total_reports: response.data.data.total || response.data.data.data.length,
        pending_reports: response.data.data.data.filter(r => r.status === 'pending').length,
        submitted_reports: response.data.data.data.filter(r => r.status === 'submitted').length,
        total_pending_amount: response.data.data.data
          .filter(r => r.status === 'pending')
          .reduce((sum, r) => sum + (r.total_revenue || 0), 0)
      };
      setStats(apiStats);

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
      const response = await axiosClient.get(`daily-reports/pending?query=${search.trim()}`);
      setReports(response.data.data.data);
      setLinks([]);

      // Update stats for search results
      const searchStats = {
        total_reports: response.data.data.data.length,
        pending_reports: response.data.data.data.filter(r => r.status === 'pending').length,
        submitted_reports: response.data.data.data.filter(r => r.status === 'submitted').length,
        total_pending_amount: response.data.data.data
          .filter(r => r.status === 'pending')
          .reduce((sum, r) => sum + (r.total_revenue || 0), 0)
      };
      setStats(searchStats);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearch("");
    setShowRefresh(false);
    setCurrentFilters({});
    fetchReports(1, {});
  };

  const handleFilter = (filters) => {
    setCurrentFilters(filters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setCurrentFilters({});
    setCurrentPage(1);
  };

  const handleConfirmPayment = async () => {
    if (!selectedReport || !confirmAmount) return;

    try {
      const response = await axiosClient.post('daily-reports/submit-report', {
        report_id: selectedReport.report.id,
        amount_received: parseFloat(confirmAmount),
        notes: confirmNotes
      });

      // Refresh the reports list
      fetchReports(currentPage, currentFilters);

      // Close dialogs and reset form
      setShowConfirmDialog(false);
      setConfirmAmount("");
      setConfirmNotes("");
      setSelectedReport(null);

    } catch (error) {
      handleError(error);
    }
  };

  const handleMarkAsSettled = async () => {
    if (!selectedReport) return;

    setSettleLoading(true);
    try {
      const response = await axiosClient.post('daily-reports/mark-as-settled', {
        report_id: selectedReport.report.id,
        notes: settleNotes
      });

      // Refresh the reports list
      fetchReports(currentPage, currentFilters);

      // Close dialogs and reset form
      setShowSettleDialog(false);
      setSettleNotes("");
      setSelectedReport(null);

    } catch (error) {
      handleError(error);
    } finally {
      setSettleLoading(false);
    }
  };

  // const getStatusBadge = (status) => {
  //   const variants = {
  //     pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  //     submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  //     settled: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  //   };

  //   return (
  //     <Badge className={variants[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}>
  //       {status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
  //       {status === 'submitted' && <AlertCircle className="h-3 w-3 mr-1" />}
  //       {status === 'settled' && <CheckCircle className="h-3 w-3 mr-1" />}
  //       {t(status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown')}
  //     </Badge>
  //   );
  // };

  const renderCollectionInfo = (report) => {
    if (report.status === 'pending') {
      return (
        <div className="text-sm text-muted-foreground">
          {t("Not collected yet")}
        </div>
      );
    }

    if (report.status === 'submitted' && report.submitted_to) {
      return (
        <div className="text-sm">
          <div className="font-medium">{report.submitted_to.name}</div>
          <div className="text-muted-foreground">
            {new Date(report.submitted_at).toLocaleDateString()}
          </div>
          {report.money_collection && (
            <div className="text-green-600 dark:text-green-400 font-medium">
              OMR {parseFloat(report.money_collection.amount).toFixed(2)}
            </div>
          )}
        </div>
      );
    }

    if (report.status === 'settled') {
      return (
        <div className="text-sm">
          <div className="font-medium text-green-600 dark:text-green-400">{t("Settled")}</div>
          <div className="text-muted-foreground">
            {report.settled_at ? new Date(report.settled_at).toLocaleDateString() : 'N/A'}
          </div>
          {report.settled_by_user && (
            <div className="text-xs text-muted-foreground">
              {t("By")}: {report.settled_by_user.name}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="text-sm text-muted-foreground">
        {t("N/A")}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title={t("Daily Reports")} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchReports(currentPage, currentFilters)}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? t("Refreshing...") : t("Refresh")}
        </Button>
      </div>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/*   
        <Card className="border dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Reports")}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_reports}</div>
            <p className="text-xs text-muted-foreground">
              {t("All daily reports")}
            </p>
          </CardContent>
        </Card> */}

        <Card className="border dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Pending Reports")}</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending_reports}</div>
            <p className="text-xs text-muted-foreground">
              {t("Awaiting collection")}
            </p>
          </CardContent>
        </Card>

        <Card className="border dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Submitted Reports")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.submitted_reports}</div>
            <p className="text-xs text-muted-foreground">
              {t("Money collected")}
            </p>
          </CardContent>
        </Card>

        <Card className="border dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Pending Amount")}</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              OMR {parseFloat(stats.total_pending_amount).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("To be collected")}
            </p>
          </CardContent>
        </Card>

        {/* Collected Amount Card */}
        <Card className="border dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Collected Amount")}</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              OMR {parseFloat(stats.total_collected_amount ? stats.total_collected_amount : 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Collected from customers")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FilterComponent
        onFilter={handleFilter}
        onReset={handleResetFilters}
        statusOptions={statusOptions}
        defaultStatus="pending"
        loading={loading}
      />

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {t("Daily reports management with filtering options")}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex gap-2">
            <Input
              id="search"
              name="search"
              value={search}
              placeholder={t("Search reports")}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
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

      {/* Reports Table */}
      <div className="bg-background border rounded-lg dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>{t("Date")}</TableHead>
              <TableHead>{t("Sales Manager")}</TableHead>
              <TableHead>{t("Total Sales")}</TableHead>
              <TableHead>{t("Total Revenue / Expenses")}</TableHead>
              <TableHead>{t("Status")}</TableHead>
              <TableHead>{t("Collection Info")}</TableHead>
              <TableHead className="text-right w-[200px]">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : reports.length > 0 ? (
              reports.map((report, index) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(report.created_at).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{report.sales_manager.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {report.sales_manager.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{report.total_transactions}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t("Games")}: {report.total_game_sales || 0} | {t("Products")}: {report.total_product_sales || 0}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {console.log("report", report)}
                    <div className="flex items-center gap-1 font-bold">
                      <span>OMR <span className="text-green-600 dark:text-green-400">{parseFloat(report.total_revenue).toFixed(2)}</span> / <span className="text-red-600 dark:text-red-400">{parseFloat(report.expenses.filter(expense => expense.status === 'approved').reduce((sum, expense) => sum + expense.amount, 0)).toFixed(2)}</span></span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={report.status}>{humanizeText(report.status)}</Badge></TableCell>
                  <TableCell>{renderCollectionInfo(report)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Action Buttons */}
                      {report.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedReport({ report });
                            setConfirmAmount(report.total_revenue.toString());
                            setShowConfirmDialog(true);
                          }}
                          className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                        >
                          <DollarSign className="mr-1 h-3 w-3" />
                          {t("Collect")}
                        </Button>
                      )}

                      {report.status === 'submitted' && settleAbility && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedReport({ report });
                            setShowSettleDialog(true);
                          }}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
                        >
                          <Settings className="mr-1 h-3 w-3" />
                          {t("Settle")}
                        </Button>
                      )}

                      {report.status === 'settled' && (
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {t("Completed")}
                        </div>
                      )}

                      {/* Dropdown Menu for Other Actions */}
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
                          <Link to={`/daily-reports/view/${report.id}`}>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("View Details")}
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
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

      {/* Dialogs */}
      <ConfirmPaymentDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        reportData={selectedReport}
        amount={confirmAmount}
        setAmount={setConfirmAmount}
        notes={confirmNotes}
        setNotes={setConfirmNotes}
        onSubmit={handleConfirmPayment}
      />

      <MarkAsSettledDialog
        open={showSettleDialog}
        onOpenChange={setShowSettleDialog}
        reportData={selectedReport}
        notes={settleNotes}
        setNotes={setSettleNotes}
        onMarkAsSettled={handleMarkAsSettled}
        loading={settleLoading}
      />
    </div>
  );
};

export default DailyReportsIndex; 