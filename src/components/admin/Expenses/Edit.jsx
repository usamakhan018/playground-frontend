import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ExpenseForm from './ExpenseForm';
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { handleError } from "@/utils/helpers";

const ExpenseEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch expense data by ID and pass to form
  const fetchExpenseData = async () => {
    try {
      const response = await axiosClient.get(`expenses/${id}`);
      setRecord(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  React.useEffect(() => {
    fetchExpenseData();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const response = await axiosClient.put(`expenses/${record.id}`, formData);
      toast.success(response.data.message);
      // onSubmitSuccess?.();
      // onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!record) return null;

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("expenses.edit")}</DialogTitle>
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

export default ExpenseEdit;
