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
import { EditIcon, MoreHorizontal, RefreshCw, Trash2Icon, SearchIcon, Eye, Printer, Receipt, DollarSign, Clock, CheckCircle, AlertTriangle, FileText, Filter, Calendar } from "lucide-react";
import Edit from "./Edit";
import Create from "./Create";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import DeleteAlert from "@/components/misc/DeleteAlert";
import { useTranslation } from "react-i18next";
import ImagePreview from "@/components/misc/ImagePreview";
import BarcodeGenerator from "@/components/misc/BarcodeGenerator";
import FilterComponent from "@/components/misc/FilterComponent";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const GameAssetIndex = () => {
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [gameAssets, setGameAssets] = useState([]);
    const [search, setSearch] = useState("");
    const [showRefresh, setShowRefresh] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false);
    const [selectedAssetForBarcode, setSelectedAssetForBarcode] = useState(null);
    
    // Expenses dialog states
    const [expensesDialogOpen, setExpensesDialogOpen] = useState(false);
    const [selectedAssetForExpenses, setSelectedAssetForExpenses] = useState(null);
    const [assetExpenses, setAssetExpenses] = useState([]);
    const [expensesLoading, setExpensesLoading] = useState(false);
    const [expensesSearch, setExpensesSearch] = useState("");
    const [expensesCurrentPage, setExpensesCurrentPage] = useState(1);
    const [expensesLinks, setExpensesLinks] = useState([]);
    const [expensesFilters, setExpensesFilters] = useState({});
    const [expensesShowRefresh, setExpensesShowRefresh] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();

    const accessAbility = can("Game Asset access");
    const createAbility = can("Game Asset create");
    const updateAbility = can("Game Asset update");
    const deleteAbility = can("Game Asset delete");

    useEffect(() => {
        if (!accessAbility) navigate("/unauthorized");
        fetchGameAssets(currentPage);
    }, [currentPage]);

    const fetchGameAssets = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`game_assets?page=${page}`);
            setLinks(response.data.data.links);
            setGameAssets(response.data.data.data);
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
            const response = await axiosClient.get(`game_assets?query=${search.trim()}`);
            setGameAssets(response.data.data);
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
        fetchGameAssets();
    };

    // Expenses dialog functions
    const fetchAssetExpenses = async (assetId, page = 1, filters = {}) => {
        setExpensesLoading(true);
        try {
            // Build query parameters
            const params = new URLSearchParams({ page: page.toString() });
            
            // Add filters to params
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== '') {
                    params.append(key, value);
                }
            });
            
            const response = await axiosClient.get(`expenses/by-asset/${assetId}?${params}`);
            setAssetExpenses(response.data.data.data || response.data.data);
            setExpensesLinks(response.data.data.links || []);
        } catch (error) {
            handleError(error);
        } finally {
            setExpensesLoading(false);
        }
    };

    const handleViewExpenses = (gameAsset) => {
        setSelectedAssetForExpenses(gameAsset);
        setExpensesDialogOpen(true);
        setExpensesCurrentPage(1);
        setExpensesFilters({});
        fetchAssetExpenses(gameAsset.id, 1, {});
    };

    const handleExpensesSearch = async (e) => {
        e.preventDefault();
        if (!expensesSearch.trim() || !selectedAssetForExpenses) return;

        setExpensesLoading(true);
        setExpensesShowRefresh(true);
        try {
            const response = await axiosClient.get(`expenses/by-asset/${selectedAssetForExpenses.id}?query=${expensesSearch.trim()}`);
            setAssetExpenses(response.data.data.data || response.data.data);
            setExpensesLinks([]);
        } catch (error) {
            handleError(error);
        } finally {
            setExpensesLoading(false);
        }
    };

    const handleExpensesRefresh = () => {
        setExpensesSearch("");
        setExpensesShowRefresh(false);
        setExpensesFilters({});
        if (selectedAssetForExpenses) {
            fetchAssetExpenses(selectedAssetForExpenses.id, 1, {});
        }
    };

    const handleExpensesFilter = (filters) => {
        setExpensesFilters(filters);
        setExpensesCurrentPage(1);
        if (selectedAssetForExpenses) {
            fetchAssetExpenses(selectedAssetForExpenses.id, 1, filters);
        }
    };

    const handleExpensesResetFilters = () => {
        setExpensesFilters({});
        setExpensesCurrentPage(1);
        if (selectedAssetForExpenses) {
            fetchAssetExpenses(selectedAssetForExpenses.id, 1, {});
        }
    };

    const getExpenseStatusBadge = (status) => {
        const variants = {
            pending: 'pending',
            approved: 'approved',
            rejected: 'rejected'
        };

        return (
            <Badge variant={variants[status]}>
                {status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                {status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                {status === 'rejected' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {t(status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown')}
            </Badge>
        );
    };

    const getExpenseTypeBadge = (type) => {
        const variants = {
            user: 'secondary',
            company: 'default',
            asset: 'outline',
            general: 'secondary'
        };

        return (
            <Badge variant={variants[type] || 'secondary'}>
                {t(type?.charAt(0).toUpperCase() + type?.slice(1) || 'Unknown')}
            </Badge>
        );
    };

    return (
        <div className="space-y-3">
            <PageTitle title={t("Game Assets")} />

            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    {createAbility && <Create onSubmitSuccess={fetchGameAssets} />}
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="flex gap-2">
                        <Input
                            id="search"
                            name="search"
                            value={search}
                            placeholder={t("Search")}
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

            <div className="bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>{t("Image")}</TableHead>
                            <TableHead>{t("Barcode")}</TableHead>
                            <TableHead>{t("Asset Name")}</TableHead>
                            <TableHead>{t("Game")}</TableHead>
                            <TableHead className="text-right">{t("Actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    <Loader />
                                </TableCell>
                            </TableRow>
                        ) : gameAssets.length > 0 ? (
                            gameAssets.map((gameAsset, index) => (
                                <TableRow key={gameAsset.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        {gameAsset.image ? (
                                            <ImagePreview
                                                src={`${import.meta.env.VITE_BASE_URL}${gameAsset.image}`}
                                                alt={gameAsset.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <Eye className="h-6 w-6 text-gray-500" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>{gameAsset.barcode}</TableCell>
                                    <TableCell>{gameAsset.name}</TableCell>
                                    <TableCell>{gameAsset.game?.name || t("N/A")}</TableCell>
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
                                                <DropdownMenuItem onClick={() => handleViewExpenses(gameAsset)}>
                                                    <Receipt className="mr-2 h-4 w-4" />
                                                    {t("View Expenses")}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedAssetForBarcode(gameAsset);
                                                    setBarcodeDialogOpen(true);
                                                }}>
                                                    <Printer className="mr-2 h-4 w-4" />
                                                    {t("Print Barcode")}
                                                </DropdownMenuItem>
                                                {updateAbility && (
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedRecord(gameAsset);
                                                        setEditDialogOpen(true);
                                                    }}>
                                                        <EditIcon className="mr-2 h-4 w-4" />
                                                        {t("Edit")}
                                                    </DropdownMenuItem>
                                                )}
                                                {deleteAbility && (
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedRecord(gameAsset);
                                                        setDeleteAlertOpen(true);
                                                    }}>
                                                        <Trash2Icon className="mr-2 h-4 w-4" />
                                                        {t("Delete")}
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
                {links.length > 0 && (
                    <Pagination
                        links={links}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        className="p-4"
                    />
                )}
            </div>

            {deleteAlertOpen && (
                <DeleteAlert
                    open={deleteAlertOpen}
                    onClose={setDeleteAlertOpen}
                    onSubmitSuccess={fetchGameAssets}
                    record={selectedRecord}
                    api="game_assets/delete"
                />
            )}

            {editDialogOpen && (
                <Edit
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    onSubmitSuccess={fetchGameAssets}
                    record={selectedRecord}
                />
            )}

            {barcodeDialogOpen && selectedAssetForBarcode && (
                <Dialog open={barcodeDialogOpen} onOpenChange={setBarcodeDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Printer className="h-5 w-5" />
                                {t("Print Barcode")}
                            </DialogTitle>
                            <DialogDescription>
                                {t("Generate and print barcode for")} {selectedAssetForBarcode.name}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4">
                            <BarcodeGenerator
                                value={selectedAssetForBarcode.barcode}
                                label={`${selectedAssetForBarcode.name} - ${selectedAssetForBarcode.game?.name || t("N/A")}`}
                                showPrintButton={true}
                                showDownloadButton={true}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {expensesDialogOpen && selectedAssetForExpenses && (
                <Dialog open={expensesDialogOpen} onOpenChange={setExpensesDialogOpen}>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Receipt className="h-5 w-5" />
                                {t("Asset Expenses")} - {selectedAssetForExpenses.name}
                            </DialogTitle>
                            <DialogDescription>
                                {t("View and manage expenses for")} {selectedAssetForExpenses.name} 
                                {selectedAssetForExpenses.game && ` (${selectedAssetForExpenses.game.name})`}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                            {/* Filters */}
                            <FilterComponent
                                onFilter={handleExpensesFilter}
                                onReset={handleExpensesResetFilters}
                                statusOptions={[
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'approved', label: 'Approved' },
                                    { value: 'rejected', label: 'Rejected' }
                                ]}
                                expenseTypeOptions={[
                                    { value: 'user', label: 'User' },
                                    { value: 'company', label: 'Company' },
                                    { value: 'asset', label: 'Asset' },
                                    { value: 'general', label: 'General' }
                                ]}
                                loading={expensesLoading}
                                showDateFilter={true}
                                showExpenseTypeFilter={true}
                            />

                            {/* Search */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground">
                                    {t("Expenses for this asset")}
                                </div>
                                
                                <form onSubmit={handleExpensesSearch} className="flex gap-2">
                                    <div className="flex gap-2">
                                        <Input
                                            id="expensesSearch"
                                            name="expensesSearch"
                                            value={expensesSearch}
                                            placeholder={t("Search expenses...")}
                                            onChange={(e) => setExpensesSearch(e.target.value)}
                                            className="w-64"
                                        />
                                        <Button type="submit" size="sm" aria-label={t("Search")}>
                                            <SearchIcon className="h-4 w-4" />
                                        </Button>
                                        {expensesShowRefresh && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleExpensesRefresh}
                                                aria-label={t("Refresh")}
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Expenses Table */}
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">#</TableHead>
                                            <TableHead>{t("Date")}</TableHead>
                                            <TableHead>{t("Category")}</TableHead>
                                            <TableHead>{t("Description")}</TableHead>
                                            <TableHead>{t("Amount")}</TableHead>
                                            <TableHead>{t("Type")}</TableHead>
                                            <TableHead>{t("Status")}</TableHead>
                                            <TableHead>{t("User")}</TableHead>
                                            <TableHead>{t("Receipt")}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {expensesLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={9} className="text-center h-24">
                                                    <Loader />
                                                </TableCell>
                                            </TableRow>
                                        ) : assetExpenses.length > 0 ? (
                                            assetExpenses.map((expense, index) => (
                                                <TableRow key={expense.id}>
                                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                                            <span className="text-sm">
                                                                {new Date(expense.date).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm font-medium">
                                                            {expense.category?.name || t("N/A")}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm max-w-[200px] truncate" title={expense.description}>
                                                            {expense.description || t("No description")}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 font-bold text-red-600">
                                                            <DollarSign className="h-3 w-3" />
                                                            <span>OMR {parseFloat(expense.amount).toFixed(2)}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{getExpenseTypeBadge(expense.expense_type)}</TableCell>
                                                    <TableCell>{getExpenseStatusBadge(expense.status)}</TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {expense.user?.name || t("N/A")}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {expense.receipt_path ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => window.open(`${import.meta.env.VITE_BASE_URL}${expense.receipt_path}`, '_blank')}
                                                                className="h-7 px-2"
                                                            >
                                                                <FileText className="h-3 w-3 mr-1" />
                                                                {t("View")}
                                                            </Button>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">{t("No receipt")}</span>
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
                                {expensesLinks.length > 0 && (
                                    <Pagination
                                        links={expensesLinks}
                                        currentPage={expensesCurrentPage}
                                        onPageChange={(page) => {
                                            setExpensesCurrentPage(page);
                                            if (selectedAssetForExpenses) {
                                                fetchAssetExpenses(selectedAssetForExpenses.id, page, expensesFilters);
                                            }
                                        }}
                                        className="p-4"
                                    />
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default GameAssetIndex; 