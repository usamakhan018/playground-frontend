import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  CircleUser,
  CogIcon,
  Home,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  User2Icon,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/stores/features/authFeature";
import { useAuthContext } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ToggleTheme from "@/components/misc/ToggleTheme";
import SwitchLanguage from "@/components/misc/SwitchLanguage";

function Header() {
  const dispatch = useDispatch()
  const context = useAuthContext()

  const handleLogout = () => {
    dispatch(logout(context))
  };

  const location = useLocation()

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "Companies",
      path: "/admin/companies",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      label: "Notifications",
      path: "/admin/notifications",
      icon: <Package className="h-5 w-5" />,
    },
    {
      label: "Setting",
      path: "/admin/setting",
      icon: <CogIcon className="h-5 w-5" />,
    },
    {
      label: "Profile",
      path: "/admin/profile",
      icon: <User2Icon className="h-5 w-5" />,
    },
  ];

  return (
    <div>
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                to={"dashboard"}
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="">Parcel Express</span>
              </Link>

              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${location.pathname === item.path
                    ? "bg-muted "
                    : "text-muted-foreground"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="w-full flex-1">
          <SidebarTrigger />
        </div>
        <div className="flex flex-row space-x-4">
          <div className="w-full flex-1 self-right align-right">
            <SwitchLanguage />
          </div>
          <div className="w-full flex-1 self-right align-right">
            <ToggleTheme />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="setting">
                <DropdownMenuItem>
                  {" "}
                  <CogIcon className="w-4 h-4 mr-1" />
                  Settings
                </DropdownMenuItem>
              </Link>{" "}
              <Link to="profile">
                <DropdownMenuItem>
                  <User2Icon className="w-4 h-4 mr-1" /> Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
}

export default Header;
