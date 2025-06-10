import { useState } from "react";
import { Button } from "../ui/button";
import PageTitle from "./Layouts/PageTitle";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "react-hot-toast";
import axiosClient from "@/axios";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { handleError } from "@/utils/helpers";

export default function AdminProfile() {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = new FormData(e.currentTarget)
      const response = await axiosClient.post("settings/update_password", form);
      console.log(response)
      toast.success(response.data.message);
      // e.currentTarget.reset()
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={t("Update Profile")} />
      <div className="shadow-md p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-2">{t("Update Password")}</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div>
            <Label htmlFor="current_password">{t("Current Password")}</Label>
            <Input
              type="text"
              id="current_password"
              name="current_password"
            />
          </div>
          <div className="mt-3 mb-3">
            <Label htmlFor="password">{t("New Password")}</Label>
            <Input
              type="text"
              id="password"
              name="password"
            />
          </div>

          <div className="mt-3 mb-3">
            <Label htmlFor="password_confirmation">{t("Confirm New Password")}</Label>
            <Input
              type="password_confirmation"
              id="new_password"
              name="password_confirmation"
            />
          </div>

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
