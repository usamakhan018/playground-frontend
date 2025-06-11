import React, { useEffect, useState } from "react";
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
import Select from "@/components/misc/Select"
import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "@/stores/features/ajaxFeature";
function Create({ onSubmitSuccess }) {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch()

  const roles = useSelector(store => store.ajax.roles)

  useEffect(() => {
    if (!roles) dispatch(getRoles())
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      const response = await axiosClient.post("users/store", form);
      toast.success(response.data.message);
      dispatch(getRoles())
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
          <span>{t("Create User")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("Create User")}</DialogTitle>
        </DialogHeader>

        <form id="create-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label htmlFor="name">{t("Name")}</label>
              <Input
                id="name"
                name="name"
                type="text"
              />
            </div>
            <div>
              <label htmlFor="phone">{t("Phone")}</label>
              <Input
                id="phone"
                name="phone"
                type="phone"
              />
            </div>
            <div>
              <label htmlFor="email">{t("Email")}</label>
              <Input
                id="email"
                name="email"
                type="email"
              />
            </div>
            <div>
              <label htmlFor="password">{t("Password")}</label>
              <Input
                id="password"
                name="password"
                type="text"
              />
            </div>
            <div>
              <label htmlFor="role">{t("Role")}</label>
              <Select
                name="role"
                options={roles?.map(role => ({ value: role.id, label: role.name }))}
                className="basic-multi-select"
                classNamePrefix="select"
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