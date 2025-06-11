import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { handleError } from "@/utils/helpers";
import Select from "@/components/misc/Select"
import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "@/stores/features/ajaxFeature";
import { useParams } from "react-router-dom";

function Edit({ onSubmitSuccess, record, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(false);
  const [roleValue, setRoleValue] = useState([{ label: record?.roles[0]?.name, value: record?.roles[0]?.id }]);
  const dispatch = useDispatch();
  const params = useParams();
  const { t } = useTranslation();
  const roles = useSelector(store => store.ajax.roles)
console.log(record)
  useEffect(() => {
    if (!roles) dispatch(getRoles())
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await axiosClient.post("users/update", formData);
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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("Update Room Type")}</DialogTitle>
        </DialogHeader>

        <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label htmlFor="name">{t("Name")}</label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={record?.name}
              />
            </div>
            <div>
              <label htmlFor="email">{t("Email")}</label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={record?.email}
              />
            </div>
            <div>
              <label htmlFor="role">{t("Role")}</label>
              <Select
                name="role"
                options={roles?.map(role => ({ value: role.id, label: role.name }))}
                value={roleValue}
                onChange={e => setRoleValue(e)}
              />
            </div>
          </div>
          <input type="hidden" name="id" value={record.id} />
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