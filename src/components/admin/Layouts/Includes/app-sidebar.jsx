import * as React from "react";
import {
    BarChart,
    Bell,
    BookImageIcon,
    Building,
    DoorOpen,
    GalleryVerticalEnd,
    Gamepad2,
    Home,
    HomeIcon,
    Settings,
    User2Icon,
    UserCheck,
    Users,
    Wrench,
} from "lucide-react";


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { SiderBarHeader } from "./sidebar-header";
import { useSelector } from "react-redux";
import { can, hasRole } from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import { SearchForm } from "./search-form";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useLanguage } from "@/contexts/LanguageProvider";

export function AppSidebar({ ...props }) {
    const user = useSelector((store) => store.auth.user);

    const { t } = useTranslation();
    const { language } = useLanguage();


    const data = {
        headers: [],
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
                        label: t("Expense Categories"),
                        path: "/expense/categories",
                        icon: Home,
                        permission: can("Expense Category access"),
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
                label: t("Games Management"),
                icon: Gamepad2,
                items: [
                    {
                        label: t("Games"),
                        path: "/games",
                        icon: Gamepad2,
                        permission: can("Game access"),
                    },
                    {
                        label: t("Game Assets"),
                        path: "/game-assets",
                        icon: BookImageIcon,
                        permission: can("Game Asset access"),
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
                ],
            },
        ],
    };

    const [search, setSearch] = React.useState("");

    const filterItems = (items, query) => {
        return items
            .map((item) => {
                let matchesSearch = item.label
                    ?.toLowerCase()
                    .includes(query.toLowerCase());
                let hasPermission = item.permission;
                let filteredSubItems = [];
                if (item.items?.length) {
                    filteredSubItems = filterItems(item.items, query);
                    if (filteredSubItems.length > 0) {
                        matchesSearch = true;
                    }
                }
                if ((matchesSearch && hasPermission) || filteredSubItems.length > 0) {
                    return {
                        ...item,
                        items: filteredSubItems.length > 0 ? filteredSubItems : item.items,
                    };
                }
                return null;
            })
            .filter(Boolean);
    };


    const filteredNavItems = React.useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return data.navMain;
        }
        return data.navMain
            .map((group) => {
                const groupMatches = group.label?.toLowerCase().includes(query);
                const filteredItems = filterItems(group.items || [], query);
                if (groupMatches || filteredItems.length > 0) {
                    return {
                        ...group,
                        items: filteredItems,
                    };
                }
                return null;
            })
            .filter(Boolean);
    }, [search, data.navMain]);

    return (
        <Sidebar
            collapsible="icon"
            {...props}
            side={language === "ar" ? "right" : "left"}
        >
            <SidebarHeader>
                <SiderBarHeader workspaces={data.workspaces} user={user} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <SearchForm
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </SidebarGroup>
                <NavMain
                    items={filteredNavItems}
                    searchQuery={search}
                />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
    // return (
    //     <Sidebar collapsible="icon" {...props} side="left">
    //         <SidebarHeader>
    //             <SiderBarHeader user={user} />
    //         </SidebarHeader>
    //         <SidebarContent>
    //             <SidebarGroup className="group-data-[collapsible=icon]:hidden">
    //                 {/* <SidebarMenuButton asChild>
    //         <Link to="/dashboard">
    //           <Home />
    //           <span>Dashboard</span>
    //         </Link>
    //       </SidebarMenuButton> */}
    //                 <SearchForm
    //                     value={search}
    //                     onChange={(e) => setSearch(e.target.value)}
    //                 />
    //             </SidebarGroup>

    //             <NavMain items={data.navMain} />
    //         </SidebarContent>
    //         <SidebarFooter>
    //             <NavUser user={user} />
    //         </SidebarFooter>
    //         <SidebarRail />
    //     </Sidebar>
    // );
}