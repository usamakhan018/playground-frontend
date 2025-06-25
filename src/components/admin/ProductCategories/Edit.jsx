import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { handleError } from "@/utils/helpers";
import ShadcnSelect from "@/components/misc/Select";
import ImagePreview from "@/components/misc/ImagePreview";

function Edit({ onSubmitSuccess, record, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { t } = useTranslation();

  const statusOptions = [
    { value: 'available', label: t("Available") },
    { value: 'unavailable', label: t("Unavailable") }
  ];

  useEffect(() => {
    if (record?.status) {
      const statusOption = statusOptions.find(option => option.value === record.status);
      setSelectedStatus(statusOption);
    }
  }, [record, t]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      if (selectedStatus) {
        formData.append('status', selectedStatus.value);
      }
      
      const response = await axiosClient.post("product_categories/update", formData);
      toast.success(response.data.message);
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
          <DialogTitle>{t("Update Product Category")}</DialogTitle>
        </DialogHeader>

        <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                {t("Category Name")} <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={record.name}
                required
                autoComplete="off"
                placeholder={t("Enter category name")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                {t("Category Description")}
              </label>
              <Textarea
                id="description"
                name="description"
                defaultValue={record.description || ''}
                placeholder={t("Enter category description")}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium">
                {t("Category Status")}
              </label>
              <ShadcnSelect
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={statusOptions}
                placeholder={t("Select Status")}
                isSearchable={false}
                isClearable
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium">
                {t("Category Image")}
              </label>
              
              {record.image && (
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground mb-1">{t("Current Image:")}</p>
                  <ImagePreview
                    src={`${import.meta.env.VITE_BASE_URL}${record.image}`}
                    alt={record.name}
                    className="w-20 h-20 object-cover rounded border"
                  />
                </div>
              )}
              
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">{t("New Image Preview:")}</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded border"
                  />
                </div>
              )}
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