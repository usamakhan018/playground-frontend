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
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { toast } from 'react-hot-toast';
import { RefreshCw, SearchIcon, Filter, X, Calendar } from "lucide-react";
import { can, handleError, formatDate, formatTime } from "@/utils/helpers";
import Loader from "@/components/Loader";
import { useTranslation } from "react-i18next";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Select from "@/components/misc/Select";
import { Badge } from "@/components/ui/badge";

const ProductSalesIndex = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productSales, setProductSales] = useState([]);
  const [search, setSearch] = useState("");
  const [showRefresh, setShowRefresh] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Filter states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportFromDate, setReportFromDate] = useState("");
  const [reportToDate, setReportToDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  // Filter options
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const accessAbility = can("Product access");

  useEffect(() => {
    if (!accessAbility) navigate("/unauthorized");
    fetchProductSales(currentPage);
    fetchFilterOptions();
  }, [currentPage]);

  const fetchProductSales = async (page = 1, searchQuery = "", filters = {}) => {
    setLoading(true);
    try {
      let url = `product-sales?page=${page}`;
      
      if (searchQuery) {
        url += `&query=${encodeURIComponent(searchQuery)}`;
      }
      
      // Add filter parameters
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          url += `&${key}=${encodeURIComponent(filters[key])}`;
        }
      });

      const response = await axiosClient.get(url);
      setLinks(response.data.data.links);
      setProductSales(response.data.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    setFilterOptionsLoading(true);
    try {
      const response = await axiosClient.get('product-sales/filter-options');
      setUsers(response.data.data.users);
      setCategories(response.data.data.categories);
      setStatuses(response.data.data.statuses);
    } catch (error) {
      handleError(error);
    } finally {
      setFilterOptionsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setShowRefresh(true);
    const filters = getCurrentFilters();
    await fetchProductSales(1, search.trim(), filters);
    setCurrentPage(1);
    setLinks([]);
  };

  const getCurrentFilters = () => {
    return {
      from_date: fromDate,
      to_date: toDate,
      report_from_date: reportFromDate,
      report_to_date: reportToDate,
      user_id: selectedUser,
      category_id: selectedCategory,
      status: selectedStatus,
    };
  };

  const handleApplyFilters = async () => {
    setShowRefresh(true);
    const filters = getCurrentFilters();
    await fetchProductSales(1, search, filters);
    setCurrentPage(1);
    setLinks([]);
  };

  const handleClearFilters = async () => {
    setFromDate("");
    setToDate("");
    setReportFromDate("");
    setReportToDate("");
    setSelectedUser("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSearch("");
    setShowRefresh(false);
    await fetchProductSales(1);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setSearch("");
    setShowRefresh(false);
    handleClearFilters();
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'submitted':
        return 'info';
      case 'settled':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-3">
      <PageTitle title={t("Product Sales")} />

      <div className="flex flex-col gap-4">
        {/* Search and Filters Toggle */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={filtersOpen ? "default" : "outline"}
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {t("Advanced Filters")}
            </Button>
            {showRefresh && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t("Clear Filters")}
              </Button>
            )}
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              id="search"
              name="search"
              value={search}
              placeholder={t("Search by product, category, or user")}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Button type="submit" aria-label={t("Search")}>
              <SearchIcon className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleContent className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sale Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("From Date")}</label>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="cursor-pointer"
                    onClick={(e) => e.target.showPicker?.()}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("To Date")}</label>
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="cursor-pointer"
                    onClick={(e) => e.target.showPicker?.()}
                  />
                </div>

                {/* Report Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("Report From Date")}</label>
                  <Input
                    type="date"
                    value={reportFromDate}
                    onChange={(e) => setReportFromDate(e.target.value)}
                    className="cursor-pointer"
                    onClick={(e) => e.target.showPicker?.()}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("Report To Date")}</label>
                  <Input
                    type="date"
                    value={reportToDate}
                    onChange={(e) => setReportToDate(e.target.value)}
                    className="cursor-pointer"
                    onClick={(e) => e.target.showPicker?.()}
                  />
                </div>

                {/* User Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("Salesperson")}</label>
                  <Select
                    value={selectedUser}
                    onValueChange={setSelectedUser}
                    placeholder={t("All Users")}
                    disabled={filterOptionsLoading}
                    options={[
                      { value: "", label: t("All Users") },
                      ...users.map(user => ({
                        value: user.id.toString(),
                        label: user.name
                      }))
                    ]}
                  />
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("Product Category")}</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    placeholder={t("All Categories")}
                    disabled={filterOptionsLoading}
                    options={[
                      { value: "", label: t("All Categories") },
                      ...categories.map(category => ({
                        value: category.id.toString(),
                        label: category.name
                      }))
                    ]}
                  />
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("Report Status")}</label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                    placeholder={t("All Statuses")}
                    disabled={filterOptionsLoading}
                    options={[
                      { value: "", label: t("All Statuses") },
                      ...statuses.map(status => ({
                        value: status.value,
                        label: t(status.label)
                      }))
                    ]}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 flex flex-col justify-end">
                  <Button onClick={handleApplyFilters} className="w-full">
                    {t("Apply Filters")}
                  </Button>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{t("Sale ID")}</TableHead>
              <TableHead>{t("Product")}</TableHead>
              <TableHead>{t("Salesperson")}</TableHead>
              <TableHead>{t("Sale Date")}</TableHead>
              <TableHead>{t("Report Date")}</TableHead>
              <TableHead className="text-right">{t("Quantity")}</TableHead>
              <TableHead className="text-right">{t("Unit Price")}</TableHead>
              <TableHead className="text-right">{t("Total Amount")}</TableHead>
              <TableHead>{t("Report Status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-24">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : productSales.length > 0 ? (
              productSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">#{sale.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sale.product?.name || t("Unknown")}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {sale.product?.category?.name || t("Uncategorized")}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sale.sale_report?.user?.name || t("Unknown")}</div>
                      <div className="text-xs text-muted-foreground">
                        {sale.sale_report?.user?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatDate(sale.created_at)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(sale.created_at)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {sale.sale_report?.date ? formatDate(sale.sale_report.date) : t("N/A")}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {sale.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    OMR {parseFloat(sale.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    OMR {parseFloat(sale.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(sale.sale_report?.status)}>
                      {t(sale.sale_report?.status || "Unknown")}
                    </Badge>
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
        {links.length > 0 && (
          <Pagination
            links={links}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            className="p-4"
          />
        )}
      </div>
    </div>
  );
};

export default ProductSalesIndex; 