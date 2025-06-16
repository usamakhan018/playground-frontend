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
import ExpenseForm from "./ExpenseForm";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Plus } from "lucide-react";
import { handleError } from "@/utils/helpers";
import { useTranslation } from "react-i18next";

const ExpenseCreatePage = () => {
  const { t } = useTranslation();

  const handleSubmitSuccess = () => {
    console.log('Expense created successfully');
    // API integration will be added here
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('expenses.create')}</h1>
      <Create onSubmitSuccess={handleSubmitSuccess} />
    </div>
  );
};

function Create({ onSubmitSuccess }) {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const response = await axiosClient.post("expenses", formData);
      toast.success(response.data.message);
      onSubmitSuccess?.();
      setShowDialog(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="w-4 h-4" />
          <span>{t("Create Expense")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Create Expense")}</DialogTitle>
        </DialogHeader>
        
        <ExpenseForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ExpenseCreatePage;
