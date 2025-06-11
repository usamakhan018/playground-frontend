import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "@/stores/features/authFeature";
import Header from "./Layouts/Header";
import Sidebar from "./Layouts/Sidebar";
import Loader from "../Loader";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { useLanguage } from "@/contexts/LanguageProvider";

export function AdminLayout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { language } = useLanguage();

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
  }, []);

  if (!user) {
    return <div className="flex justify-center items-center h-screen w-screen">
      <Loader />
    </div>
  }

  return (user &&
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <SidebarProvider>
        <Sidebar />
        <div className="flex flex-col w-full">
          <Header />
          <main className="w-full flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}