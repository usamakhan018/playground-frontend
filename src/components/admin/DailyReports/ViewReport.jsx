import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "@/axios";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  DollarSign,
  ShoppingCart,
  Clock,
  User,
  CreditCard,
  Gamepad2,
  Receipt,
  Eye,
  TrendingDown,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import PageTitle from "../Layouts/PageTitle";
import ImagePreview from "@/components/misc/ImagePreview";

const ViewReport = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [reportSales, setReportSales] = useState(null);
  const [reportSalesLinks, setReportSalesLinks] = useState(null);

  const [reportProductSales, setReportProductSales] = useState(null);
  const [reportProductSalesLinks, setReportProductSalesLinks] = useState(null);

  const [reportExpenses, setReportExpenses] = useState(null);
  const [reportExpensesLinks, setReportExpensesLinks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReport();
      fetchReportSales();
      fetchReportProductSales();
      fetchReportExpenses();
    }
  }, [id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await fetchReport();
    await fetchReportSales();
    await fetchReportProductSales();
    await fetchReportExpenses();
    setLoading(false);
    setRefreshing(false);
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`daily-reports/show/${id}`);
      setReportData(response.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportSales = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`daily-report-data/playground-sales/${id}`);
      setReportSales(response.data.data);
      // setReportSalesLinks(response.data.data.links);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportProductSales = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`daily-report-data/product-sales/${id}`);
      setReportProductSales(response.data.data);
      // setReportProductSalesLinks(response.data.data.links);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportExpenses = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`daily-report-d  ata/expenses/${id}`);
      setReportExpenses(response.data.data);
      // setReportExpensesLinks(response.data.data.links);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      settled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      submitted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };

    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}>
        {status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
        {status === 'submitted' && <AlertCircle className="h-3 w-3 mr-1" />}
        {status === 'settled' && <CheckCircle className="h-3 w-3 mr-1" />}
        {t(status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown')}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method) => {
    const variants = {
      cash: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      credit_card: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      bank_transfer: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };

    return (
      <Badge className={variants[method] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}>
        {t(method?.replace('_', ' ').charAt(0).toUpperCase() + method?.replace('_', ' ').slice(1) || 'Unknown')}
      </Badge>
    );
  };

  const getGameTypeBadge = (type) => {
    const variants = {
      limited: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      unlimited: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };

    return (
      <Badge className={variants[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}>
        {t(type?.charAt(0).toUpperCase() + type?.slice(1) || 'Unknown')}
      </Badge>
    );
  };

  if (loading) return <Loader />;

  if (!reportData) {
    return (
      <div className="space-y-6">
        <PageTitle title={t("Report Not Found")} />
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">{t("Report not found or you don't have permission to view it.")}</p>
            <Button onClick={() => navigate('/daily-reports')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("Back to Reports")}
            </Button>
            <Button
              onClick={() => fetchReport()}
              disabled={loading}
              size="sm"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {t('Refresh')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { report, stats } = reportData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title={t("Daily Report Details")} />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? t("Refreshing...") : t("Refresh")}
          </Button>

          <Button variant="outline" onClick={() => navigate('/daily-reports')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("Back to Reports")}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Report Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card className="border dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("Total Sales")}</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_sales || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {t("Games")}: {stats?.total_game_sales || 0} | {t("Products")}: {stats?.total_product_sales || 0}
                  </p>
                </CardContent>
              </Card>

              <Card className="border dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("Total Revenue")}</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    OMR {stats?.total_revenue?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("Games")}: OMR {parseFloat(stats?.game_revenue)?.toFixed(2) || '0.00'} | {t("Products")}: OMR {parseFloat(stats?.product_revenue)?.toFixed(2) || '0.00'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("Report Status")}</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getStatusBadge(report.status)}
                    <p className="text-xs text-muted-foreground">
                      {report.submitted_at ? t("Submitted") + ": " + new Date(report.submitted_at).toLocaleDateString() : t("Not submitted")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("Total Expenses")}</CardTitle>
                  <DollarSign className="h-4 w-4 text-red-600 dark:text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    OMR {stats?.total_expenses?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.expenses_count || 0} {t("Expenses")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("Net Profit")}</CardTitle>
                  <DollarSign className={`h-4 w-4 ${(stats?.net_profit || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${(stats?.net_profit || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    OMR {stats?.net_profit?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("Revenue")} - {t("Expenses")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods Breakdown */}
            {/* {stats?.payment_methods && Object.keys(stats.payment_methods).length > 0 && (
              <Card className="border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {t("Payment Methods Breakdown")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {Object.entries(stats.payment_methods).map(([method, data]) => (
                      <div key={method} className="flex justify-between items-center p-3 border rounded-lg dark:border-gray-700">
                        <div>
                          {getPaymentMethodBadge(method)}
                          <p className="text-sm text-muted-foreground mt-1">
                            {data.count} {t("transactions")}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">OMR {data.amount?.toFixed(2) || '0.00'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}

            {/* Game Types Breakdown */}
            {/* {stats?.game_types && Object.keys(stats.game_types).length > 0 && (
              <Card className="border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" />
                    {t("Game Types Breakdown")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(stats.game_types).map(([type, data]) => (
                      <div key={type} className="flex justify-between items-center p-3 border rounded-lg dark:border-gray-700">
                        <div>
                          {getGameTypeBadge(type)}
                          <p className="text-sm text-muted-foreground mt-1">
                            {data.count} {t("games")}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">OMR {data.amount?.toFixed(2) || '0.00'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}

            {/* Expenses Breakdown */}
            {/* {stats?.expenses_by_category && Object.keys(stats.expenses_by_category).length > 0 && (
              <Card className="border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    {t("Expenses Breakdown")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {Object.entries(stats.expenses_by_category).map(([category, data]) => (
                      <div key={category} className="flex justify-between items-center p-3 border rounded-lg dark:border-gray-700">
                        <div>
                          <div className="font-medium text-sm">{category}</div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {data.count} {t("expenses")}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600 dark:text-red-400">OMR {data.amount?.toFixed(2) || '0.00'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}

            {/* Popular Games */}
            {/* {stats?.popular_games && stats.popular_games.length > 0 && (
              <Card className="border dark:border-gray-700">
                <CardHeader>
                  <CardTitle>{t("Popular Games")}</CardTitle>
                  <CardDescription>{t("Top performing games in this report")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Game Name")}</TableHead>
                        <TableHead>{t("Sales Count")}</TableHead>
                        <TableHead>{t("Revenue")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.popular_games.map((game, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{game.game_name}</TableCell>
                          <TableCell>{game.count}</TableCell>
                          <TableCell className="font-bold text-green-600 dark:text-green-400">
                            OMR {game.revenue?.toFixed(2) || '0.00'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )} */}

            {/* Sales Details */}
            <Card className="border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  {t("Game Sales Details")}
                </CardTitle>
                <CardDescription>
                  {t("All sales transactions in this report")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>{t("Game")}</TableHead>
                      <TableHead>{t("Asset")}</TableHead>
                      <TableHead>{t("Type")}</TableHead>
                      <TableHead>{t("Payment")}</TableHead>
                      <TableHead>{t("Amount")}</TableHead>
                      <TableHead>{t("Status")}</TableHead>
                      <TableHead>{t("Time")}</TableHead>
                      <TableHead>{t("Receipt")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportSales?.length > 0 ? (
                      reportSales.map((sale, index) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{sale.game?.name || t("N/A")}</div>
                              {sale.game?.type && getGameTypeBadge(sale.game.type)}
                            </div>
                          </TableCell>
                          <TableCell>{sale.game_asset?.name || t("N/A")}</TableCell>
                          <TableCell>
                            {sale.game_pricing ? (
                              <div className="text-sm">
                                <div>{sale.game_pricing.duration}</div>
                                <div className="text-muted-foreground">
                                  OMR {sale.game_pricing.price}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm">
                                <div>{t("Base Game")}</div>
                                <div className="text-muted-foreground">
                                  ${sale.amount || '0.00'}
                                </div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {sale.payment_method && getPaymentMethodBadge(sale.payment_method)}
                          </TableCell>
                          <TableCell className="font-bold text-green-600 dark:text-green-400">
                            ${parseFloat(sale.amount)?.toFixed(2) || '0.00'}
                          </TableCell>
                          <TableCell>{getStatusBadge(sale.status)}</TableCell>
                          <TableCell>
                            {new Date(sale.created_at).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            {sale.proof && (
                              <ImagePreview
                                src={`${import.meta.env.VITE_BASE_URL}${sale.proof}`}
                                alt={sale.game?.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center h-24">
                          {t("No sales found")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Product Sales Details */}
            <Card className="border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  {t("Product Sales Details")}
                </CardTitle>
                <CardDescription>
                  {t("All product sales transactions in this report")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>{t("Product")}</TableHead>
                      <TableHead>{t("Category")}</TableHead>
                      <TableHead>{t("Quantity")}</TableHead>
                      <TableHead>{t("Unit Price")}</TableHead>
                      <TableHead>{t("Total Amount")}</TableHead>
                      <TableHead>{t("Payment")}</TableHead>
                      <TableHead>{t("Time")}</TableHead>
                      <TableHead>{t("Proof")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportProductSales?.length > 0 ? (
                      reportProductSales.map((productSale, index) => (
                        <TableRow key={productSale.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {productSale.product?.name || t("N/A")}
                            </div>
                          </TableCell>
                          <TableCell>
                            {productSale.product?.category?.name || t("N/A")}
                          </TableCell>
                          <TableCell className="font-medium">
                            {productSale.quantity}
                          </TableCell>
                          <TableCell>
                            OMR {parseFloat(productSale.price)?.toFixed(2) || '0.00'}
                          </TableCell>
                          <TableCell className="font-bold text-green-600 dark:text-green-400">
                            OMR {parseFloat(productSale.total_amount)?.toFixed(2) || '0.00'}
                          </TableCell>
                          <TableCell>
                            {productSale.payment_method && getPaymentMethodBadge(productSale.payment_method)}
                          </TableCell>
                          <TableCell>
                            {new Date(productSale.created_at).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            {productSale.proof && (
                              <ImagePreview
                                src={`${import.meta.env.VITE_BASE_URL}${productSale.proof}`}
                                alt={productSale.product?.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center h-24">
                          {t("No product sales found")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Expenses Details */}
            <Card className="border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  {t("Expenses Details")}
                </CardTitle>
                <CardDescription>
                  {t("All expenses for this report")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>{t("Category")}</TableHead>
                      <TableHead>{t("Description")}</TableHead>
                      <TableHead>{t("Amount")}</TableHead>
                      <TableHead>{t("Date")}</TableHead>
                      <TableHead>{t("Receipt")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.expenses?.length > 0 ? (
                      report.expenses.map((expense, index) => (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div className="font-medium">{expense.category?.name || t("Uncategorized")}</div>
                          </TableCell>
                          <TableCell className="max-w-48 truncate">{expense.description}</TableCell>
                          <TableCell className="font-bold text-red-600 dark:text-red-400">
                            OMR {parseFloat(expense.amount)?.toFixed(2) || '0.00'}
                          </TableCell>
                          <TableCell>
                            {new Date(expense.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {expense.receipt_path && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(expense.receipt_path, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          {t("No expenses found")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Money Collection Info */}
            {report.money_collection && (
              <Card className="border dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {t("Payment Collection")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">{t("Amount Collected")}</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        OMR {parseFloat(report.money_collection.amount)?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("Collection Date")}</p>
                      <p className="font-medium">
                        {report.money_collection.collected_at ?
                          new Date(report.money_collection.collected_at).toLocaleDateString() :
                          t("N/A")
                        }
                      </p>
                    </div>
                    {report.money_collection.notes && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">{t("Notes")}</p>
                        <p className="text-sm">{report.money_collection.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewReport; 