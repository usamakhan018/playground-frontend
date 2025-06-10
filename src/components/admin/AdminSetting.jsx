import axiosClient from "@/axios";

import { getSetting } from "@/stores/features/settingFeature";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "./Layouts/PageTitle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { handleError } from "@/utils/helpers";
import { getUser } from "@/stores/features/authFeature";

export default function AdminSetting() {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation()

  const user = useSelector(store => store.auth.user)

  useEffect(() => {
    if (!user) {
      dispatch(getUser())
    }
  }, []);

  const updateSetting = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const form = new FormData(e.currentTarget)
    try {
      const response = await axiosClient.post("settings/update", form)
      toast.success(response.data.message)
      dispatch(getSetting())
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageTitle title={t("Update Setting")} />
      <div className="shadow-md p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-2">{t("Update Setting")}</h2>
        <form onSubmit={updateSetting}>
          <div>
            <Label htmlFor="app_name">{t("App Name")}</Label>
            <Input
              type="text"
              id="app_name"
              name="app_name"
              defaultValue={user?.settings?.app_name}
            />
          </div>
          <div className="mt-3 mb-3">
            <Label htmlFor="email">{t("Email")}</Label>
            <Input
              type="text"
              id="email"
              name="email"
              defaultValue={user?.settings?.email}
            />
          </div>

          <div className="mt-3 mb-3">
            <Label htmlFor="logo">{t("Logo")}</Label>
            <Input name="logo" type="file" />
          </div>
          {/* <img className="w-[300px] rounded" src={baseURL + "/" + settings?.logo} alt="" /> */}
          <Button type="submit" className="mt-2 ml-2" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("Save Changes")
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
