import * as React from "react";
import {
    BarChart,
    BookImageIcon,
    Building,
    DoorOpen,
    Gamepad2,
    Home,
    Hotel,
    Package,
    ReceiptIcon,
    Settings,
    ShoppingCart,
    Ticket,
    User2Icon,
    UserCheck,
    Users,
    Wallet,
    FileBarChart,
    LayoutDashboard,
    ShieldCheck,
    BadgeDollarSign,
    Receipt,
    Store,
    ClipboardList,
    UserCog,
    FolderTree
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
import { can } from "@/utils/helpers";
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
                label: t("Main"),
                icon: Home,
                items: [
                    {
                        label: t("Dashboard"),
                        path: "/dashboard",
                        icon: LayoutDashboard,
                        permission: can("Dashboard access"),
                    },
                    {
                        label: t("Charts"),
                        path: "/charts",
                        icon: FileBarChart,
                        permission: can("Charts access"),
                    },
                    {
                        label: t("Roles"),
                        path: "/roles",
                        icon: ShieldCheck,
                        permission: can("Role access"),
                    },
                    {
                        label: t("Permissions"),
                        path: "/permissions",
                        icon: DoorOpen,
                        permission: can("Permission access"),
                    },
                    {
                        label: t("Profile"),
                        path: "/profile",
                        icon: UserCog,
                        permission: can("Profile access"),
                    },
                ],
            },
            {
                label: t("Games Management"),
                icon: Gamepad2,
                items: [
                    {
                        label: t("Playground Sales"),
                        path: "/sales",
                        icon: Store,
                        permission: can("Sale access"),
                    },
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
                    {
                        label: t("Ticket Batches"),
                        path: "/ticket-batches",
                        icon: Ticket,
                        permission: can("Ticket access"),
                    },
                ],
            },
            {
                label: t("Expenses"),
                icon: Receipt,
                items: [
                    {
                        label: t("Expenses"),
                        path: "/expenses",
                        icon: ReceiptIcon,
                        permission: can("Expense access"),
                    },
                    {
                        label: t("Hotel Expenses"),
                        path: "/hotel-expenses",
                        icon: Hotel,
                        permission: can("Hotel Expense access"),
                    },
                    {
                        label: t("Expense Categories"),
                        path: "/expense/categories",
                        icon: FolderTree,
                        permission: can("Expense Category access"),
                    },
                ],
            },
            {
                label: t("Product Management"),
                icon: Package,
                items: [
                    {
                        label: t("Product Categories"),
                        path: "/product/categories",
                        icon: FolderTree,
                        permission: can("Product Category access"),
                    },
                    {
                        label: t("Products"),
                        path: "/products",
                        icon: Package,
                        permission: can("Product access"),
                    },
                    {
                        label: t("Sale Dashboard"),
                        path: "/sale-dashboard",
                        icon: Store,
                        permission: can("Sale access"),
                    },
                ],
            },
            {
                label: t("Reports"),
                icon: ClipboardList,
                items: [
                    {
                        label: t("Daily Reports"),
                        path: "/daily-reports",
                        icon: FileBarChart,
                        permission: can("Daily Report access"),
                    },
                ],
            },
            {
                label: t("Salary Management"),
                icon: BadgeDollarSign,
                items: [
                    {
                        label: t("Salaries"),
                        path: "/salaries",
                        icon: Wallet,
                        permission: can("Salary access"),
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
                        icon: Users,
                        permission: can("User access"),
                    },
                    {
                        label: t("Roles"),
                        path: "/roles",
                        icon: ShieldCheck,
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
}