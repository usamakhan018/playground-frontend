import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { handleError } from "@/utils/helpers";
import { useDispatch } from "react-redux";
import { getGames } from "@/stores/features/ajaxFeature";

function Edit({ onSubmitSuccess, record, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await axiosClient.post("games/update", formData);
      toast.success(response.data.message);
      
      // Update games in Redux store
      dispatch(getGames());
      
      onSubmitSuccess?.();
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Update Game")}</DialogTitle>
        </DialogHeader>

        <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                {t("Game Name")}
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={record.name}
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium">
                {t("Price")}
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={record.price}
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-medium">
                {t("Duration")}
              </label>
              <Input
                id="duration"
                name="duration"
                type="text"
                defaultValue={record.duration || ""}
                placeholder={t("e.g., 60 minutes")}
                autoComplete="off"
              />
            </div>

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
                
                {/* Show current image or preview */}
                <div className="mt-2">
                  {imagePreview ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t("New Image Preview:")}</p>
                      <img
                        src={imagePreview}
                        alt="New Preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  ) : record.image ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t("Current Image:")}</p>
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}${record.image}`}
                        alt={record.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("No image uploaded")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <input type="hidden" name="id" defaultValue={record.id} />
          
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
                t("Save Changes")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Edit; 