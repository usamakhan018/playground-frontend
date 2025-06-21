import axiosClient from "@/axios";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  SearchIcon,
  CreditCard,
  ShoppingCart,
  FileText,
  CheckCircle,
  Eye,
  DollarSign
} from "lucide-react";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import { useTranslation } from "react-i18next";
import ViewReportDialog from "../DailyReports/ViewReportDialog";
import ConfirmPaymentDialog from "../DailyReports/ConfirmPaymentDialog";
import ProcessSalaryDialog from "./ProcessSalaryDialog";

const UserAccount = () => {
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState(null);
  const [transactionLinks, setTransactionLinks] = useState([]);
  const [salesLinks, setSalesLinks] = useState([]);
  const [expensesLinks, setExpensesLinks] = useState([]);
  const [dailyReports, setDailyReports] = useState({ data: [], links: [] });
  const [completedReports, setCompletedReports] = useState({ data: [], links: [] });
  const [transactionPage, setTransactionPage] = useState(1);
  const [salesPage, setSalesPage] = useState(1);
  const [expensesPage, setExpensesPage] = useState(1);
  const [reportsPage, setReportsPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [transactionSearch, setTransactionSearch] = useState("");
  const [salesSearch, setSalesSearch] = useState("");
  const [expensesSearch, setExpensesSearch] = useState("");
  const [showTransactionRefresh, setShowTransactionRefresh] = useState(false);
  const [showSalesRefresh, setShowSalesRefresh] = useState(false);
  const [showExpensesRefresh, setShowExpensesRefresh] = useState(false);
  const [refreshingBalance, setRefreshingBalance] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAmount, setConfirmAmount] = useState("");
  const [confirmNotes, setConfirmNotes] = useState("");
  const [salaries, setSalaries] = useState({ data: [], links: [] });
  const [salariesPage, setSalariesPage] = useState(1);
  const [showSalaryDialog, setShowSalaryDialog] = useState(false);

  const navigate = useNavigate();
  const { userId } = useParams();
  const { t } = useTranslation();

  const accessAbility = can("User access");

  useEffect(() => {
    if (!accessAbility) navigate("/unauthorized");
    fetchAccountData();
    fetchDailyReports();
    fetchCompletedReports();
    fetchSalaries();
  }, [userId]);

  const fetchAccountData = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`accounts/user/${userId}`);
      setAccountData(response.data.data);
      setTransactionLinks(response.data.data.transactions.links || []);
      setSalesLinks(response.data.data.sales.links || []);
      setExpensesLinks(response.data.data.expenses.links || []);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (page = 1, query = "") => {
    try {
      const url = query
        ? `accounts/user/${userId}/transactions?query=${query.trim()}`
        : `accounts/user/${userId}/transactions?page=${page}`;

      const response = await axiosClient.get(url);
      setAccountData(prev => ({
        ...prev,
        transactions: response.data.data
      }));
      setTransactionLinks(response.data.data.links || []);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchSales = async (page = 1, query = "") => {
    try {
      const url = query
        ? `accounts/user/${userId}/sales?query=${query.trim()}`
        : `accounts/user/${userId}/sales?page=${page}`;

      const response = await axiosClient.get(url);
      setAccountData(prev => ({
        ...prev,
        sales: response.data.data
      }));
      setSalesLinks(response.data.data.links || []);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchExpenses = async (page = 1, query = "") => {
    try {
      const url = query
        ? `accounts/user/${userId}/expenses?query=${query.trim()}`
        : `accounts/user/${userId}/expenses?page=${page}`;

      const response = await axiosClient.get(url);
      setAccountData(prev => ({
        ...prev,
        expenses: response.data.data
      }));
      setExpensesLinks(response.data.data.links || []);
    } catch (error) {
      handleError(error);
    }
  };

  const handleTransactionSearch = async (e) => {
    e.preventDefault();
    if (!transactionSearch.trim()) return;

    setShowTransactionRefresh(true);
    await fetchTransactions(1, transactionSearch);
    setTransactionLinks([]);
  };

  const handleSalesSearch = async (e) => {
    e.preventDefault();
    if (!salesSearch.trim()) return;

    setShowSalesRefresh(true);
    await fetchSales(1, salesSearch);
    setSalesLinks([]);
  };

  const handleExpensesSearch = async (e) => {
    e.preventDefault();
    if (!expensesSearch.trim()) return;

    setShowExpensesRefresh(true);
    await fetchExpenses(1, expensesSearch);
    setExpensesLinks([]);
  };

  const handleTransactionRefresh = () => {
    setTransactionSearch("");
    setShowTransactionRefresh(false);
    fetchTransactions();
  };

  const handleSalesRefresh = () => {
    setSalesSearch("");
    setShowSalesRefresh(false);
    fetchSales();
  };

  const handleExpensesRefresh = () => {
    setExpensesSearch("");
    setShowExpensesRefresh(false);
    fetchExpenses();
  };

  const handleTransactionPageChange = (page) => {
    setTransactionPage(page);
    fetchTransactions(page);
  };

  const handleSalesPageChange = (page) => {
    setSalesPage(page);
    fetchSales(page);
  };

  const handleExpensesPageChange = (page) => {
    setExpensesPage(page);
    fetchExpenses(page);
  };

  const handleRefreshBalance = async () => {
    setRefreshingBalance(true);
    try {
      const response = await axiosClient.post(`accounts/user/${userId}/refresh-balance`);

      // Update the account data with new balance information
      setAccountData(prev => ({
        ...prev,
        account: {
          ...prev.account,
          balance: response.data.data.balance,
          raw_balance: response.data.data.raw_balance
        },
        summary: response.data.data.summary
      }));
    } catch (error) {
      handleError(error);
    } finally {
      setRefreshingBalance(false);
    }
  };

  const fetchDailyReports = async (page = 1) => {
    try {
      const response = await axiosClient.get(`daily-reports/user/${userId}?page=${page}`);
      setDailyReports(response.data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchCompletedReports = async (page = 1) => {
    try {
      const response = await axiosClient.get(`daily-reports/user/${userId}/completed?page=${page}`);
      setCompletedReports(response.data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleViewReport = async (reportId) => {
    try {
      const response = await axiosClient.get(`daily-reports/show/${reportId}`);
      setSelectedReport(response.data.data);
      setShowReportDialog(true);
    } catch (error) {
      handleError(error);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedReport || !confirmAmount) return;

    try {
      const response = await axiosClient.post('daily-reports/submit-report', {
        report_id: selectedReport.report.id,
        amount_received: parseFloat(confirmAmount),
        notes: confirmNotes
      });

      // Refresh the reports and account data
      fetchDailyReports();
      fetchCompletedReports();
      fetchAccountData(); // Refresh account balance and stats

      // Close dialogs and reset form
      setShowConfirmDialog(false);
      setShowReportDialog(false);
      setConfirmAmount("");
      setConfirmNotes("");
      setSelectedReport(null);

    } catch (error) {
      handleError(error);
    }
  };

  const handleReportsPageChange = (page) => {
    setReportsPage(page);
    fetchDailyReports(page);
  };

  const handleCompletedPageChange = (page) => {
    setCompletedPage(page);
    fetchCompletedReports(page);
  };

  const fetchSalaries = async (page = 1) => {
    try {
      const response = await axiosClient.get(`salaries/user/${userId}?page=${page}`);
      setSalaries(response.data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSalariesPageChange = (page) => {
    setSalariesPage(page);
    fetchSalaries(page);
  };

  const handleSalaryProcessed = () => {
    fetchSalaries();
    fetchDailyReports();
    fetchCompletedReports();
    fetchAccountData();
  };

  const handleViewSalarySlip = async (salaryId) => {
    try {
      const response = await axiosClient.get(`salaries/slip/${salaryId}`);
      if (response.data.data.slip_url) {
        window.open(response.data.data.slip_url, '_blank');
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getTransactionTypeColor = (type) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionIcon = (type) => {
    return type === 'credit' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getStatusBadge = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      available: 'bg-blue-100 text-blue-800',
      sold: 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {t(status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("Back")}
          </Button>
          <PageTitle title={t("Account Details")} />
        </div>
        <NoRecordFound />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("Back")}
          </Button>
          <PageTitle title={`${accountData.user.name} - ${t("Account Details")}`} />
        </div>
        <Button 
          onClick={() => {
            fetchAccountData();
            fetchDailyReports();
            fetchCompletedReports();
            fetchSalaries();
          }}
          disabled={loading}
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {t("Refresh")}
        </Button>
      </div>

      {/* User Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("User Information")}
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{accountData.user.name}</div>
              <p className="text-xs text-muted-foreground">
                {accountData.user.email}
              </p>
              {accountData.user.phone && (
                <p className="text-xs text-muted-foreground">
                  {accountData.user.phone}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Account Balance")}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshBalance}
                disabled={refreshingBalance}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`h-4 w-4 ${refreshingBalance ? 'animate-spin' : ''}`} />
              </Button>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${accountData.account.raw_balance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                OMR {accountData.account.balance || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("Current available balance")}
              </p>
              {accountData.summary && (
                <div className="text-xs space-y-1 pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("Total Credits")}:</span>
                    <span className="text-green-600 font-medium">
                      +OMR {accountData.summary.total_credits || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("Total Debits")}:</span>
                    <span className="text-red-600 font-medium">
                      -OMR {accountData.summary.total_debits || '0.00'}
                    </span>
                  </div>
                  <div className="pt-1 mt-1 border-t border-dashed">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-[10px]">{t("Pending Credits")}:</span>
                      <span className="text-green-500 font-medium text-[10px]">
                        +OMR {accountData.summary.pending_reports_credits || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-[10px]">{t("Pending Debits")}:</span>
                      <span className="text-red-500 font-medium text-[10px]">
                        -OMR {accountData.summary.pending_reports_debits || '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Quick Stats")}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Total Transactions")}:</span>
                <span className="font-medium">
                  {accountData.summary?.transactions_count || accountData.transactions.total || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Total Sales")}:</span>
                <span className="font-medium">
                  {accountData.summary?.sales_count || accountData.sales.total || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Total Expenses")}:</span>
                <span className="font-medium text-red-600">
                  {accountData.summary?.expenses_count || accountData.expenses?.total || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Total Expense Amount")}:</span>
                <span className="font-medium text-red-600">
                  OMR {accountData.summary?.total_expenses_amount || '0.00'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Daily Reports")}:</span>
                <span className="font-medium">
                  {accountData.summary?.daily_reports_count || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Submitted Reports")}:</span>
                <span className="font-medium text-orange-600">
                  {accountData.summary?.submitted_reports_count || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Settled Reports")}:</span>
                <span className="font-medium text-green-600">
                  {accountData.summary?.settled_reports_count || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Total Collections")}:</span>
                <span className="font-medium text-blue-600">
                  OMR {accountData.summary?.total_collections_amount || '0.00'}
                </span>
              </div>
              {accountData.account.raw_balance !== undefined && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{t("Net Balance")}:</span>
                    <span className={`font-bold ${accountData.account.raw_balance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                      OMR {Math.abs(accountData.account.raw_balance).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Transactions, Sales, and Reports */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            {t("Transactions")}
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            {t("Sales")}
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {t("Expenses")}
          </TabsTrigger>
          {/* <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t("Daily Reports")}
          </TabsTrigger> */}
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {t("Completed Reports")}
          </TabsTrigger>
          <TabsTrigger value="salaries" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {t("Salaries")}
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <CardTitle>{t("Transaction History")}</CardTitle>
                  <CardDescription>
                    {t("View all transactions for this user")}
                  </CardDescription>
                </div>
                <form onSubmit={handleTransactionSearch} className="flex gap-2">
                  <Input
                    value={transactionSearch}
                    placeholder={t("Search transactions")}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                    className="w-48"
                  />
                  <Button type="submit" aria-label={t("Search")}>
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                  {showTransactionRefresh && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTransactionRefresh}
                      aria-label={t("Refresh")}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </form>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>{t("Amount")}</TableHead>
                    <TableHead>{t("Type")}</TableHead>
                    <TableHead>{t("Description")}</TableHead>
                    <TableHead>{t("Date")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountData.transactions?.data?.length > 0 ? (
                    accountData.transactions.data.map((transaction, index) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className={`font-medium ${getTransactionTypeColor(transaction.type)}`}>
                          <div className="flex items-center gap-2">
                            {getTransactionIcon(transaction.type)}
                            OMR {transaction.amount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === 'credit' ? 'default' : 'destructive'}>
                            {t(transaction.type?.charAt(0).toUpperCase() + transaction.type?.slice(1))}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        <NoRecordFound />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {transactionLinks.length > 0 && (
                <Pagination
                  links={transactionLinks}
                  currentPage={transactionPage}
                  onPageChange={handleTransactionPageChange}
                  className="p-4"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <CardTitle>{t("Sales History")}</CardTitle>
                  <CardDescription>
                    {t("View all sales for this user")}
                  </CardDescription>
                </div>
                <form onSubmit={handleSalesSearch} className="flex gap-2">
                  <Input
                    value={salesSearch}
                    placeholder={t("Search sales")}
                    onChange={(e) => setSalesSearch(e.target.value)}
                    className="w-48"
                  />
                  <Button type="submit" aria-label={t("Search")}>
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                  {showSalesRefresh && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSalesRefresh}
                      aria-label={t("Refresh")}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </form>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>{t("Game")}</TableHead>
                    <TableHead>{t("Game Asset")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead>{t("Transaction ID")}</TableHead>
                    <TableHead>{t("Date")}</TableHead>
                    <TableHead>{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountData.sales?.data?.length > 0 ? (
                    accountData.sales.data.map((sale, index) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{sale.game?.name || t("N/A")}</TableCell>
                        <TableCell>{sale.game_asset?.name || t("N/A")}</TableCell>
                        <TableCell>{getStatusBadge(sale.status)}</TableCell>
                        <TableCell>
                          {sale.transaction_id ? `#${sale.transaction_id}` : t("N/A")}
                        </TableCell>
                        <TableCell>
                          {new Date(sale.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {sale.receipt && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(sale.receipt, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {t("View Receipt")}
                            </Button>
                          )}
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
              {salesLinks.length > 0 && (
                <Pagination
                  links={salesLinks}
                  currentPage={salesPage}
                  onPageChange={handleSalesPageChange}
                  className="p-4"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <CardTitle>{t("Expense History")}</CardTitle>
                  <CardDescription>
                    {t("View all expenses for this user")}
                  </CardDescription>
                </div>
                <form onSubmit={handleExpensesSearch} className="flex gap-2">
                  <Input
                    value={expensesSearch}
                    placeholder={t("Search expenses")}
                    onChange={(e) => setExpensesSearch(e.target.value)}
                    className="w-48"
                  />
                  <Button type="submit" aria-label={t("Search")}>
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                  {showExpensesRefresh && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleExpensesRefresh}
                      aria-label={t("Refresh")}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </form>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>{t("Type")}</TableHead>
                    <TableHead>{t("Amount")}</TableHead>
                    <TableHead>{t("Category")}</TableHead>
                    <TableHead>{t("Description")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead>{t("Date")}</TableHead>
                    <TableHead>{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountData.expenses?.data?.length > 0 ? (
                    accountData.expenses.data.map((expense, index) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {expense.expense_type?.charAt(0).toUpperCase() + expense.expense_type?.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-red-600">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4" />
                            OMR {expense.amount}
                          </div>
                        </TableCell>
                        <TableCell>{expense.category?.name || t("N/A")}</TableCell>
                        <TableCell className="max-w-32 truncate">{expense.description}</TableCell>
                        <TableCell>
                          <Badge variant={
                            expense.status === 'approved' ? 'success' :
                              expense.status === 'rejected' ? 'destructive' : 'warning'
                          }>
                            {t(expense.status?.charAt(0).toUpperCase() + expense.status?.slice(1))}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {expense.receipt_path && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`${import.meta.env.VITE_BASE_URL}${expense.receipt_path}`, '_blank')}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                {t("View Receipt")}
                              </Button>
                            )}
                            {expense.images && expense.images.length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  window.open(`${import.meta.env.VITE_BASE_URL}${expense.images[0].image}`, '_blank');
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                {t("View Images")}
                              </Button>
                            )}
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
              {expensesLinks.length > 0 && (
                <Pagination
                  links={expensesLinks}
                  currentPage={expensesPage}
                  onPageChange={handleExpensesPageChange}
                  className="p-4"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{t("Daily Reports")}</CardTitle>
                  <CardDescription>
                    {t("View all daily reports for this user")}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowSalaryDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {t("Process Salary")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>{t("Date")}</TableHead>
                    <TableHead>{t("Total Sales")}</TableHead>
                    <TableHead>{t("Total Revenue")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead>{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyReports?.data?.length > 0 ? (
                    dailyReports.data.map((report, index) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                        <TableCell>{report.total_transactions}</TableCell>
                        <TableCell>OMR {(report.total_revenue || report.actual_revenue)?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>
                          <Badge variant={
                            report.status === 'settled' ? 'default' :
                              report.status === 'submitted' ? 'secondary' : 'outline'
                          }>
                            {t(report.status?.charAt(0).toUpperCase() + report.status?.slice(1))}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewReport(report.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {t("View")}
                            </Button>
                            {report.status !== 'settled' && report.status !== 'submitted' && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  setSelectedReport({ report });
                                  setConfirmAmount((report.total_revenue || report.actual_revenue)?.toString() || '');
                                  setShowConfirmDialog(true);
                                }}
                              >
                                <DollarSign className="h-4 w-4 mr-1" />
                                {t("Confirm Payment")}
                              </Button>
                            )}
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
              {dailyReports?.links?.length > 0 && (
                <Pagination
                  links={dailyReports.links}
                  currentPage={reportsPage}
                  onPageChange={handleReportsPageChange}
                  className="p-4"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Reports Tab */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Completed Reports")}</CardTitle>
              <CardDescription>
                {t("View all completed and settled reports")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>{t("Date")}</TableHead>
                    <TableHead>{t("Total Sales")}</TableHead>
                    <TableHead>{t("Total Revenue")}</TableHead>
                    <TableHead>{t("Amount Collected")}</TableHead>
                    <TableHead>{t("Settled Date")}</TableHead>
                    <TableHead>{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedReports?.data?.length > 0 ? (
                    completedReports.data.map((report, index) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                        <TableCell>{report.total_transactions}</TableCell>
                        <TableCell>OMR {(report.total_revenue || report.actual_revenue)?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell>
                          OMR {parseFloat(report.money_collection?.amount)?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell>
                          {report.settled_at ? new Date(report.settled_at).toLocaleDateString() : t("N/A")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewReport(report.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {t("View")}
                          </Button>
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
              {completedReports?.links?.length > 0 && (
                <Pagination
                  links={completedReports.links}
                  currentPage={completedPage}
                  onPageChange={handleCompletedPageChange}
                  className="p-4"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salaries Tab */}
        <TabsContent value="salaries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Salary History")}</CardTitle>
              <CardDescription>
                {t("View all salary payments for this user")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>{t("Salary Date")}</TableHead>
                    <TableHead>{t("Final Amount")}</TableHead>
                    <TableHead>{t("Gross Amount")}</TableHead>
                    <TableHead>{t("Total Expenses")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead>{t("Paid By")}</TableHead>
                    <TableHead>{t("Paid At")}</TableHead>
                    <TableHead>{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaries?.data?.length > 0 ? (
                    salaries.data.map((salary, index) => (
                      <TableRow key={salary.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{new Date(salary.salary_date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-bold text-green-600">
                          OMR {parseFloat(salary.final_amount).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-blue-600">
                          OMR {parseFloat(salary.gross_amount).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-red-600">
                          OMR {parseFloat(salary.total_expenses).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={salary.status === 'paid' ? 'default' : 'secondary'}>
                            {t(salary.status?.charAt(0).toUpperCase() + salary.status?.slice(1))}
                          </Badge>
                        </TableCell>
                        <TableCell>{salary.paid_by_user?.name || t("N/A")}</TableCell>
                        <TableCell>
                          {salary.paid_at ? new Date(salary.paid_at).toLocaleDateString() : t("N/A")}
                        </TableCell>
                        <TableCell>
                          {salary.slip_path && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewSalarySlip(salary.id)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              {t('Salary Slip')}
                            </Button>
                          )}
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
              {salaries?.links?.length > 0 && (
                <Pagination
                  links={salaries.links}
                  currentPage={salariesPage}
                  onPageChange={handleSalariesPageChange}
                  className="p-4"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ViewReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        reportData={selectedReport}
        onConfirmPayment={() => {
          setShowReportDialog(false);
          setShowConfirmDialog(true);
        }}
      />

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

      <ProcessSalaryDialog
        open={showSalaryDialog}
        onOpenChange={setShowSalaryDialog}
        userId={userId}
        onSalaryProcessed={handleSalaryProcessed}
      />
    </div>
  );
};

export default UserAccount; 