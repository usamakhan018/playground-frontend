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
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader, Plus, Upload } from "lucide-react";
import { handleError } from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getGames } from "@/stores/features/ajaxFeature";

function Create({ onSubmitSuccess }) {
  const [showDialog, setShowDialog] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      const response = await axiosClient.post("games/store", form);
      toast.success(response.data.message);
      
      // Update games in Redux store
      dispatch(getGames());
      
      onSubmitSuccess?.();
      setShowDialog(false);
      setImagePreview(null);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogChange = (open) => {
    setShowDialog(open);
    if (!open) {
      setImagePreview(null);
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

      <DialogContent className="max-w-md">
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
              <label htmlFor="price" className="block text-sm font-medium">
                {t("Price")}
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
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