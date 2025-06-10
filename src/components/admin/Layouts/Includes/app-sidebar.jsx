import * as React from "react";
import {
    AudioWaveform,
    BookOpen,
    BookType,
    Bot,
    Box,
    BoxIcon,
    CarFront,
    Command,
    Currency,
    DoorOpen,
    GalleryVerticalEnd,
    Home,
    LifeBuoy,
    LucideCurrency,
    Map,
    MapIcon,
    Package,
    Package2,
    PieChart,
    Settings,
    Settings2,
    SortDesc,
    SquareTerminal,
    StopCircle,
    ToggleLeft,
    Truck,
    User,
    User2Icon,
    UserCheck,
    Users,
} from "lucide-react";


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { Link, Route, Routes } from "react-router-dom";
import { SiderBarHeader } from "./sidebar-header";
import { useSelector } from "react-redux";
import { can } from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import { SearchForm } from "./search-form";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }) {
    const user = useSelector((store) => store.auth.user);

    const { t } = useTranslation();

    const data = {
        headers: [
            {
                name: "Menu 1",
                logo: GalleryVerticalEnd,
                plan: "Enterprise",
            },
        ],
        navMain: [
            {
                label: "Main",
                icon: Home,
                items: [
                    {
                        label: t("Dashboard"),
                        path: "/dashboard",
                        icon: Home,
                        permission: can("Dashboard access"),
                    },

                    {
                        label: t("Roles"),
                        path: "/roles",
                        icon: UserCheck,
                        permission: can("Role access"),
                    },
                    {
                        label: t("Permissions"),
                        path: "/permissions",
                        icon: DoorOpen,
                        permission: can("Permission access"),
                    },
                    {
                        label: t("Settings"),
                        path: "/settings",
                        icon: Settings,
                        permission: can("Setting access"),
                    },
                    {
                        label: t("Profile"),
                        path: "/profile",
                        icon: User2Icon,
                        permission: can("Profile access"),
                    },
                ],
            },
            {
                label: t("User Management"),
                icon: Users,
                items: [
                    {
                        label: t("Users"),
                        path: "/users",
                        icon: Home,
                        permission: can("User access"),
                    },
                ],
            },
        ],
    };
    const [search, setSearch] = React.useState("");
    const filteredNavItems = data.navMain.filter((group) => {
        const filteredItems =
            group.items?.filter((item) => {
                const matchesSearch = item.label
                    ?.toLowerCase()
                    .includes(search.toLowerCase());
                const hasPermission = item.permission;
                return matchesSearch && hasPermission;
            }) || [];

        const groupMatches = group.label
            ?.toLowerCase()
            .includes(search.toLowerCase());
        group.items = filteredItems;
        return groupMatches || filteredItems.length > 0;
    });
    return (
        <Sidebar collapsible="icon" {...props} side="left">
            <SidebarHeader>
                <SiderBarHeader headers={data.headers} user={user} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    {/* <SidebarMenuButton asChild>
            <Link to="/dashboard">
              <Home />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton> */}
                    <SearchForm
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </SidebarGroup>

                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}