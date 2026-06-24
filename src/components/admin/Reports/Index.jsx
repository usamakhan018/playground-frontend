import axiosClient from "@/axios";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { EditIcon, MoreHorizontal, RefreshCw, Trash2Icon, SearchIcon, Clock, CheckCircle, DollarSign, Gamepad, Gamepad2, CreditCard, TrendingUp, Building, Download, Users } from "lucide-react";
import Edit from "./Edit";
import Create from "./Create";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import DeleteAlert from "@/components/misc/DeleteAlert";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "../StatCard";
import ReportFilterComponent from "@/components/misc/ReportFilterComponent";
import { gameKpis, assetKpis, productKpis, branchKpis, employeeKpis } from "./reportStats";

const REPORT_TYPES = {
  games: { endpoint: 'reports/get-games-data', dataKey: 'games' },
  assets: { endpoint: 'reports/get-assets-data', dataKey: 'assets' },
  products: { endpoint: 'reports/get-products-data', dataKey: 'products' },
  branches: { endpoint: 'reports/get-branches-data', dataKey: 'branches' },
  employees: { endpoint: 'reports/get-employees-data', dataKey: 'employees' },
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
  const [gameSelected, setGameSelected] = useState(false);
  const [assetSelected, setAssetSelected] = useState(false);
  const [productSelected, setProductSelected] = useState(false);
  const [branchSelected, setBranchSelected] = useState(false);
  const [employeeSelected, setEmployeeSelected] = useState(false);
  const [activeReportType, setActiveReportType] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});
  const [reportFormat, setReportFormat] = useState('pdf');

  const [stats, setStats] = useState({});
  const [mainStats, setMainStats] = useState({});


  const navigate = useNavigate();
  const { t } = useTranslation();

  const accessAbility = can("Report access");
  const createAbility = can("Report create");
  const updateAbility = can("Report update");
  const deleteAbility = can("Report delete");

  useEffect(() => {
    if (!accessAbility) navigate("/unauthorized");
    fetchMainStats();
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
    setEmployeeSelected(type === 'employees');
    setSearch("");
    setShowRefresh(false);
    setCurrentFilters({});
    setActiveReportType(type);
  };

  const fetchMainStats = async () => {
    try {
      const response = await axiosClient.get(`reports`);
      setMainStats(response.data.data.stats);
    } catch (error) {
      handleError(error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setSearch("");
    setShowRefresh(false);
    setGameSelected(false);
    setAssetSelected(false);
    setProductSelected(false);
    setBranchSelected(false);
    if (activeReportType) {
      fetchReportData(activeReportType, currentFilters);
    } else {
      fetchMainStats();
    }

    setRefreshing(false);
  };

  // export pdf of the current report
  const exportReport = async () => {
    try {
      setLoading({ ...loading, export: true });
      const response = await axiosClient.post(`reports/export`, buildParams({ ...currentFilters, report_type: activeReportType, report_format: reportFormat }));
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `report_${activeReportType}_${new Date().toISOString().split('T')[0]}.${reportFormat === 'pdf' ? 'pdf' : 'xlsx'}`;
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
  const getEmployeesData = () => selectReportType('employees');






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

  const hasActiveReport = gameSelected || assetSelected || productSelected || branchSelected || employeeSelected;
  const salesColumnLabel = gameSelected ? t("Total Tickets") : t("Total Sales");
  const tableColSpan = hasActiveReport ? (assetSelected ? 8 : 7) : 6;

  return (
    <div className="space-y-3">
      <div className="flex flex-row justify-between">
        <PageTitle title={t("Reports")} />
        <div className="flex flex-row items-center gap-2">

          <RadioGroup defaultValue={reportFormat} onValueChange={setReportFormat} className="flex flex-row items-center gap-4 w-fit">
            <div className="flex items-center gap-1">
              <RadioGroupItem value="pdf" id="r1" />
              <Label htmlFor="r1">{t("PDF")}</Label>
            </div>
            <div className="flex items-center gap-1">
              <RadioGroupItem value="excel" id="r2" />
              <Label htmlFor="r2">{t("Excel")}</Label>
            </div>
          </RadioGroup>


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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={getGamesData}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold dark:text-yellow-400">{t("Games")}</CardTitle>
            <Gamepad className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {mainStats?.total_games || 0}
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
              {mainStats?.total_assets || 0}
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
              {mainStats?.total_products || 0}
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
              {mainStats?.total_branches || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Total branches")}
            </p>
          </CardContent>
        </Card>

        <Card className="border dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={getEmployeesData}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold dark:text-green-400">{t("Employees")}</CardTitle>
            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {mainStats?.total_employees || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Total employees")}
            </p>
          </CardContent>
        </Card>
      </div>

      {gameSelected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gameKpis(stats).map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {assetSelected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {assetKpis(stats).map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {productSelected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {productKpis(stats).map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {branchSelected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {branchKpis(stats).map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {employeeSelected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {employeeKpis(stats).map((card) => (
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
          showEmployeeFilter={employeeSelected}
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
            onSubmitSuccess={fetchMainStats}
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
            onSubmitSuccess={fetchMainStats}
            record={selectedRecord}
          />
        )
      }
    </div >
  );
};

export default ReportsIndex;