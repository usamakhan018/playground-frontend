import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CalendarIcon, FilterIcon, RefreshCw, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "@/stores/features/ajaxFeature";
import Select from "./Select";

const FilterComponent = ({
  onFilter,
  onReset,
  statusOptions = [],
  showUserFilter = true,
  showDateFilter = true,
  showStatusFilter = true,
  defaultStatus = null,
  loading = false
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.ajax);

  const [filters, setFilters] = useState({
    status: defaultStatus || '',
    user_id: '',
    from_date: '',
    to_date: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (showUserFilter && !users) {
      dispatch(getUsers());
    }
  }, [dispatch, showUserFilter, users]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Auto-apply filters when they change
    onFilter(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: defaultStatus || '',
      user_id: '',
      from_date: '',
      to_date: '',
    };
    setFilters(resetFilters);
    onReset();
  };

  const userOptions = users ? users.map(user => ({
    value: user.id,
    label: `${user.name} (${user.email})`
  })) : [];

  const hasActiveFilters = Object.values(filters).some(value =>
    value && value !== defaultStatus
  );

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <FilterIcon className="h-4 w-4" />
          {t("Filters")}
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white rounded-full text-xs px-2 py-0.5 ml-1">
              {Object.values(filters).filter(v => v && v !== defaultStatus).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <XIcon className="h-3 w-3" />
            {t("Clear Filters")}
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FilterIcon className="h-4 w-4" />
              {t("Filter Options")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              {showStatusFilter && statusOptions.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="status-filter">{t("Status")}</Label>
                  <Select
                    id="status-filter"
                    value={filters.status}
                    onChange={(value) => handleFilterChange('status', value)}
                    options={[
                      ...statusOptions.map(option => ({
                        value: option.value,
                        label: t(option.label)
                      }))
                    ]}
                    placeholder={t("Select status")}
                  />
                </div>
              )}

              {/* User Filter */}
              {showUserFilter && (
                <div className="space-y-2">
                  <Label htmlFor="user-filter">{t("User")}</Label>
                  <Select
                    id="user-filter"
                    value={filters.user_id}
                    onChange={(value) => handleFilterChange('user_id', value)}
                    options={[
                      { value: '', label: t('All Users') },
                      ...userOptions
                    ]}
                    placeholder={t("Select user")}
                    loading={!users}
                  />
                </div>
              )}

              {/* Date Range Filters */}
              {showDateFilter && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="from-date-filter">{t("From Date")}</Label>
                    <div className="relative">
                      <Input
                        id="from-date-filter"
                        type="date"
                        value={filters.from_date}
                        onChange={(e) => handleFilterChange('from_date', e.target.value)}
                        className="cursor-pointer"
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to-date-filter">{t("To Date")}</Label>
                    <div className="relative">
                      <Input
                        id="to-date-filter"
                        type="date"
                        value={filters.to_date}
                        onChange={(e) => handleFilterChange('to_date', e.target.value)}
                        className="cursor-pointer"
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={loading || !hasActiveFilters}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                {t("Reset")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FilterComponent; 