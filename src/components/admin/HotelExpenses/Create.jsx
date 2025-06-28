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
import { getExpenseCategories } from "@/stores/features/ajaxFeature";
import { useDispatch, useSelector } from "react-redux";
import Select from "@/components/misc/Select";

function Create({ onSubmitSuccess }) {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { expenseCategories } = useSelector((state) => state.ajax);

  useEffect(() => {
    if (showDialog) {
      fetchUsers();
      if (!expenseCategories) {
        dispatch(getExpenseCategories());
      }
    }
  }, [showDialog]);

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get("users/all");
      setUsers(response.data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const paymentMethods = [
    { value: 'cash', label: t('Cash') },
    { value: 'bank_transfer', label: t('Bank Transfer') },
    { value: 'credit_card', label: t('Credit Card') }
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      if (selectedUser) form.append('user_id', selectedUser.value);
      if (selectedCategory) form.append('expense_category_id', selectedCategory.value);
      if (selectedPaymentMethod) form.append('payment_method', selectedPaymentMethod.value);
      
      const response = await axiosClient.post("hotel_expenses/store", form);
      toast.success(response.data.message);
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
    setSelectedUser(null);
    setSelectedCategory(null);
    setSelectedPaymentMethod(null);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="w-4 h-4" />
          <span>{t("Create Hotel Expense")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("Create Hotel Expense")}</DialogTitle>
        </DialogHeader>

        <form id="create-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="user" className="block text-sm font-medium">
                {t("User")} *
              </label>
              <Select
                value={selectedUser}
                onChange={setSelectedUser}
                options={users?.map(user => ({ value: user.id, label: user.name }))}
                placeholder={t("Select User")}
                isClearable
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                {t("Expense Category")} *
              </label>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={expenseCategories?.map(category => ({ value: category.id, label: category.name }))}
                placeholder={t("Select Category")}
                isClearable
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium">
                {t("Amount")} *
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="payment_method" className="block text-sm font-medium">
                {t("Payment Method")}
              </label>
              <Select
                value={selectedPaymentMethod}
                onChange={setSelectedPaymentMethod}
                options={paymentMethods}
                placeholder={t("Select Payment Method")}
                isClearable
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium">
                {t("Description")}
              </label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="receipt" className="block text-sm font-medium">
                {t("Receipt")}
              </label>
              <Input
                id="receipt"
                name="receipt"
                type="file"
                accept="image/*,application/pdf"
                autoComplete="off"
              />
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