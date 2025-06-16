import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/misc/Select";
import DatePicker from "@/components/misc/DatePicker";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/axios";

const ExpenseForm = ({ initialData, onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: initialData || {},
  });

  // Fetch expense categories
  const { data: categories } = useQuery({
    queryKey: ["expense_categories"],
    queryFn: async () => {
      const response = await axiosClient.get("expense_categories");
      return response.data.data;
    },
    initialData: [],
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">{t("Amount")}</Label>
          <Input 
            id="amount" 
            type="number" 
            step="0.01"
            {...register("amount", { required: t("Amount is required") })}
          />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category_id">{t("Category")}</Label>
          <Select 
            name="category_id"
            control={control}
            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            rules={{ required: t("Category is required") }}
          />
          {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("Description")}</Label>
          <Input 
            id="description" 
            {...register("description", { required: t("Description is required") })}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">{t("Date")}</Label>
          <DatePicker 
            name="date"
            control={control}
            rules={{ required: t("Date is required") }}
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <DialogClose asChild>
          <Button variant="outline">{t("Cancel")}</Button>
        </DialogClose>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t("Saving...") : t("Save")}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
