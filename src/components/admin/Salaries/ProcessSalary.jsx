import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProcessSalaryForm from "./ProcessSalaryForm";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Plus } from "lucide-react";
import { handleError } from "@/utils/helpers";
import { useTranslation } from "react-i18next";

function ProcessSalary({ onSubmitSuccess }) {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const response = await axiosClient.post("salaries/process", formData);
      toast.success(response.data.message);
      onSubmitSuccess?.();
      setShowDialog(false);
      
      // Open salary slip in new window
      if (response.data.data?.slip_url) {
        window.open(response.data.data.slip_url, '_blank');
      }
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
          <span>{t("Process Salary")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Process Salary")}</DialogTitle>
        </DialogHeader>
        
        <ProcessSalaryForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ProcessSalary; 