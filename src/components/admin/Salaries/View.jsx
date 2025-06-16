import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    User, 
    Calendar, 
    DollarSign, 
    FileText, 
    TrendingUp, 
    TrendingDown,
    CheckCircle, 
    XCircle, 
    Clock,
    RefreshCw,
    Eye,
    Receipt,
    ShoppingCart,
    CreditCard,
    Calculator
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const View = ({ 
    open, 
    onClose, 
    salary, 
    onStatusUpdate, 
    onViewSlip, 
    onRegenerateSlip 
}) => {
    const { t } = useTranslation();

    if (!salary) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'secondary',
            paid: 'default',
            cancelled: 'destructive'
        };
        return variants[status] || 'secondary';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <Clock className="w-4 h-4" />,
            paid: <CheckCircle className="w-4 h-4" />,
            cancelled: <XCircle className="w-4 h-4" />
        };
        return icons[status] || <Clock className="w-4 h-4" />;
    };

    const expenseBreakdown = salary.expense_breakdown || {};
    const reports = expenseBreakdown.reports || [];
    const expenses = expenseBreakdown.expenses || [];

    // Group expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
        const category = expense.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(expense);
        return acc;
    }, {});

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Receipt className="w-5 h-5" />
                        {t('salary_details')} - {salary.user?.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <User className="w-8 h-8 text-blue-600" />
                                    <div>
                                        <p className="font-medium">{salary.user?.name}</p>
                                        <p className="text-sm text-gray-600">{salary.user?.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-8 h-8 text-green-600" />
                                    <div>
                                        <p className="font-medium">{formatDate(salary.salary_date)}</p>
                                        <p className="text-sm text-gray-600">{t('salary_date')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        {getStatusIcon(salary.status)}
                                    </div>
                                    <div>
                                        <Badge variant={getStatusBadge(salary.status)} className="mb-1">
                                            {t(salary.status)}
                                        </Badge>
                                        <p className="text-sm text-gray-600">{t('status')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Financial Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                {t('financial_summary')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(salary.gross_amount)}
                                    </p>
                                    <p className="text-sm text-gray-600">{t('gross_amount')}</p>
                                </div>

                                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                                    <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-red-600">
                                        {formatCurrency(salary.total_expenses)}
                                    </p>
                                    <p className="text-sm text-gray-600">{t('total_expenses')}</p>
                                </div>

                                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(salary.net_amount)}
                                    </p>
                                    <p className="text-sm text-gray-600">{t('net_amount')}</p>
                                </div>

                                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-purple-600">
                                        {formatCurrency(salary.final_amount)}
                                    </p>
                                    <p className="text-sm text-gray-600">{t('final_amount')}</p>
                                </div>
                            </div>

                            {salary.final_amount !== salary.net_amount && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        <strong>{t('adjustment')}:</strong> {formatCurrency(salary.final_amount - salary.net_amount)}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Daily Reports Breakdown */}
                    {reports.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    {t('daily_reports_processed')} ({reports.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-3">{t('date')}</th>
                                                <th className="text-left p-3">{t('sales')}</th>
                                                <th className="text-left p-3">{t('expenses')}</th>
                                                <th className="text-left p-3">{t('profit')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reports.map((report, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50">
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            {formatDate(report.date)}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 font-medium text-green-600">
                                                        {formatCurrency(report.sales)}
                                                    </td>
                                                    <td className="p-3 font-medium text-red-600">
                                                        {formatCurrency(report.expenses)}
                                                    </td>
                                                    <td className="p-3 font-bold">
                                                        <span className={report.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                            {formatCurrency(report.profit)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gray-50 font-bold">
                                                <td className="p-3">{t('total')}</td>
                                                <td className="p-3 text-green-600">
                                                    {formatCurrency(reports.reduce((sum, r) => sum + r.sales, 0))}
                                                </td>
                                                <td className="p-3 text-red-600">
                                                    {formatCurrency(reports.reduce((sum, r) => sum + r.expenses, 0))}
                                                </td>
                                                <td className="p-3 text-blue-600">
                                                    {formatCurrency(reports.reduce((sum, r) => sum + r.profit, 0))}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Expenses by Category */}
                    {Object.keys(expensesByCategory).length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    {t('expenses_by_category')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(expensesByCategory).map(([category, categoryExpenses]) => (
                                        <div key={category} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-medium text-lg">{category}</h4>
                                                <Badge variant="outline">
                                                    {categoryExpenses.length} {t('items')}
                                                </Badge>
                                            </div>
                                            
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="text-left p-2">{t('date')}</th>
                                                            <th className="text-left p-2">{t('description')}</th>
                                                            <th className="text-left p-2">{t('amount')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {categoryExpenses.map((expense, index) => (
                                                            <tr key={index} className="border-b">
                                                                <td className="p-2 text-sm">
                                                                    {formatDate(expense.date)}
                                                                </td>
                                                                <td className="p-2 text-sm">
                                                                    {expense.description}
                                                                </td>
                                                                <td className="p-2 text-sm font-medium text-red-600">
                                                                    {formatCurrency(expense.amount)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        <tr className="bg-gray-50 font-bold">
                                                            <td colSpan="2" className="p-2">{category} {t('total')}</td>
                                                            <td className="p-2 text-red-600">
                                                                {formatCurrency(
                                                                    categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('processing_information')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">{t('processed_by')}:</span>
                                    <span className="font-medium">{salary.paid_by_user?.name || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">{t('created_at')}:</span>
                                    <span className="font-medium">{formatDateTime(salary.created_at)}</span>
                                </div>
                                {salary.paid_at && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">{t('paid_at')}:</span>
                                        <span className="font-medium text-green-600">
                                            {formatDateTime(salary.paid_at)}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {salary.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('notes')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700">{salary.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => onViewSlip(salary.id)}
                            className="flex items-center gap-2"
                        >
                            <Eye className="w-4 h-4" />
                            {t('view_salary_slip')}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => onRegenerateSlip(salary.id)}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            {t('regenerate_slip')}
                        </Button>

                        {salary.status === 'pending' && (
                            <Button
                                onClick={() => onStatusUpdate(salary.id, 'paid')}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle className="w-4 h-4" />
                                {t('mark_as_paid')}
                            </Button>
                        )}

                        {salary.status !== 'cancelled' && (
                            <Button
                                variant="destructive"
                                onClick={() => onStatusUpdate(salary.id, 'cancelled')}
                                className="flex items-center gap-2"
                            >
                                <XCircle className="w-4 h-4" />
                                {t('cancel_salary')}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default View; 