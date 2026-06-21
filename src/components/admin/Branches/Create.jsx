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
import { Loader, Plus } from "lucide-react";
import { handleError } from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import { getBranches } from "@/stores/features/ajaxFeature";
import { useDispatch } from "react-redux";
import { Textarea } from "@/components/ui/textarea";

function Create({ onSubmitSuccess }) {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch()
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      const response = await axiosClient.post("branches/store", form);
      toast.success(response.data.message);
      dispatch(getBranches())
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
          <span>{t("Create Branch")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Create Branch")}</DialogTitle>
        </DialogHeader>

        <form id="create-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                {t("Branch")}
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
              <label htmlFor="address" className="block text-sm font-medium">
                {t("Address")}
              </label>
              <Textarea
                id="address"
                name="address"
                type="text"
                required
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