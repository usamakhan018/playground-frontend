import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import Select from "../../misc/Select";
import { useTranslation } from "react-i18next";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { handleError } from "@/utils/helpers";
import { Download, FileText, FileSpreadsheet, Calendar } from "lucide-react";

const ExportDialog = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    users: [],
    games: [],
    categories: [],
    payment_methods: [],
    statuses: [],
    expense_types: []
  });
  
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    user_id: '',
    game_id: '',
    category_id: '',
    payment_method: '',
    status: '',
    expense_type: ''
  });

  useEffect(() => {
    if (open) {
      fetchFilterOptions();
      setDefaultDates();
    }
  }, [open]);

  const setDefaultDates = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    setFilters(prev => ({
      ...prev,
      start_date: firstDayOfMonth.toISOString().split('T')[0],
      end_date: today.toISOString().split('T')[0]
    }));
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await axiosClient.get('/exports/filter-options');
      setFilterOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleExport = async (type) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await axiosClient.get(`/exports/${type}?${params.toString()}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(t('Export completed successfully'));
      onOpenChange(false);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      start_date: '',
      end_date: '',
      user_id: '',
      game_id: '',
      category_id: '',
      payment_method: '',
      status: '',
      expense_type: ''
    });
    setDefaultDates();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            {t("Export Data")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Range */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t("Start Date")}
              </Label>
              <div className="relative">
                <Input
                  id="start_date"
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => handleFilterChange('start_date', e.target.value)}
                  className="w-full cursor-pointer"
                  onClick={(e) => e.target.showPicker()}
                />
                <div className="absolute inset-0" onClick={(e) => e.target.previousSibling.showPicker()}></div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t("End Date")}
              </Label>
              <div className="relative">
                <Input
                  id="end_date"
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => handleFilterChange('end_date', e.target.value)}
                  className="w-full cursor-pointer"
                  onClick={(e) => e.target.showPicker()}
                />
                <div className="absolute inset-0" onClick={(e) => e.target.previousSibling.showPicker()}></div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>{t("User")}</Label>
              <Select
                placeholder={t("Select User")}
                value={filters.user_id}
                onChange={(value) => handleFilterChange('user_id', value)}
                options={filterOptions.users.map(user => ({
                  value: user.id.toString(),
                  label: user.name
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("Game")}</Label>
              <Select
                placeholder={t("Select Game")}
                value={filters.game_id}
                onChange={(value) => handleFilterChange('game_id', value)}
                options={filterOptions.games.map(game => ({
                  value: game.id.toString(),
                  label: game.name
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("Category")}</Label>
              <Select
                placeholder={t("Select Category")}
                value={filters.category_id}
                onChange={(value) => handleFilterChange('category_id', value)}
                options={filterOptions.categories.map(category => ({
                  value: category.id.toString(),
                  label: category.name
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("Payment Method")}</Label>
              <Select
                placeholder={t("Select Payment Method")}
                value={filters.payment_method}
                onChange={(value) => handleFilterChange('payment_method', value)}
                options={filterOptions.payment_methods.map(method => ({
                  value: method,
                  label: method.charAt(0).toUpperCase() + method.slice(1).replace('_', ' ')
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("Status")}</Label>
              <Select
                placeholder={t("Select Status")}
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                options={filterOptions.statuses.map(status => ({
                  value: status,
                  label: status.charAt(0).toUpperCase() + status.slice(1)
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("Expense Type")}</Label>
              <Select
                placeholder={t("Select Expense Type")}
                value={filters.expense_type}
                onChange={(value) => handleFilterChange('expense_type', value)}
                options={filterOptions.expense_types.map(type => ({
                  value: type,
                  label: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
                }))}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                {t("Clear Filters")}
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Button
                onClick={() => handleExport('sales')}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {loading ? t("Exporting...") : t("Export Sales")}
              </Button>

              <Button
                onClick={() => handleExport('expenses')}
                disabled={loading}
                className="flex items-center gap-2"
                variant="secondary"
              >
                <Download className="h-4 w-4" />
                {loading ? t("Exporting...") : t("Export Expenses")}
              </Button>

              <Button
                onClick={() => handleExport('combined')}
                disabled={loading}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                {loading ? t("Exporting...") : t("Export Combined")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog; 