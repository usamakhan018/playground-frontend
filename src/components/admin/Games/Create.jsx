import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from "@/components/misc/Select";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader, Plus, Upload, X, DollarSign, Clock, Banknote } from "lucide-react";
import { handleError } from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getGames } from "@/stores/features/ajaxFeature";

function Create({ onSubmitSuccess }) {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [gameType, setGameType] = useState('unlimited');
  const [pricings, setPricings] = useState([]);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const gameTypeOptions = [
    { value: 'unlimited', label: t("Unlimited Duration") },
    { value: 'limited', label: t("Limited Duration") }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGameTypeChange = (selectedOption) => {
    setGameType(selectedOption.value);
    if (selectedOption.value === 'unlimited') {
      setPricings([]);
    } else {
      // Initialize with one pricing option for limited games
      if (pricings.length === 0) {
        setPricings([{ duration: '', price: '' }]);
      }
    }
  };

  const addPricing = () => {
    setPricings([...pricings, { duration: '', price: '' }]);
  };

  const removePricing = (index) => {
    const newPricings = pricings.filter((_, i) => i !== index);
    setPricings(newPricings);
  };

  const updatePricing = (index, field, value) => {
    const newPricings = [...pricings];
    newPricings[index][field] = value;
    setPricings(newPricings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Add game type
      formData.append('type', gameType);

      // For limited games, validate and add pricings
      if (gameType === 'limited') {
        const validPricings = pricings.filter(p => p.duration && p.price);
        if (validPricings.length === 0) {
          toast.error(t("Please add at least one pricing option for limited duration games"));
          setIsLoading(false);
          return;
        }

        // Add pricings to form data
        validPricings.forEach((pricing, index) => {
          formData.append(`pricings[${index}][duration]`, pricing.duration);
          formData.append(`pricings[${index}][price]`, pricing.price);
        });
      }

      const response = await axiosClient.post("games/store", formData);
      toast.success(response.data.message);

      // Update games in Redux store
      dispatch(getGames());

      onSubmitSuccess?.();
      setShowDialog(false);
      resetForm();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setImagePreview(null);
    setGameType('unlimited');
    setPricings([]);
  };

  const handleDialogChange = (open) => {
    setShowDialog(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="w-4 h-4" />
          <span>{t("Create Game")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Create Game")}</DialogTitle>
        </DialogHeader>

        <form id="create-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                {t("Game Name")}
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-medium">
                {t("Game Type")}
              </label>
              <Select
                placeholder={t("Select game type")}
                value={gameTypeOptions.find(option => option.value === gameType)}
                onChange={handleGameTypeChange}
                options={gameTypeOptions}
              />
            </div>
            {gameType === 'unlimited' && (  
              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium">
                  {gameType === 'unlimited' ? t("Price") : t("Base Price (Optional)")}
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required={gameType === 'unlimited'}
                  autoComplete="off"
                />
                {gameType === 'limited' && (
                  <p className="text-xs text-muted-foreground">
                    {t("This will be used as fallback price. Main pricing comes from duration options below.")}
                  </p>
                )}
              </div>
            )}

            {/* {gameType === 'unlimited' && (
              <div className="space-y-2">
                <label htmlFor="duration" className="block text-sm font-medium">
                  {t("Duration")}
                </label>
                <Input
                  id="duration"
                  name="duration"
                  type="text"
                  placeholder={t("e.g., 60 minutes")}
                  autoComplete="off"
                />
              </div>
            )} */}

            {gameType === 'limited' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">
                    {t("Duration & Pricing Options")}
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPricing}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    {t("Add Pricing")}
                  </Button>
                </div>

                {pricings.length === 0 && (
                  <div className="text-center py-4 border-2 border-dashed border-muted rounded-lg">
                    <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t("No pricing options added yet")}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addPricing}
                      className="mt-2"
                    >
                      {t("Add your first pricing option")}
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  {pricings.map((pricing, index) => (
                    <div key={index} className="flex gap-2 items-center p-3 border rounded-lg">
                      <div className="flex-1">
                        <Input
                          placeholder={t("Duration (e.g., 5 minutes)")}
                          value={pricing.duration}
                          onChange={(e) => updatePricing(index, 'duration', e.target.value)}
                          className="mb-2"
                        />
                        <div className="relative">
                          <Banknote className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder={t("Price")}
                            value={pricing.price}
                            onChange={(e) => updatePricing(index, 'price', e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      {pricings.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePricing(index)}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium">
                {t("Game Image")}
              </label>
              <div className="flex flex-col gap-2">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t("Close")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                t("Create")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Create; 