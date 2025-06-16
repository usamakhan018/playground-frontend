import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ExpenseForm from './ExpenseForm';
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { handleError } from "@/utils/helpers";

const Edit = ({ record, onSubmitSuccess, onClose }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const response = await axiosClient.post(`expenses/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
      onSubmitSuccess?.();
      onClose?.();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Edit Expense")}</DialogTitle>
        </DialogHeader>

        <ExpenseForm 
          initialData={record}
          onSubmit={handleSubmit} 
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default Edit;
