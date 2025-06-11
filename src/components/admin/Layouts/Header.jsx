import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ToggleTheme from "@/components/misc/ToggleTheme";
import SwitchLanguage from "@/components/misc/SwitchLanguage";
import NotificationDropdown from "@/components/misc/NotificationDropdown";
import { useLanguage } from "@/contexts/LanguageProvider";

function Header() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div>
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <div className="flex flex-row items-center gap-x-2 w-full flex-1">
          <SidebarTrigger />
          {language === "ar" ? (
            <ArrowRight className="h-5 w-5 cursor-pointer" onClick={() => navigate(-1)} />
          ) : (
            <ArrowLeft className="h-5 w-5 cursor-pointer" onClick={() => navigate(-1)} />
          )}
        </div>
        <div className="flex flex-row gap-x-4">
          <div className="w-full flex-1 self-center align-middle">
            <NotificationDropdown />
          </div>
          <div className="w-full flex-1 self-right align-right">
            <SwitchLanguage />
          </div>
          <div className="w-full flex-1 self-right align-right">
            <ToggleTheme />
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;