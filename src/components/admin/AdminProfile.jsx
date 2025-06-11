import { useState } from "react";
import { Button } from "../ui/button";
import PageTitle from "./Layouts/PageTitle";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "react-hot-toast";
import axiosClient from "@/axios";
import { Loader2, Lock, Key, Shield, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { handleError } from "@/utils/helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function AdminProfile() {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(false);
  const [formRef, setFormRef] = useState(null);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = new FormData(e.currentTarget)
      const response = await axiosClient.post("settings/update_password", form);
      toast.success(response.data.message);
      e.target.reset()
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle title={t("Update Profile")} />

      <div className="grid grid-cols-12 lg:grid-cols-12 gap-6">
        {/* Main Password Update Card */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    {t("Security Settings")}
                  </CardTitle>
                  <CardDescription>
                    {t("Update your password to keep your account secure")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form ref={setFormRef} onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password" className="text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>{t("Current Password")}</span>
                      </div>
                    </Label>
                    <Input
                      type="password"
                      id="current_password"
                      name="current_password"
                      placeholder={t("Enter your current password")}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4" />
                          <span>{t("New Password")}</span>
                        </div>
                      </Label>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder={t("Enter new password")}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password_confirmation" className="text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4" />
                          <span>{t("Confirm New Password")}</span>
                        </div>
                      </Label>
                      <Input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        placeholder={t("Confirm new password")}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => formRef?.reset()}
                      className="px-6"
                    >
                      {t("Reset")}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="px-6"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          {t("Updating...")}
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          {t("Update Password")}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <Alert className="lg:col-span-4">
          <Info className="h-4 w-4" />
          <AlertTitle>{t("Password Security Tips")}</AlertTitle>
          <AlertDescription className="mt-2">
            <ul className="space-y-1 text-sm">
              <li>• {t("Use at least 8 characters")}</li>
              <li>• {t("Include uppercase and lowercase letters")}</li>
              <li>• {t("Add numbers and special characters")}</li>
              <li>• {t("Avoid using personal information")}</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Security Tips Sidebar */}
        {/* <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("Account Security")}</CardTitle>
              <CardDescription>
                {t("Monitor your account security")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t("Password Strength")}</p>
                  <p className="text-xs text-muted-foreground">{t("Last updated")}</p>
                </div>
                <div className="h-2 w-20 bg-secondary rounded-full">
                  <div className="h-2 w-16 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t("Two-Factor Auth")}</p>
                  <p className="text-xs text-muted-foreground">{t("Not enabled")}</p>
                </div>
                <Button variant="outline" size="sm">
                  {t("Enable")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("Recent Activity")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{t("Login from Chrome")}</span>
                  <span className="text-muted-foreground">{t("2 hours ago")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>{t("Password changed")}</span>
                  <span className="text-muted-foreground">{t("1 week ago")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>{t("Login from Mobile")}</span>
                  <span className="text-muted-foreground">{t("2 days ago")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
}
