import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  TrendingDown
} from "lucide-react";
import { useTranslation } from "react-i18next";

const ViewReportDialog = ({ 
  open, 
  onOpenChange, 
  reportData, 
  onConfirmPayment 
}) => {
  const { t } = useTranslation();

  if (!reportData) return null;

  const { report, stats } = reportData;

  const getStatusBadge = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      settled: 'bg-blue-100 text-blue-800',
      submitted: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {t(status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown')}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method) => {
    const colors = {
      cash: 'bg-green-100 text-green-800',
      credit_card: 'bg-blue-100 text-blue-800',
      bank_transfer: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge className={colors[method] || 'bg-gray-100 text-gray-800'}>
        {t(method?.replace('_', ' ').charAt(0).toUpperCase() + method?.replace('_', ' ').slice(1) || 'Unknown')}
      </Badge>
    );
  };

  const getGameTypeBadge = (type) => {
    const colors = {
      limited: 'bg-orange-100 text-orange-800',
      unlimited: 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
        {t(type?.charAt(0).toUpperCase() + type?.slice(1) || 'Unknown')}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("Daily Report Details")} - {new Date(report.date).toLocaleDateString()}
          </DialogTitle>
          <DialogDescription>
            {t("Detailed view of sales and statistics for")} {report.sales_manager?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Total Revenue")}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  OMR {stats?.total_revenue?.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("Games")}: OMR {parseFloat(stats?.game_revenue)?.toFixed(2) || '0.00'} | {t("Products")}: OMR {parseFloat(stats?.product_revenue)?.toFixed(2) || '0.00'}
                </p>
              </CardContent>
            </Card>

            <Card>
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Total Expenses")}</CardTitle>
                <DollarSign className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  OMR {stats?.total_expenses?.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.expenses_count || 0} {t("expenses")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Net Profit")}</CardTitle>
                <DollarSign className={`h-4 w-4 ${(stats?.net_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${(stats?.net_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  OMR {stats?.net_profit?.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("Revenue")} - {t("Expenses")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods Breakdown */}
          {stats?.payment_methods && Object.keys(stats.payment_methods).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {t("Payment Methods Breakdown")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {Object.entries(stats.payment_methods).map(([method, data]) => (
                    <div key={method} className="flex justify-between items-center p-3 border rounded-lg">
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
          )}

          {/* Game Types Breakdown */}
          {stats?.game_types && Object.keys(stats.game_types).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4" />
                  {t("Game Types Breakdown")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(stats.game_types).map(([type, data]) => (
                    <div key={type} className="flex justify-between items-center p-3 border rounded-lg">
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
          )}

          {/* Expenses Breakdown */}
          {stats?.expenses_by_category && Object.keys(stats.expenses_by_category).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  {t("Expenses Breakdown")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {Object.entries(stats.expenses_by_category).map(([category, data]) => (
                    <div key={category} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{category}</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {data.count} {t("expenses")}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">OMR {data.amount?.toFixed(2) || '0.00'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Popular Games */}
          {stats?.popular_games && stats.popular_games.length > 0 && (
            <Card>
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
                        <TableCell className="font-bold text-green-600">
                          OMR {game.revenue?.toFixed(2) || '0.00'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Sales Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                {t("Sales Details")}
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
                  {report.sales?.length > 0 ? (
                    report.sales.map((sale, index) => (
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
                        <TableCell className="font-bold text-green-600">
                          ${parseFloat(sale.amount)?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell>{getStatusBadge(sale.status)}</TableCell>
                        <TableCell>
                          {new Date(sale.created_at).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {sale.receipt && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(sale.receipt, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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
          <Card>
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
                  {report.product_sales?.length > 0 ? (
                    report.product_sales.map((productSale, index) => (
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
                        <TableCell className="font-bold text-green-600">
                          OMR {parseFloat(productSale.total_amount)?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell>
                          {productSale.payment_method && getPaymentMethodBadge(productSale.payment_method)}
                        </TableCell>
                        <TableCell>
                          {new Date(productSale.created_at).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {productSale.proof_image_path && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(productSale.proof_image_path, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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
          <Card>
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
                        <TableCell className="font-bold text-red-600">
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
            <Card>
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
                    <p className="text-2xl font-bold text-green-600">
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            {report.status !== 'settled' && onConfirmPayment && (
              <Button onClick={onConfirmPayment}>
                <DollarSign className="h-4 w-4 mr-2" />
                {t("Confirm Payment")}
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("Close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportDialog; 