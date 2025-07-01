import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import PageTitle from "./Layouts/PageTitle";
import Select from "../misc/Select";
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
  TrendingUp,
  ShoppingBag,
  Trash2,
  X,
  Camera,
  Upload,
  CreditCard,
  Banknote,
  FileText
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
  
  // Shopping cart state
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
  // Sale form state - for quick add
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Proof upload state
  const [proofImage, setProofImage] = useState(null);
  const [isCapturingProof, setIsCapturingProof] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  
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

  // Cleanup camera when payment method changes or component unmounts
  useEffect(() => {
    if (!['bank_transfer', 'credit_card'].includes(paymentMethod)) {
      stopCamera();
      setProofImage(null);
    }
  }, [paymentMethod]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Calculate cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.total_amount), 0).toFixed(2);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

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
      const response = await axiosClient.get('product-sales/today-stats');
      setTodayStats(response.data.data);
    } catch (error) {
      console.error('Error fetching today stats:', error);
      // Set default stats on error
      setTodayStats({
        total_sales: 0,
        total_revenue: 0,
        total_products_sold: 0
      });
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedProduct(null);
    setQuantity(1);
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

  const addToCart = () => {
    if (!selectedProduct || quantity < 1) {
      toast.error(t("Please select a product and enter valid quantity"));
      return;
    }

    const existingItemIndex = cartItems.findIndex(item => item.product_id === selectedProduct.id);
    const itemTotal = (parseFloat(selectedProduct.price) * quantity).toFixed(2);

    if (existingItemIndex !== -1) {
      // Update existing item
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      updatedCart[existingItemIndex].total_amount = (parseFloat(selectedProduct.price) * updatedCart[existingItemIndex].quantity).toFixed(2);
      setCartItems(updatedCart);
    } else {
      // Add new item
      const newItem = {
        product_id: selectedProduct.id,
        product: selectedProduct,
        quantity: quantity,
        price: selectedProduct.price,
        total_amount: itemTotal
      };
      setCartItems([...cartItems, newItem]);
    }

    // Reset product selection
    setSelectedProduct(null);
    setQuantity(1);
    toast.success(t("Item added to cart"));
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.product_id !== productId));
    toast.success(t("Item removed from cart"));
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cartItems.map(item => {
      if (item.product_id === productId) {
        return {
          ...item,
          quantity: newQuantity,
          total_amount: (parseFloat(item.price) * newQuantity).toFixed(2)
        };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success(t("Cart cleared"));
  };

  // Camera and proof upload functionality
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturingProof(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error(t("Camera access denied"));
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      // Convert to blob for upload
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setProofImage(file);
        stopCamera();
        toast.success(t("Image captured successfully"));
      }, 'image/jpeg', 0.8);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturingProof(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setProofImage(file);
      toast.success(t("Image uploaded successfully"));
    }
  };

  const handleSaleSubmit = async () => {
    if (cartItems.length === 0) {
      toast.error(t("Please add items to cart before completing sale"));
      return;
    }

    // Validate proof image for bank transfer and credit card
    if (['bank_transfer', 'credit_card'].includes(paymentMethod) && !proofImage) {
      toast.error(t("Proof image is required for this payment method"));
      return;
    }

    setProcessing(true);
    try {
      let response;

      if (proofImage) {
        // Use FormData when we have a proof image
        const formData = new FormData();
        
        // Append items array in FormData format that Laravel can understand
        cartItems.forEach((item, index) => {
          formData.append(`items[${index}][product_id]`, item.product_id);
          formData.append(`items[${index}][quantity]`, item.quantity);
          formData.append(`items[${index}][price]`, item.price);
          formData.append(`items[${index}][total_amount]`, item.total_amount);
        });
        
        formData.append('payment_method', paymentMethod);
        formData.append('proof', proofImage);

        response = await axiosClient.post('product-sales/store', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Use regular JSON when no proof image
        response = await axiosClient.post('product-sales/store', {
        items: cartItems,
        payment_method: paymentMethod
      });
      }
      
      toast.success(response.data.message);
      
      // Reset cart and form
      setCartItems([]);
      setSelectedProduct(null);
      setQuantity(1);
      setPaymentMethod('cash');
      setProofImage(null);
      
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
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              {t("Cart")}
            </Button>
            {cartItems.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </div>
            )}
          </div>
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
            <CardTitle className="text-sm font-medium">{t("Average Product Revenue")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.average_product_revenue || 0}</div>
            <p className="text-xs text-muted-foreground">{t("Average product revenue")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Revenue")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              OMR {parseFloat(todayStats.total_product_revenue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{t("Total revenue")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Products Sold")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayStats.total_product_sales || 0}</div>
            <p className="text-xs text-muted-foreground">{t("Total products sold")}</p>
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
                          <div className="absolute top-2 right-2 flex gap-1">
                            {selectedProduct?.id === product.id && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(product);
                                setQuantity(1);
                                addToCart();
                              }}
                              className="text-xs p-1 h-6"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
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

        {/* Shopping Cart */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  {t("Shopping Cart")}
                </CardTitle>
                {cartItems.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.length > 0 ? (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.product_id} className="p-3 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 overflow-hidden rounded bg-gray-200 flex-shrink-0">
                            {item.product.image ? (
                              <ImagePreview
                                src={`${import.meta.env.VITE_BASE_URL}${item.product.image}`}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              OMR {item.price} each
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateCartItemQuantity(item.product_id, item.quantity - 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateCartItemQuantity(item.product_id, item.quantity + 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-green-600">
                                  OMR {item.total_amount}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFromCart(item.product_id)}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Add Selected Product */}
                  {selectedProduct && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 overflow-hidden rounded bg-gray-200">
                          {selectedProduct.image ? (
                            <ImagePreview
                              src={`${import.meta.env.VITE_BASE_URL}${selectedProduct.image}`}
                              alt={selectedProduct.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-4 w-4 text-gray-400 m-2" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium truncate">{selectedProduct.name}</h5>
                          <p className="text-xs text-muted-foreground">OMR {selectedProduct.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(quantity - 1)}
                              disabled={quantity <= 1}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-6 text-center">{quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(quantity + 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            onClick={addToCart}
                            className="text-xs"
                          >
                            {t("Add")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("Payment Method")}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { value: 'cash', label: t("Cash"), icon: Banknote },
                        { value: 'credit_card', label: t("Credit Card"), icon: CreditCard },
                        { value: 'bank_transfer', label: t("Bank Transfer"), icon: FileText },
                      ].map((method) => {
                        const IconComponent = method.icon;
                        return (
                          <button
                            key={method.value}
                            type="button"
                            className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                              paymentMethod === method.value 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'border-input hover:bg-accent'
                            }`}
                            onClick={() => setPaymentMethod(method.value)}
                          >
                            <IconComponent className="h-4 w-4 mr-2" />
                            {method.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Proof Upload for Bank Transfer & Credit Card */}
                  {['bank_transfer', 'credit_card'].includes(paymentMethod) && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("Payment Proof")} *</label>
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={startCamera}
                          className="flex-1"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          {t("Take Photo")}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {t("Upload File")}
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {proofImage && (
                        <p className="text-sm text-green-600">
                          ✓ {t("Image ready")}: {proofImage.name}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Camera View */}
                  {isCapturingProof && (
                    <div className="space-y-2">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-48 bg-black rounded-lg"
                      />
                      <div className="flex gap-2">
                        <Button type="button" onClick={captureImage} className="flex-1">
                          {t("Capture")}
                        </Button>
                        <Button type="button" variant="outline" onClick={stopCamera}>
                          {t("Cancel")}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Cart Summary */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>{t("Total Items")}:</span>
                      <span className="font-medium">{getCartItemsCount()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t("Total Amount")}:</span>
                      <span className="text-green-600">OMR {getCartTotal()}</span>
                    </div>
                  </div>

                  {/* Complete Sale Button */}
                  <Button
                    onClick={handleSaleSubmit}
                    disabled={processing || cartItems.length === 0}
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
                        {t("Complete Sale")} - OMR {getCartTotal()}
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{t("Your cart is empty")}</p>
                  <p className="text-sm">{t("Add products to your cart to continue")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}; 