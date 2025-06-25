import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import PageTitle from "./Layouts/PageTitle";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { handleError } from "@/utils/helpers";
import { getProductCategories, getProducts } from "@/stores/features/ajaxFeature";
import { 
  ShoppingCart,
  Package,
  DollarSign,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  TrendingUp
} from "lucide-react";
import Loader from "../Loader";
import ImagePreview from "../misc/ImagePreview";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const SaleDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // Redux state
  const productCategories = useSelector(state => state.ajax.productCategories);
  const products = useSelector(state => state.ajax.products);
  const loading = useSelector(state => state.ajax.loading);
  
  // State management
  const [processing, setProcessing] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Sale form state
  const [quantity, setQuantity] = useState(1);
  const [salePrice, setSalePrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Today's stats
  const [todayStats, setTodayStats] = useState({
    total_sales: 0,
    total_revenue: 0,
    total_products_sold: 0
  });

  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Filter products when category is selected or products change
  useEffect(() => {
    if (selectedCategory && products) {
      const filtered = products.filter(product => product.product_category_id === selectedCategory.id);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [selectedCategory, products]);

  // Calculate total when quantity or price changes
  useEffect(() => {
    if (salePrice && quantity) {
      setTotalAmount((parseFloat(salePrice) * parseInt(quantity)).toFixed(2));
    } else {
      setTotalAmount(0);
    }
  }, [quantity, salePrice]);

  // Set sale price when product is selected
  useEffect(() => {
    if (selectedProduct) {
      setSalePrice(selectedProduct.price);
    }
  }, [selectedProduct]);

  const fetchInitialData = async () => {
    try {
      // Dispatch Redux actions to fetch data if not already loaded
      if (!productCategories) {
        dispatch(getProductCategories());
      }
      if (!products) {
        dispatch(getProducts());
      }
      
      await fetchTodayStats();
    } catch (error) {
      handleError(error);
    }
  };

  const fetchTodayStats = async () => {
    try {
      // This would fetch today's product sales stats
      // For now, using dummy data since backend isn't implemented yet
      setTodayStats({
        total_sales: 0,
        total_revenue: 0,
        total_products_sold: 0
      });
    } catch (error) {
      console.error('Error fetching today stats:', error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedProduct(null);
    setQuantity(1);
    setSalePrice(0);
    setTotalAmount(0);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handlePriceChange = (e) => {
    const price = e.target.value;
    if (price >= 0) {
      setSalePrice(price);
    }
  };

  const handleSaleSubmit = async () => {
    if (!selectedProduct || quantity < 1 || salePrice <= 0) {
      toast.error(t("Please select a product and enter valid quantity and price"));
      return;
    }

    setProcessing(true);
    try {
      // This would submit the sale to backend
      // For now, just show success message
      toast.success(t("Product sale recorded successfully!"));
      
      // Reset form
      setSelectedProduct(null);
      setQuantity(1);
      setSalePrice(0);
      setTotalAmount(0);
      
      // Update stats
      await fetchTodayStats();
      
    } catch (error) {
      handleError(error);
    } finally {
      setProcessing(false);
    }
  };

  const goBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedProduct(null);
    setFilteredProducts([]);
    setQuantity(1);
    setSalePrice(0);
    setTotalAmount(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle title={t("Product Sales Dashboard")} />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInitialData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {t("Refresh")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Today's Sales")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.total_sales}</div>
            <p className="text-xs text-muted-foreground">{t("Total transactions")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Revenue")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              OMR {parseFloat(todayStats.total_revenue).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{t("Today's earnings")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Products Sold")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayStats.total_products_sold}</div>
            <p className="text-xs text-muted-foreground">{t("Items today")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Categories/Products Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {selectedCategory ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={goBackToCategories}
                        className="p-1 h-8 w-8"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Package className="h-5 w-5" />
                      {selectedCategory.name} - {t("Products")}
                    </>
                  ) : (
                    <>
                      <Package className="h-5 w-5" />
                      {t("Product Categories")}
                    </>
                  )}
                </CardTitle>
                {selectedCategory && (
                  <Badge variant="outline">
                    {filteredProducts.length} {t("Products")}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedCategory ? (
                // Categories Grid
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader />
                    </div>
                  ) : productCategories && productCategories.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {productCategories.map((category) => (
                        <div
                          key={category.id}
                          onClick={() => handleCategorySelect(category)}
                          className="group relative cursor-pointer rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 p-4 bg-white hover:shadow-md"
                        >
                          <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                            {category.image ? (
                              <ImagePreview
                                src={`${import.meta.env.VITE_BASE_URL}${category.image}`}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-center">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-muted-foreground text-center mt-1 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                          <Badge 
                            variant={category.status === 'available' ? 'available' : 'unavailable'}
                            className="absolute top-2 right-2"
                          >
                            {category.status === 'available' ? t("Available") : t("Unavailable")}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>{t("No categories found")}</p>
                    </div>
                  )}
                </div>
              ) : (
                // Products Grid
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader />
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductSelect(product)}
                          className={`group relative cursor-pointer rounded-lg border-2 transition-all duration-200 p-4 bg-white hover:shadow-md ${
                            selectedProduct?.id === product.id 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-blue-400'
                          }`}
                        >
                          <div className="flex gap-4">
                            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              {product.image ? (
                                <ImagePreview
                                  src={`${import.meta.env.VITE_BASE_URL}${product.image}`}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold">{product.name}</h3>
                              {product.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center text-green-600 font-semibold">
                                  <DollarSign className="h-4 w-4" />
                                  {product.price}
                                </div>
                                <Badge variant={product.status === 'available' ? 'available' : 'unavailable'}>
                                  {product.status === 'available' ? t("Available") : t("Unavailable")}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {selectedProduct?.id === product.id && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>{t("No products found in this category")}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sale Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                {t("Sale Details")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedProduct ? (
                <>
                  {/* Selected Product Info */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 overflow-hidden rounded bg-gray-200">
                        {selectedProduct.image ? (
                          <ImagePreview
                            src={`${import.meta.env.VITE_BASE_URL}${selectedProduct.image}`}
                            alt={selectedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{selectedProduct.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedCategory?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("Quantity")}</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="text-center w-20"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Sale Price */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("Sale Price")}</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        value={salePrice}
                        onChange={handlePriceChange}
                        className="pl-9"
                        placeholder="0.00"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("Original price")}: OMR {selectedProduct.price}
                    </p>
                  </div>

                  {/* Total Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("Total Amount")}</label>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">{quantity} × OMR {salePrice}</span>
                        <span className="text-lg font-bold text-green-700">
                          OMR {totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSaleSubmit}
                    disabled={processing || !selectedProduct || quantity < 1 || salePrice <= 0}
                    className="w-full"
                  >
                    {processing ? (
                      <>
                        <Loader className="h-4 w-4 mr-2" />
                        {t("Processing...")}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {t("Complete Sale")}
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{t("Select a product to continue")}</p>
                  <p className="text-sm">{t("Choose a category and product above")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 