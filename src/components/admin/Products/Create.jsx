import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader, Plus } from "lucide-react";
import { handleError } from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import ShadcnSelect from "@/components/misc/Select";

function Create({ onSubmitSuccess }) {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const { t } = useTranslation();

  const statusOptions = [
    { value: 'available', label: t("Available") },
    { value: 'unavailable', label: t("Unavailable") }
  ];

  useEffect(() => {
    if (showDialog) {
      fetchCategories();
    }
  }, [showDialog]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await axiosClient.get('product_categories/all');
      const categoryOptions = response.data.data.map(category => ({
        value: category.id,
        label: category.name
      }));
      setCategories(categoryOptions);
    } catch (error) {
      handleError(error);
    } finally {
      setCategoriesLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      if (selectedStatus) {
        formData.append('status', selectedStatus.value);
      }
      if (selectedCategory) {
        formData.append('product_category_id', selectedCategory.value);
      }
      
      const response = await axiosClient.post("products/store", formData);
      toast.success(response.data.message);
      onSubmitSuccess?.();
      setShowDialog(false);
      setSelectedStatus(null);
      setSelectedCategory(null);
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
      setSelectedStatus(null);
      setSelectedCategory(null);
      setImagePreview(null);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="w-4 h-4" />
          <span>{t("Create Product")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Create Product")}</DialogTitle>
        </DialogHeader>

        <form id="create-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                {t("Product Name")} <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="off"
                placeholder={t("Enter product name")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                {t("Product Description")}
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder={t("Enter product description")}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="product_category_id" className="block text-sm font-medium">
                {t("Product Category")} <span className="text-red-500">*</span>
              </label>
              <ShadcnSelect
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categories}
                placeholder={t("Select Category")}
                isSearchable={true}
                isClearable
                isLoading={categoriesLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium">
                {t("Product Price")} <span className="text-red-500">*</span>
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                autoComplete="off"
                placeholder={t("Enter price")}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium">
                {t("Product Status")}
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
                {t("Product Image")}
              </label>
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