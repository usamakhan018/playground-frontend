import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CalendarIcon, FilterIcon, RefreshCw, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { getUsers, getGames, getGameAssets, getProducts, getBranches } from "@/stores/features/ajaxFeature";
import Select from "./Select";

const ReportFilterComponent = ({
  onFilter,
  onReset,
  showUserFilter = true,
  showDateFilter = true,
  showGameFilter = false,
  showAssetFilter = false,
  showProductFilter = false,
  showBranchFilter = false,
  loading = false
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { users, games, gameAssets, products, branches } = useSelector((state) => state.ajax);

  const [filters, setFilters] = useState({
    game: '',
    asset: '',
    product: '',
    branch: '',
    user_id: '',
    from_date: '',
    to_date: '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  useEffect(() => {
    if (showUserFilter && !users) {
      dispatch(getUsers());
    }
    if (showGameFilter && !games) {
      dispatch(getGames());
    }
    if (showAssetFilter && !gameAssets) {
      dispatch(getGameAssets());
    }
    if (showProductFilter && !products) {
      dispatch(getProducts());
    }
    if (showBranchFilter && !branches) {
      dispatch(getBranches());
    }
  }, [
    dispatch,
    showUserFilter,
    showGameFilter,
    showAssetFilter,
    showProductFilter,
    showBranchFilter,
    users,
    games,
    gameAssets,
    products,
    branches,
  ]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };

    if (key === 'game') {
      newFilters.asset = '';
    }

    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      game: '',
      asset: '',
      product: '',
      branch: '',
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

  const gameOptions = games ? games.map(game => ({
    value: game.id,
    label: game.name
  })) : [];

  const assetOptions = useMemo(() => {
    if (!gameAssets) return [];

    const filteredAssets = filters.game
      ? gameAssets.filter(asset => String(asset.game_id) === String(filters.game))
      : gameAssets;

    return filteredAssets.map(asset => ({
      value: asset.id,
      label: asset.name
    }));
  }, [gameAssets, filters.game]);

  const productOptionsList = products ? products.map(product => ({
    value: product.id,
    label: product.name
  })) : [];

  const branchOptionsList = branches ? branches.map(branch => ({
    value: branch.id,
    label: branch.name
  })) : [];

  const hasActiveFilters = Object.values(filters).some(value => Boolean(value));

  return (
    <div className="space-y-4">
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
              {Object.values(filters).filter(Boolean).length}
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
              {showGameFilter && (
                <div className="space-y-2">
                  <Label htmlFor="game-filter">{t("Game")}</Label>
                  <Select
                    id="game-filter"
                    value={filters.game}
                    onChange={(value) => handleFilterChange('game', value)}
                    options={[
                      { value: '', label: t('All Games') },
                      ...gameOptions
                    ]}
                    placeholder={t("Select game")}
                    loading={!games}
                  />
                </div>
              )}

              {showAssetFilter && (
                <div className="space-y-2">
                  <Label htmlFor="asset-filter">{t("Asset")}</Label>
                  <Select
                    id="asset-filter"
                    value={filters.asset}
                    onChange={(value) => handleFilterChange('asset', value)}
                    options={[
                      { value: '', label: t('All Assets') },
                      ...assetOptions
                    ]}
                    placeholder={t("Select asset")}
                    loading={!gameAssets}
                  />
                </div>
              )}

              {showProductFilter && (
                <div className="space-y-2">
                  <Label htmlFor="product-filter">{t("Product")}</Label>
                  <Select
                    id="product-filter"
                    value={filters.product}
                    onChange={(value) => handleFilterChange('product', value)}
                    options={[
                      { value: '', label: t('All Products') },
                      ...productOptionsList
                    ]}
                    placeholder={t("Select product")}
                    loading={!products}
                  />
                </div>
              )}

              {showBranchFilter && (
                <div className="space-y-2">
                  <Label htmlFor="branch-filter">{t("Branch")}</Label>
                  <Select
                    id="branch-filter"
                    value={filters.branch}
                    onChange={(value) => handleFilterChange('branch', value)}
                    options={[
                      { value: '', label: t('All Branches') },
                      ...branchOptionsList
                    ]}
                    placeholder={t("Select branch")}
                    loading={!branches}
                  />
                </div>
              )}

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

              {showDateFilter && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="from-date-filter">{t("From Date")}</Label>
                    <div className="relative cursor-pointer" onClick={() => fromDateRef.current?.showPicker?.()}>
                      <Input
                        id="from-date-filter"
                        type="date"
                        value={filters.from_date}
                        onChange={(e) => handleFilterChange('from_date', e.target.value)}
                        ref={fromDateRef}
                        className="cursor-pointer"
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to-date-filter">{t("To Date")}</Label>
                    <div className="relative cursor-pointer" onClick={() => toDateRef.current?.showPicker?.()}>
                      <Input
                        id="to-date-filter"
                        type="date"
                        value={filters.to_date}
                        onChange={(e) => handleFilterChange('to_date', e.target.value)}
                        ref={toDateRef}
                        className="cursor-pointer"
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </>
              )}
            </div>

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

export default ReportFilterComponent;
