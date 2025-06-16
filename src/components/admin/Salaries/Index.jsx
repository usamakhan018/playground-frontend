import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    MoreHorizontal, 
    RefreshCw, 
    Trash2Icon, 
    SearchIcon,
    Eye,
    FileText,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@/axios';
import Loader from '@/components/Loader';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import Pagination from "@/components/Pagination";
import ProcessSalary from "./ProcessSalary";
import View from "./View";
import { can, handleError } from "@/utils/helpers";
import DeleteAlert from "@/components/misc/DeleteAlert";

const SalaryIndex = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);


    // Dialog states
    const [processDialogOpen, setProcessDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedSalary, setSelectedSalary] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

    const accessAbility = can("Salary access");
    const createAbility = can("Salary create");
    const updateAbility = can("Salary update");
    const deleteAbility = can("Salary delete");

    useEffect(() => {
        if (!accessAbility) navigate("/unauthorized");
        fetchSalaries(currentPage);
    }, [currentPage]);

    const fetchSalaries = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`salaries?page=${page}`);
            setLinks(response.data.data.links);
            setSalaries(response.data.data.data);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };



    const handleStatusUpdate = async (salaryId, newStatus) => {
        try {
            const formData = new FormData();
            formData.append('id', salaryId);
            formData.append('status', newStatus);

            const response = await axiosClient.post('salaries/update-status', formData);
            toast.success(response.data.message);
            fetchSalaries(currentPage);
        } catch (error) {
            handleError(error);
        }
    };

    const handleViewSlip = async (salaryId) => {
        try {
            const response = await axiosClient.get(`salaries/slip/${salaryId}`);
            if (response.data.success) {
                window.open(response.data.data.slip_url, '_blank');
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleRegenerateSlip = async (salaryId) => {
        try {
            const response = await axiosClient.post(`salaries/regenerate-slip/${salaryId}`);
            if (response.data.success) {
                toast.success(t('slip_regenerated'));
                window.open(response.data.data.slip_url, '_blank');
            }
        } catch (error) {
            handleError(error);
        }
    };



    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            paid: 'success',
            cancelled: 'destructive'
        };
        return variants[status] || 'secondary';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <Clock className="w-3 h-3" />,
            paid: <CheckCircle className="w-3 h-3" />,
            cancelled: <XCircle className="w-3 h-3" />
        };
        return icons[status] || <Clock className="w-3 h-3" />;
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



    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        try {
            const response = await axiosClient.get(`salaries?query=${searchTerm.trim()}`);
            setSalaries(response.data.data);
            setLinks([]);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitSuccess = () => {
        fetchSalaries(currentPage);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const openViewDialog = (record) => {
        setSelectedSalary(record);
        setViewDialogOpen(true);
    };

    const closeViewDialog = () => {
        setSelectedSalary(null);
        setViewDialogOpen(false);
    };

    const openDeleteAlert = (record) => {
        setSelectedSalary(record);
        setDeleteAlertOpen(true);
    };

    const closeDeleteAlert = () => {
        setSelectedSalary(null);
        setDeleteAlertOpen(false);
    };

    const handleDelete = async () => {
        if (!selectedSalary) return;

        try {
            const formData = new FormData();
            formData.append('id', selectedSalary.id);

            await axiosClient.post('salaries/delete', formData);
            toast.success(t('salary_deleted_successfully'));
            fetchSalaries(currentPage);
            setDeleteAlertOpen(false);
        } catch (error) {
            handleError(error);
        }
    };

    if (loading && currentPage === 1) {
        return <Loader />;
    }

    return (
        <div className="space-y-3">
            <PageTitle title={t("Salary Management")} />

            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    {createAbility && <ProcessSalary onSubmitSuccess={handleSubmitSuccess} />}
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="flex gap-2">
                        <Input
                            id="search"
                            name="search"
                            value={searchTerm}
                            placeholder={t("Search by employee name or email...")}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64"
                        />
                        <Button type="submit" aria-label={t("Search")}>
                            <SearchIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </div>

            <div className="shadow-md p-4 mt-2 rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>{t("Employee")}</TableHead>
                            <TableHead>{t("Month")}</TableHead>
                            <TableHead>{t("Gross Amount")}</TableHead>
                            <TableHead>{t("Total Expenses")}</TableHead>
                            <TableHead>{t("Net Amount")}</TableHead>
                            <TableHead>{t("Final Amount")}</TableHead>
                            <TableHead>{t("Status")}</TableHead>
                            <TableHead className="text-right">{t("Actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center h-24">
                                    <Loader />
                                </TableCell>
                            </TableRow>
                        ) : salaries.length > 0 ? (
                            salaries.map((salary, index) => (
                                <TableRow key={salary.id}>
                                    <TableCell className="font-medium">
                                        {(currentPage - 1) * 15 + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{salary.user?.name}</div>
                                            <div className="text-sm text-gray-500">{salary.user?.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(salary.salary_date)}</TableCell>
                                    <TableCell className="text-green-600 font-medium">
                                        {formatCurrency(salary.gross_amount)}
                                    </TableCell>
                                    <TableCell className="text-red-600 font-medium">
                                        {formatCurrency(salary.total_expenses)}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {formatCurrency(salary.net_amount)}
                                    </TableCell>
                                    <TableCell className="text-blue-600 font-bold">
                                        {formatCurrency(salary.final_amount)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadge(salary.status)} className="flex items-center w-fit">
                                            {getStatusIcon(salary.status)}
                                            {t(salary.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
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
                                                
                                                <DropdownMenuItem onClick={() => openViewDialog(salary)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    {t("View Details")}
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={() => handleViewSlip(salary.id)}>
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    {t("View Salary Slip")}
                                                </DropdownMenuItem>

                                                {updateAbility && (
                                                    <DropdownMenuItem onClick={() => handleRegenerateSlip(salary.id)}>
                                                        <RefreshCw className="mr-2 h-4 w-4" />
                                                        {t("Regenerate Slip")}
                                                    </DropdownMenuItem>
                                                )}

                                                {updateAbility && salary.status === 'pending' && (
                                                    <DropdownMenuItem 
                                                        onClick={() => handleStatusUpdate(salary.id, 'paid')}
                                                        className="text-green-600"
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        {t("Mark as Paid")}
                                                    </DropdownMenuItem>
                                                )}

                                                {updateAbility && salary.status !== 'cancelled' && (
                                                    <DropdownMenuItem 
                                                        onClick={() => handleStatusUpdate(salary.id, 'cancelled')}
                                                        className="text-red-600"
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        {t("Cancel Salary")}
                                                    </DropdownMenuItem>
                                                )}

                                                {deleteAbility && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            onClick={() => openDeleteAlert(salary)}
                                                            className="text-red-600"
                                                        >
                                                            <Trash2Icon className="mr-2 h-4 w-4" />
                                                            {t("Delete")}
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
                                <TableCell colSpan={9} className="text-center h-24">
                                    <NoRecordFound />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {links.length > 0 && (
                <Pagination
                    links={links}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            )}

            {/* View Dialog */}
            {viewDialogOpen && (
                <View
                    salary={selectedSalary}
                    open={viewDialogOpen}
                    onClose={closeViewDialog}
                    onStatusUpdate={handleStatusUpdate}
                    onViewSlip={handleViewSlip}
                    onRegenerateSlip={handleRegenerateSlip}
                />
            )}

            {/* Delete Alert */}
            {deleteAlertOpen && (
                <DeleteAlert
                    open={deleteAlertOpen}
                    onClose={closeDeleteAlert}
                    onConfirm={handleDelete}
                    title={t("Delete Salary")}
                    description={t("Are you sure you want to delete this salary record? This action cannot be undone.")}
                />
            )}
        </div>
    );
};

export default SalaryIndex; 