import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Select from "@/components/misc/Select";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { handleError } from "@/utils/helpers";
import { Play, Camera, Upload, CreditCard, Banknote, FileText } from "lucide-react";
import Loader from "@/components/Loader";

const StartGameDialog = ({ open, onOpenChange, onSaleCreated }) => {
  const { t } = useTranslation();
  
  // Redux state
  const games = useSelector((state) => state.ajax.games);
  const gameAssets = useSelector((state) => state.ajax.gameAssets);
  
  // Form state
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGameAsset, setSelectedGameAsset] = useState(null);
  const [selectedGamePricing, setSelectedGamePricing] = useState(null);
  const [availableGameAssets, setAvailableGameAssets] = useState([]);
  const [gamePricings, setGamePricings] = useState([]);
  const [assetBarcode, setAssetBarcode] = useState('');
  const [ticketBarcode, setTicketBarcode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [proofImage, setProofImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Camera/Scanner state
  const [isScanningAsset, setIsScanningAsset] = useState(false);
  const [isScanningTicket, setIsScanningTicket] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      resetForm();
      stopCamera();
    }
  }, [open]);

  const resetForm = () => {
    setSelectedGame(null);
    setSelectedGameAsset(null);
    setSelectedGamePricing(null);
    setAvailableGameAssets([]);
    setGamePricings([]);
    setAssetBarcode('');
    setTicketBarcode('');
    setPaymentMethod('cash');
    setProofImage(null);
    setIsScanningAsset(false);
    setIsScanningTicket(false);
  };

  const handleGameSelect = async (selectedOption) => {
    if (selectedOption && games) {
      const game = games.find(g => g.id === parseInt(selectedOption.value));
      setSelectedGame(game);
      setSelectedGameAsset(null);
      setSelectedGamePricing(null);
      setAssetBarcode('');
      setTicketBarcode('');
      
      // Filter available assets for this game
      const gameSpecificAssets = gameAssets?.filter(asset => asset.game_id === parseInt(selectedOption.value)) || [];
      setAvailableGameAssets(gameSpecificAssets);
      
      // If it's a limited game, fetch pricing options
      if (game.type === 'limited') {
        try {
          const response = await axiosClient.get(`/sales/game-pricings/${game.id}`);
          setGamePricings(response.data.data);
        } catch (error) {
          console.error('Error fetching game pricings:', error);
          setGamePricings([]);
        }
      }
    } else {
      resetForm();
    }
  };

  const handleAssetBarcodeChange = (value) => {
    setAssetBarcode(value);
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // If value is empty, clear selected asset
    if (!value.trim()) {
      setSelectedGameAsset(null);
      return;
    }
    
    // Try to find matching asset from available assets first (for quick local lookup)
    const matchingAsset = availableGameAssets.find(asset => asset.barcode === value);
    if (matchingAsset) {
      setSelectedGameAsset(matchingAsset);
      return;
    }
    
    // Debounce API call for barcode lookup (in case they're still typing)
    debounceTimeoutRef.current = setTimeout(() => {
      if (value.trim().length >= 3) { // Only search if barcode is at least 3 characters
        scanAssetBarcodeAuto(value.trim());
      }
    }, 800); // 800ms delay
  };
  
  const handleAssetBarcodeKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (assetBarcode.trim()) {
        scanAssetBarcodeAuto(assetBarcode.trim());
      }
    }
  };
  
  const handleAssetBarcodeBlur = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    if (assetBarcode.trim() && !selectedGameAsset) {
      scanAssetBarcodeAuto(assetBarcode.trim());
    }
  };

  const scanAssetBarcodeAuto = async (barcode) => {
    console.log('Auto-scanning asset barcode:', barcode);

    try {
      setLoading(true);
      const response = await axiosClient.post('/sales/get-asset-by-barcode', {
        barcode: barcode
      });
      
      console.log('Asset API response:', response.data);
      
      const asset = response.data.data;
      setSelectedGameAsset(asset);
      
      console.log('Set selectedGameAsset to:', asset);
      
      // Auto-select the game if not already selected
      if (!selectedGame && asset.game) {
        setSelectedGame(asset.game);
        console.log('Auto-selected game:', asset.game);
        if (asset.game.type === 'limited') {
          setGamePricings(asset.game.pricings || []);
        }
      }
      
      toast.success(t("Asset found successfully"));
    } catch (error) {
      console.error('Error scanning asset:', error);
      // Don't show error toast for auto-scan, only for manual scan
      setSelectedGameAsset(null);
    } finally {
      setLoading(false);
    }
  };

  const scanAssetBarcode = async () => {
    if (!assetBarcode.trim()) {
      toast.error(t("Please enter asset barcode"));
      return;
    }

    console.log('Manual scanning asset barcode:', assetBarcode);

    try {
      setLoading(true);
      const response = await axiosClient.post('/sales/get-asset-by-barcode', {
        barcode: assetBarcode
      });
      
      console.log('Asset API response:', response.data);
      
      const asset = response.data.data;
      setSelectedGameAsset(asset);
      
      console.log('Set selectedGameAsset to:', asset);
      
      // Auto-select the game if not already selected
      if (!selectedGame && asset.game) {
        setSelectedGame(asset.game);
        console.log('Auto-selected game:', asset.game);
        if (asset.game.type === 'limited') {
          setGamePricings(asset.game.pricings || []);
        }
      }
      
      toast.success(t("Asset found successfully"));
    } catch (error) {
      console.error('Error scanning asset:', error);
      handleError(error);
      setSelectedGameAsset(null);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async (mode) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        if (mode === 'asset') {
          setIsScanningAsset(true);
        } else if (mode === 'ticket') {
          setIsScanningTicket(true);
        }
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
    setIsScanningAsset(false);
    setIsScanningTicket(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setProofImage(file);
      toast.success(t("Image uploaded successfully"));
    }
  };

  const calculateTotalAmount = () => {
    if (!selectedGame) return 0;
    
    if (selectedGame.type === 'limited' && selectedGamePricing) {
      return selectedGamePricing.price;
    } else if (selectedGame.type === 'unlimited') {
      return selectedGame.price;
    }
    
    return 0;
  };

  const handleCreateSale = async (e) => {
    e.preventDefault();
    
    // Debug logging
    console.log('Creating sale with:', {
      selectedGame,
      selectedGameAsset,
      selectedGamePricing,
      ticketBarcode,
      paymentMethod,
      proofImage
    });
    
    // Validation
    if (!selectedGame) {
      toast.error(t("Please select a game"));
      return;
    }
    
    if (!selectedGameAsset) {
      toast.error(t("Please select or scan an asset"));
      return;
    }

    if (selectedGame.type === 'limited' && !selectedGamePricing) {
      toast.error(t("Please select pricing for limited duration game"));
      return;
    }

    if (selectedGame.type === 'unlimited' && !ticketBarcode.trim()) {
      toast.error(t("Please enter ticket barcode for unlimited game"));
      return;
    }

    if (['bank_transfer', 'credit_card'].includes(paymentMethod) && !proofImage) {
      toast.error(t("Proof image is required for this payment method"));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('game_id', selectedGame.id);
      formData.append('game_asset_id', selectedGameAsset.id);
      formData.append('payment_method', paymentMethod);
      
      if (selectedGame.type === 'limited') {
        formData.append('game_pricing_id', selectedGamePricing.id);
      } else {
        formData.append('ticket_barcode', ticketBarcode.trim());
      }
      
      if (proofImage) {
        formData.append('proof', proofImage);
      }

      const response = await axiosClient.post('/sales/create-sale', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message);
      
      // Reset form and close dialog
      resetForm();
      onOpenChange(false);
      
      // Notify parent component
      if (onSaleCreated) {
        onSaleCreated();
      }
      
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: 'cash', label: t("Cash"), icon: Banknote },
    { value: 'credit_card', label: t("Credit Card"), icon: CreditCard },
    { value: 'bank_transfer', label: t("Bank Transfer"), icon: FileText },
  ];

  const isProofRequired = ['bank_transfer', 'credit_card'].includes(paymentMethod);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Play className="h-5 w-5 mr-2" />
            {t("Create New Sale")}
          </DialogTitle>
          <DialogDescription>
            {t("Create a sale for limited or unlimited duration games with payment processing.")}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleCreateSale} className="space-y-4">
          {/* Game Selection */}
          <div className="space-y-2">
            <Label htmlFor="game">{t("Select Game")}</Label>
            <Select
              placeholder={t("Choose a game")}
              value={selectedGame ? {
                value: selectedGame.id,
                label: selectedGame.type === 'limited' 
                  ? `${selectedGame.name} - ${t('Limited')}` 
                  : `${selectedGame.name} - ${t('Unlimited')} - $${selectedGame.price}`
              } : null}
              onChange={handleGameSelect}
              options={games ? games.map(game => ({
                value: game.id,
                label: game.type === 'limited' 
                  ? `${game.name} - ${t('Limited')}` 
                  : `${game.name} - ${t('Unlimited')} - $${game.price}`
              })) : []}
              isClearable
            />
          </div>

          {/* Asset Selection for Limited Games - Barcode Scanning */}
          {selectedGame && selectedGame.type === 'limited' && (
            <div className="space-y-2">
              <Label htmlFor="assetBarcode">{t("Asset Barcode")}</Label>
              <div className="flex gap-2">
                <Input
                  id="assetBarcode"
                  placeholder={t("Scan or enter asset barcode")}
                  value={assetBarcode}
                  onChange={(e) => handleAssetBarcodeChange(e.target.value)}
                  onKeyPress={handleAssetBarcodeKeyPress}
                  onBlur={handleAssetBarcodeBlur}
                  required
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={scanAssetBarcode}
                  disabled={loading || !assetBarcode.trim()}
                >
                  {loading ? <Loader className="h-4 w-4" /> : t("Scan")}
                </Button>
              </div>
              {assetBarcode && !selectedGameAsset && !loading && (
                <p className="text-sm text-muted-foreground">
                  {t("Type barcode and press Enter, or click Scan button")}
                </p>
              )}
            </div>
          )}

          {/* Asset Selection for Unlimited Games - Dropdown */}
          {selectedGame && selectedGame.type === 'unlimited' && (
            <div className="space-y-2">
              <Label htmlFor="asset">{t("Select Asset")}</Label>
              <Select
                placeholder={t("Choose an asset")}
                value={selectedGameAsset ? {
                  value: selectedGameAsset.id,
                  label: `${selectedGameAsset.name} - ${selectedGameAsset.barcode}`
                } : null}
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    const asset = availableGameAssets.find(a => a.id === parseInt(selectedOption.value));
                    setSelectedGameAsset(asset);
                  } else {
                    setSelectedGameAsset(null);
                  }
                }}
                options={availableGameAssets.map(asset => ({
                  value: asset.id,
                  label: `${asset.name} - ${asset.barcode}`
                }))}
                isClearable
                required
              />
            </div>
          )}

          {/* Selected Asset Display */}
          {selectedGameAsset && (
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium text-sm">{t("Selected Asset")}</h4>
              <p className="text-sm">{selectedGameAsset.name} - {selectedGameAsset.barcode}</p>
            </div>
          )}

          {/* Game Type Specific Fields */}
          {selectedGame && selectedGame.type === 'limited' && (
            <div className="space-y-2">
              <Label htmlFor="pricing">{t("Select Duration & Price")}</Label>
              <Select
                placeholder={t("Choose pricing")}
                value={selectedGamePricing ? {
                  value: selectedGamePricing.id,
                  label: `${selectedGamePricing.duration} - $${selectedGamePricing.price}`
                } : null}
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    const pricing = gamePricings.find(p => p.id === parseInt(selectedOption.value));
                    setSelectedGamePricing(pricing);
                  } else {
                    setSelectedGamePricing(null);
                  }
                }}
                options={gamePricings.map(pricing => ({
                  value: pricing.id,
                  label: `${pricing.duration} - $${pricing.price}`
                }))}
                isClearable
              />
            </div>
          )}

          {selectedGame && selectedGame.type === 'unlimited' && (
            <div className="space-y-2">
              <Label htmlFor="ticketBarcode">{t("Ticket Barcode")}</Label>
              <div className="flex gap-2">
                <Input
                  id="ticketBarcode"
                  placeholder={t("Scan or enter ticket barcode")}
                  value={ticketBarcode}
                  onChange={(e) => setTicketBarcode(e.target.value)}
                  required
                />
                {/* <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => startCamera('ticket')}
                  disabled={isScanningTicket}
                >
                  <Camera className="h-4 w-4" />
                </Button> */}
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">{t("Payment Method")}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {paymentMethods.map((method) => {
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
          {isProofRequired && (
            <div className="space-y-2">
              <Label>{t("Payment Proof")} *</Label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => startCamera('proof')}
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
          {(isScanningAsset || isScanningTicket) && (
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

          {/* Total Amount Display */}
          {selectedGame && (
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{t("Total Amount")}:</span>
                <span className="text-xl font-bold">${calculateTotalAmount()}</span>
              </div>
              {selectedGame.type === 'limited' && selectedGamePricing && (
                <p className="text-sm text-muted-foreground">
                  {selectedGamePricing.duration} - {selectedGame.name}
                </p>
              )}
              {selectedGame.type === 'unlimited' && (
                <p className="text-sm text-muted-foreground">
                  {t("Unlimited Duration")} - {selectedGame.name}
                </p>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t("Cancel")}
            </Button>
            <Button 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 mr-2" />
                  {t("Creating...")}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {t("Create Sale")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default StartGameDialog; 