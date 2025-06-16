import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Users, 
    Calendar, 
    CheckCircle2, 
    AlertCircle,
    Loader2,
    Calculator
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import Select from '../../misc/Select';
import axiosClient from '@/axios';
import { handleError } from '@/utils/helpers';

const ProcessSalaryForm = ({ onSubmit, isLoading }) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
    const [pendingReports, setPendingReports] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);
    const [summary, setSummary] = useState(null);
    const [step, setStep] = useState(1); // 1: User/Month selection, 2: Reports selection, 3: Final confirmation
    const [loading, setLoading] = useState(false);
    
    // Form data
    const [finalAmount, setFinalAmount] = useState('');
    const [status, setStatus] = useState('pending');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosClient.get('users/all');
            if (response.data.success) {
                setUsers(response.data.data || []);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const fetchPendingReports = async () => {
        if (!selectedUser || !selectedMonth) return;
        
        setLoading(true);
        try {
            const response = await axiosClient.get('salaries/pending-reports', {
                params: {
                    user_id: selectedUser,
                    month: selectedMonth
                }
            });

            if (response.data.success) {
                setPendingReports(response.data.data.reports || []);
                setSummary(response.data.data.summary || null);
                setSelectedReports(response.data.data.reports?.map(r => r.id) || []);
                setFinalAmount(response.data.data.summary?.total_profit?.toString() || '');
            } else {
                toast.error(response.data.message || t('error_fetching_pending_reports'));
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleNextStep = () => {
        if (step === 1) {
            if (!selectedUser || !selectedMonth) {
                toast.error(t('please_select_user_and_month'));
                return;
            }
            fetchPendingReports();
            setStep(2);
        } else if (step === 2) {
            if (selectedReports.length === 0) {
                toast.error(t('please_select_reports'));
                return;
            }
            setStep(3);
        }
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleReportToggle = (reportId) => {
        setSelectedReports(prev => 
            prev.includes(reportId) 
                ? prev.filter(id => id !== reportId)
                : [...prev, reportId]
        );
    };

    const handleSelectAllReports = () => {
        if (selectedReports.length === pendingReports.length) {
            setSelectedReports([]);
        } else {
            setSelectedReports(pendingReports.map(r => r.id));
        }
    };

    const getSelectedReportsData = () => {
        const selected = pendingReports.filter(r => selectedReports.includes(r.id));
        const totalSales = selected.reduce((sum, r) => sum + r.total_sales, 0);
        const totalExpenses = selected.reduce((sum, r) => sum + r.total_expenses, 0);
        const totalProfit = totalSales - totalExpenses;
        
        return {
            reports: selected,
            totalSales,
            totalExpenses,
            totalProfit
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedReports.length === 0) {
            toast.error(t('please_select_reports'));
            return;
        }

        const formData = {
            user_id: selectedUser,
            month: selectedMonth,
            report_ids: selectedReports,
            final_amount: parseFloat(finalAmount) || undefined,
            status,
            notes
        };

        onSubmit(formData);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const selectedData = getSelectedReportsData();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center space-x-4">
                {[1, 2, 3].map((stepNum) => (
                    <div key={stepNum} className="flex items-center">
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                            ${stepNum <= step 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-600'
                            }
                        `}>
                            {stepNum < step ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                        </div>
                        {stepNum < 3 && (
                            <div className={`
                                w-12 h-0.5 mx-2
                                ${stepNum < step ? 'bg-blue-600' : 'bg-gray-200'}
                            `} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step 1: User and Month Selection */}
            {step === 1 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="user">{t('select_employee')}</Label>
                            <Select
                                value={selectedUser}
                                onValueChange={setSelectedUser}
                                placeholder={t('select_employee')}
                            >
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="month">{t('select_month')}</Label>
                            <Input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="cursor-pointer"
                                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Reports Selection */}
            {step === 2 && (
                <div className="space-y-4">
                    {summary && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    {summary.user.name} - {selectedMonth}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {summary.total_reports}
                                        </p>
                                        <p className="text-sm text-gray-600">{t('total_reports')}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">
                                            {formatCurrency(summary.total_sales)}
                                        </p>
                                        <p className="text-sm text-gray-600">{t('total_sales')}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-red-600">
                                            {formatCurrency(summary.total_expenses)}
                                        </p>
                                        <p className="text-sm text-gray-600">{t('total_expenses')}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-600">
                                            {formatCurrency(summary.total_profit)}
                                        </p>
                                        <p className="text-sm text-gray-600">{t('total_profit')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {pendingReports.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-8">
                                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                <p className="text-gray-600">{t('no_pending_reports_found')}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{t('select_reports_to_process')}</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSelectAllReports}
                                >
                                    {selectedReports.length === pendingReports.length 
                                        ? t('deselect_all') 
                                        : t('select_all')
                                    }
                                </Button>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {pendingReports.map((report) => (
                                    <Card 
                                        key={report.id} 
                                        className={`cursor-pointer transition-all ${
                                            selectedReports.includes(report.id) 
                                                ? 'ring-2 ring-blue-500 bg-blue-50' 
                                                : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => handleReportToggle(report.id)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedReports.includes(report.id)}
                                                        onChange={() => handleReportToggle(report.id)}
                                                        className="w-4 h-4 text-blue-600"
                                                    />
                                                    <div>
                                                        <p className="font-medium flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            {formatDate(report.date)}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {report.sales_count} {t('sales')} • {report.expenses_count} {t('expenses')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-green-600">
                                                        {formatCurrency(report.total_sales)}
                                                    </p>
                                                    <p className="text-sm text-red-600">
                                                        -{formatCurrency(report.total_expenses)}
                                                    </p>
                                                    <p className="font-bold text-purple-600">
                                                        {formatCurrency(report.profit)}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Selected Reports Summary */}
                            {selectedReports.length > 0 && (
                                <Card className="bg-blue-50 border-blue-200">
                                    <CardHeader>
                                        <CardTitle className="text-blue-800">
                                            {t('selected_reports_summary')} ({selectedReports.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <p className="text-xl font-bold text-green-600">
                                                    {formatCurrency(selectedData.totalSales)}
                                                </p>
                                                <p className="text-sm text-gray-600">{t('total_sales')}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-bold text-red-600">
                                                    {formatCurrency(selectedData.totalExpenses)}
                                                </p>
                                                <p className="text-sm text-gray-600">{t('total_expenses')}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-bold text-purple-600">
                                                    {formatCurrency(selectedData.totalProfit)}
                                                </p>
                                                <p className="text-sm text-gray-600">{t('net_salary')}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Step 3: Final Confirmation */}
            {step === 3 && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('salary_calculation')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-lg font-bold text-green-600">
                                        {formatCurrency(selectedData.totalSales)}
                                    </p>
                                    <p className="text-sm text-gray-600">{t('gross_amount')}</p>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <p className="text-lg font-bold text-red-600">
                                        -{formatCurrency(selectedData.totalExpenses)}
                                    </p>
                                    <p className="text-sm text-gray-600">{t('total_expenses')}</p>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-lg font-bold text-blue-600">
                                        {formatCurrency(selectedData.totalProfit)}
                                    </p>
                                    <p className="text-sm text-gray-600">{t('calculated_net')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="finalAmount">{t('final_amount')}</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={finalAmount}
                                        onChange={(e) => setFinalAmount(e.target.value)}
                                        placeholder={t('enter_final_amount')}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {t('leave_empty_to_use_calculated_amount')}
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="status">{t('status')}</Label>
                                    <Select
                                        value={status}
                                        onValueChange={setStatus}
                                    >
                                        <option value="pending">{t('pending')}</option>
                                        <option value="paid">{t('paid')}</option>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="notes">{t('notes')}</Label>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={t('enter_notes_optional')}
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <div>
                    {step > 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePreviousStep}
                            disabled={loading || isLoading}
                        >
                            {t('previous')}
                        </Button>
                    )}
                </div>

                <div className="flex gap-2">
                    {step < 3 ? (
                        <Button
                            type="button"
                            onClick={handleNextStep}
                            disabled={loading || (step === 2 && pendingReports.length === 0)}
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {t('next')}
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isLoading || selectedReports.length === 0}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {t('process_salary')}
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default ProcessSalaryForm; 