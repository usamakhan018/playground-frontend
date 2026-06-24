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
import { EditIcon, MoreHorizontal, RefreshCw, Trash2Icon, SearchIcon, Clock, CheckCircle, DollarSign, Gamepad, Gamepad2, CreditCard, TrendingUp, Building } from "lucide-react";
import Edit from "./Edit";
import Create from "./Create";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import DeleteAlert from "@/components/misc/DeleteAlert";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "../StatCard";
import FilterComponent from "@/components/misc/FilterComponent";
import ReportFilterComponent from "@/components/misc/ReportFilterComponent";

const ReportsIndex = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [showRefresh, setShowRefresh] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [stats, setStats] = useState({});
  const [gameSelected, setGameSelected] = useState(false);
  const [assetSelected, setAssetSelected] = useState(false);
  const [productSelected, setProductSelected] = useState(false);
  const [branchSelected, setBranchSelected] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const accessAbility = can("Report access");
  const createAbility = can("Report create");
  const updateAbility = can("Report update");
  const deleteAbility = can("Report delete");

  useEffect(() => {
    if (!accessAbility) navigate("/unauthorized");
    fetchReports(currentPage);
  }, [currentPage]);

  const fetchReports = async (page = 1) => {
    try {
      const response = await axiosClient.get(`reports`);
      setStats(response.data.data.stats);
    } catch (error) {
      handleError(error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setSearch("");
    setShowRefresh(false);
    setRefreshing(false);
    setGameSelected(false);
    setAssetSelected(false);
    setProductSelected(false);
    setBranchSelected(false);
    setReports([]);
  };

  const getGamesData = async () => {
    handleRefresh();
    setGameSelected(true);
    setLoading(true);
    try {
      const response = await axiosClient.get(`reports/get-games-data`);
      setStats(response.data.data.stats);
      setReports(response.data.data.games);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };


  const getAssetsData = async () => {
    handleRefresh();
    setAssetSelected(true);
    setLoading(true);
    try {
      const response = await axiosClient.get(`reports/get-assets-data`);
      setStats(response.data.data.stats);
      setReports(response.data.data.assets);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const getProductsData = async () => {
    await handleRefresh();
    setProductSelected(true);
    setLoading(true);
    try {
      const response = await axiosClient.get(`reports/get-products-data`);
      setStats(response.data.data.stats);
      setReports(response.data.data.products);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };


  const getBranchesData = async () => {
    await handleRefresh();
    setBranchSelected(true);
    setLoading(true);
    try {
      const response = await axiosClient.get(`reports/get-branches-data`);
      setStats(response.data.data.stats);
      setReports(response.data.data.branches);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(reports)



  // =====================
  // Data
  // =====================

  // Games
  const gameKpis = [
    {
      title: t("Total Games Played"),
      count: stats?.total_games || 0,
      icon: Gamepad2,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-800 dark:text-blue-100",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: t("Total games played")
    },
    {
      title: t("Total Game Revenue"),
      count: `OMR ${parseFloat(stats?.total_game_revenue ? stats?.total_game_revenue : 0).toFixed(2)}`,
      icon: DollarSign,
      bgColor: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-800 dark:text-green-100",
      iconColor: "text-green-600 dark:text-green-400",
      description: t("Total game revenue")
    },
    {
      title: t("Total Game Expenses"),
      count: `OMR ${parseFloat(stats?.total_game_expenses ? stats?.total_game_expenses : 0).toFixed(2)}`,
      icon: CreditCard,
      bgColor: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-800 dark:text-red-100",
      iconColor: "text-red-600 dark:text-red-400",
      description: t("Total game expenses")
    },
    {
      title: t("Total Game Profit"),
      count: `OMR ${parseFloat(stats?.total_game_profit ? stats?.total_game_profit : 0).toFixed(2)}`,
      icon: TrendingUp,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-800 dark:text-blue-100",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: t("Total game profit")
    },
  ];


  // Assets
  const assetKpis = [
    {
      title: t("Total Assets"),
      count: stats?.total_assets || 0,
      icon: CheckCircle,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-800 dark:text-blue-100",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: t("Total assets")
    },
    {
      title: t("Total Asset Revenue"),
      count: `OMR ${parseFloat(stats?.total_asset_revenue ? stats?.total_asset_revenue : 0).toFixed(2)}`,
      icon: DollarSign,
      bgColor: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-800 dark:text-green-100",
      iconColor: "text-green-600 dark:text-green-400",
      description: t("Total asset revenue")
    },
    {
      title: t("Total Asset Expenses"),
      count: `OMR ${parseFloat(stats?.total_asset_expenses ? stats?.total_asset_expenses : 0).toFixed(2)}`,
      icon: CreditCard,
      bgColor: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-800 dark:text-red-100",
      iconColor: "text-red-600 dark:text-red-400",
      description: t("Total asset expenses")
    },
    {
      title: t("Total Asset Profit"),
      count: `OMR ${parseFloat(stats?.total_asset_profit ? stats?.total_asset_profit : 0).toFixed(2)}`,
      icon: TrendingUp,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-800 dark:text-blue-100",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: t("Total asset profit")
    },
  ];

  // Products
  const productKpis = [
    {
      title: t("Total Products"),
      count: stats?.total_products || 0,
      icon: CheckCircle,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-800 dark:text-blue-100",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: t("Total products")
    },
    {
      title: t("Total Product Revenue"),
      count: `OMR ${parseFloat(stats?.total_product_revenue ? stats?.total_product_revenue : 0).toFixed(2)}`,
      icon: DollarSign,
      bgColor: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-800 dark:text-green-100",
      iconColor: "text-green-600 dark:text-green-400",
      description: t("Total product revenue")
    },
    {
      title: t("Total Product Expenses"),
      count: `OMR ${parseFloat(stats?.total_product_expenses ? stats?.total_product_expenses : 0).toFixed(2)}`,
      icon: CreditCard,
      bgColor: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-800 dark:text-red-100",
      iconColor: "text-red-600 dark:text-red-400",
      description: t("Total product expenses")
    },
    {
      title: t("Total Product Profit"),
      count: `OMR ${parseFloat(stats?.total_product_profit ? stats?.total_product_profit : 0).toFixed(2)}`,
      icon: TrendingUp,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-800 dark:text-blue-100",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: t("Total product profit")
    },
  ];
  // Branches
  const branchKpis = [
    {
      title: t("Total Branches"),
      count: stats?.total_branches || 0,
      icon: CheckCircle,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-800 dark:text-blue-100",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: t("Total branches")
    },
    {
      title: t("Total Branch Revenue"),
      count: `OMR ${parseFloat(stats?.total_branch_revenue ? stats?.total_branch_revenue : 0).toFixed(2)}`,
      icon: DollarSign,
      bgColor: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-800 dark:text-green-100",
      iconColor: "text-green-600 dark:text-green-400",
      description: t("Total branch revenue")
    },
    {
      title: t("Total Branch Expenses"),
      count: `OMR ${parseFloat(stats?.total_branch_expenses ? stats?.total_branch_expenses : 0).toFixed(2)}`,
      icon: CreditCard,
      bgColor: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-800 dark:text-red-100",
      iconColor: "text-red-600 dark:text-red-400",
      description: t("Total branch expenses")
    },
    {
      title: t("Total Branch Profit"),
      count: `OMR ${parseFloat(stats?.total_branch_profit ? stats?.total_branch_profit : 0).toFixed(2)}`,
      icon: TrendingUp,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-800 dark:text-blue-100",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: t("Total branch profit")
    },
  ];




  // =====================
  // Filters
  // =====================

  const handleFilter = (filters) => {
    setCurrentFilters(filters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setCurrentFilters({});
    setCurrentPage(1);
  };

  const statusOptions = [
    { value: 'pending', label: t('Pending') },
    { value: 'submitted', label: t('Submitted') },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-row justify-between">
        <PageTitle title={t("Reports")} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRefresh()}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? t("Refreshing...") : t("Refresh")}
        </Button>
      </div>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={getGamesData}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold dark:text-yellow-400">{t("Games")}</CardTitle>
            <Gamepad className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats?.total_games || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Total games")}
            </p>
          </CardContent>
        </Card>

        <Card className="border dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={getAssetsData}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold dark:text-blue-400">{t("Assets")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats?.total_assets || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Total assets")}
            </p>
          </CardContent>
        </Card>

        {/* Collected Amount Card */}
        <Card className="border dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={getProductsData}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold dark:text-green-400">{t("Products")}</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats?.total_products || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Total products")}
            </p>
          </CardContent>
        </Card>

        <Card className="border dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={getBranchesData}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold dark:text-green-400">{t("Branches")}</CardTitle>
            <Building className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats?.total_branches || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Total branches")}
            </p>
          </CardContent>
        </Card>
      </div>

      {gameSelected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gameKpis.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {assetSelected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {assetKpis.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {productSelected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {productKpis.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {branchSelected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {branchKpis.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <div className="flex justify-between items-center">
          <ReportFilterComponent
            onFilter={handleFilter}
            onReset={handleResetFilters}
            statusOptions={statusOptions}
            defaultStatus="pending"
            loading={loading}
          />
        </div>
        <div>
          
        </div>
      </div>
      <div className="bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>{gameSelected ? t("Game") : assetSelected ? t("Asset") : productSelected ? t("Product") : branchSelected ? t("Branch") : t("Report")}</TableHead>
              {productSelected && <TableHead>{t("Total Sales")}</TableHead>}
              <TableHead>{t("Total Revenue")}</TableHead>
              {!productSelected && <TableHead>{t("Total Expenses")}</TableHead>}
              {!productSelected && <TableHead>{t("Net Profit")}</TableHead>}
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : reports.length > 0 ? (
              reports.map((report, index) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{report.name}</TableCell>
                  {productSelected && <TableCell>{report.total_sales}</TableCell>}
                  <TableCell>OMR {parseFloat(report.total_game_revenue || 0).toFixed(2)}</TableCell>
                  {!productSelected && <TableCell>OMR {parseFloat(report.total_asset_expenses || 0).toFixed(2)}</TableCell>}
                  {!productSelected && <TableCell>OMR {parseFloat(report.net_game_profit || 0).toFixed(2)}</TableCell>}
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
                        {updateAbility && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedRecord(report);
                            setEditDialogOpen(true);
                          }}>
                            <EditIcon className="mr-2 h-4 w-4" />
                            {t("Edit")}
                          </DropdownMenuItem>
                        )}
                        {deleteAbility && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedRecord(report);
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
                <TableCell colSpan={6} className="text-center h-24">
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
          onSubmitSuccess={fetchReports}
          record={selectedRecord}
          api="reports/delete"
        />
      )}

      {editDialogOpen && (
        <Edit
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmitSuccess={fetchReports}
          record={selectedRecord}
        />
      )}
    </div>
  );
};

export default ReportsIndex;