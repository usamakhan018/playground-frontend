import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { handleError } from "@/utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseCategories } from "@/stores/features/ajaxFeature";
import Select from "@/components/misc/Select";

function Edit({ onSubmitSuccess, record, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { expenseCategories } = useSelector((state) => state.ajax);

  const paymentMethods = [
    { value: 'cash', label: t('Cash') },
    { value: 'bank_transfer', label: t('Bank Transfer') },
    { value: 'credit_card', label: t('Credit Card') }
  ];

  useEffect(() => {
    fetchUsers();
    if (expenseCategories.length === 0) {
      dispatch(getExpenseCategories());
    }
    
    // Set initial values
    if (record) {
      if (record.user) {
        setSelectedUser({ value: record.user.id, label: record.user.name });
      }
      if (record.expense_category) {
        setSelectedCategory({ value: record.expense_category.id, label: record.expense_category.name });
      }
      if (record.payment_method) {
        setSelectedPaymentMethod({ value: record.payment_method, label: paymentMethods.find(p => p.value === record.payment_method)?.label });
      }
    }
  }, [record]);

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get("users/all");
      setUsers(response.data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      if (selectedUser) formData.append('user_id', selectedUser.value);
      if (selectedCategory) formData.append('expense_category_id', selectedCategory.value);
      if (selectedPaymentMethod) formData.append('payment_method', selectedPaymentMethod.value);
      
      const response = await axiosClient.post("hotel_expenses/update", formData);
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("Update Hotel Expense")}</DialogTitle>
        </DialogHeader>

        <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
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
                defaultValue={record?.amount}
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
                defaultValue={record?.description}
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
              {record?.receipt && (
                <p className="text-sm text-muted-foreground">
                  {t("Current file")}: {record.receipt.split('/').pop()}
                </p>
              )}
            </div>
          </div>
          
          <input type="hidden" name="id" defaultValue={record?.id} />
          
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