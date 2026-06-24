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
import { EditIcon, MoreHorizontal, RefreshCw, Trash2Icon, SearchIcon, Clock, CheckCircle, DollarSign, Gamepad, Gamepad2, CreditCard, TrendingUp, Building, Download } from "lucide-react";
import Edit from "./Edit";
import Create from "./Create";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import DeleteAlert from "@/components/misc/DeleteAlert";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "../StatCard";
import ReportFilterComponent from "@/components/misc/ReportFilterComponent";

const REPORT_TYPES = {
  games: { endpoint: 'reports/get-games-data', dataKey: 'games' },
  assets: { endpoint: 'reports/get-assets-data', dataKey: 'assets' },
  products: { endpoint: 'reports/get-products-data', dataKey: 'products' },
  branches: { endpoint: 'reports/get-branches-data', dataKey: 'branches' },
};

const ReportsIndex = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
  const [activeReportType, setActiveReportType] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});
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

  useEffect(() => {
    if (activeReportType) {
      fetchReportData(activeReportType, currentFilters);
    }
  }, [currentFilters, activeReportType]);

  const buildParams = (filters = {}) => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params[key] = value;
      }
    });
    return params;
  };

  const fetchReportData = async (type, filters = {}) => {
    const config = REPORT_TYPES[type];
    if (!config) return;

    setLoading(true);
    try {
      const response = await axiosClient.get(config.endpoint, { params: buildParams(filters) });
      setStats(response.data.data.stats);
      setReports(response.data.data[config.dataKey] || []);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const selectReportType = (type) => {
    setGameSelected(type === 'games');
    setAssetSelected(type === 'assets');
    setProductSelected(type === 'products');
    setBranchSelected(type === 'branches');
    setSearch("");
    setShowRefresh(false);
    setCurrentFilters({});
    setActiveReportType(type);
  };

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

    if (activeReportType) {
      fetchReportData(activeReportType, currentFilters);
    } else {
      fetchReports(currentPage);
    }

    setRefreshing(false);
  };

  // export pdf of the current report
  const exportReport = async () => {
    try {
      setLoading({ ...loading, export: true });
      const response = await axiosClient.get(`reports/export`, { params: buildParams(currentFilters) });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `report_${activeReportType}_${new Date().toISOString().split('T')[0]}.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(t("Report exported successfully") + " " + filename);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading({ ...loading, export: false });
    }
  }

  const getGamesData = () => selectReportType('games');
  const getAssetsData = () => selectReportType('assets');
  const getProductsData = () => selectReportType('products');
  const getBranchesData = () => selectReportType('branches');



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

  const hasActiveReport = gameSelected || assetSelected || productSelected || branchSelected;
  const salesColumnLabel = gameSelected ? t("Total Tickets") : t("Total Sales");
  const tableColSpan = hasActiveReport ? (assetSelected ? 8 : 7) : 6;

  return (
    <div className="space-y-3">
      <div className="flex flex-row justify-between">
        <PageTitle title={t("Reports")} />
        <div className="flex flex-row items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportReport()}
            disabled={loading?.export}
            className="flex items-center gap-2 mr-2"
          >
            {loading?.export ? <Loader /> : <Download className={`h-4 w-4 ${loading?.export ? 'animate-spin' : ''}`} />}
            {t("Export")}
          </Button>
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

      {hasActiveReport && (
        <ReportFilterComponent
          onFilter={handleFilter}
          onReset={handleResetFilters}
          showGameFilter={gameSelected || assetSelected}
          showAssetFilter={assetSelected}
          showProductFilter={productSelected}
          showBranchFilter={branchSelected}
          loading={loading}
        />
      )}

      <div className="bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>{gameSelected ? t("Game") : assetSelected ? t("Asset") : productSelected ? t("Product") : branchSelected ? t("Branch") : t("Report")}</TableHead>
              {assetSelected && <TableHead>{t("Game")}</TableHead>}
              {hasActiveReport && <TableHead>{salesColumnLabel}</TableHead>}
              <TableHead>{t("Total Revenue")}</TableHead>
              <TableHead>{t("Total Expenses")}</TableHead>
              <TableHead>{t("Net Profit")}</TableHead>
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={tableColSpan} className="text-center h-24">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : reports.length > 0 ? (
              reports.map((report, index) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{report.name}</TableCell>
                  {assetSelected && <TableCell>{report.game_name || '-'}</TableCell>}
                  {hasActiveReport && <TableCell>{report.total_sales ?? 0}</TableCell>}
                  <TableCell>OMR {parseFloat(report.total_revenue ?? 0).toFixed(2)}</TableCell>
                  <TableCell>OMR {parseFloat(report.total_expenses ?? 0).toFixed(2)}</TableCell>
                  <TableCell>OMR {parseFloat(report.net_profit ?? 0).toFixed(2)}</TableCell>
                  <TableCell className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      // onClick={() => exportReport()}
                      // disabled={loading?.export}
                      className="flex items-center gap-2 mr-2"
                    >
                      {loading?.export ? <Loader /> : <Download className={`h-4 w-4 ${loading?.export ? 'animate-spin' : ''}`} />}
                      {t("Export")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableColSpan} className="text-center h-24">
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

      {
        deleteAlertOpen && (
          <DeleteAlert
            open={deleteAlertOpen}
            onClose={setDeleteAlertOpen}
            onSubmitSuccess={fetchReports}
            record={selectedRecord}
            api="reports/delete"
          />
        )
      }

      {
        editDialogOpen && (
          <Edit
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            onSubmitSuccess={fetchReports}
            record={selectedRecord}
          />
        )
      }
    </div >
  );
};

export default ReportsIndex;