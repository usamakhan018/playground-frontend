import AdminDashboard from "@/components/admin/AdminDashboard"
import AdminProfile from "@/components/admin/AdminProfile"
import AdminSetting from "@/components/admin/AdminSetting"
import PermissionIndex from "@/components/admin/Permissions/Index"
import RoleCreate from "@/components/admin/Roles/Create"
import RoleEdit from "@/components/admin/Roles/Edit"
import RoleIndex from "@/components/admin/Roles/Index"
import ExpenseCategoryIndex from "@/components/admin/ExpenesCategory/Index"
import UserIndex from "@/components/admin/Users/Index"
import GameIndex from "@/components/admin/Games/Index"
import GameAssetIndex from "@/components/admin/GameAssets/Index"
import UserAccount from "@/components/admin/Users/Account"
import TicketIndex from "@/components/admin/Tickets/Index"
import { Analytics } from "@/components/admin/Analytics"
import Charts from "@/components/admin/Charts"
import ExpenseIndex from "@/components/admin/Expenses/Index"
import SalaryIndex from "@/components/admin/Salaries/Index"

const adminRoutes = [
    {
        name: 'Dashboard',
        path: 'dashboard',
        element: <AdminDashboard />
    },
    {
        name: 'sales',
        path: 'sales',
        element: <Analytics />
    },
    {
        name: 'setting',
        path: 'setting',
        element: <AdminSetting />
    },
    {
        name: 'profile',
        path: 'profile',
        element: <AdminProfile />
    },
    {
        name: 'roles',
        path: 'roles',
        element: <RoleIndex />
    },
    {
        name: 'rolesCreate',
        path: 'roles/create',
        element: <RoleCreate />
    },
    {
        name: 'rolesEdit',
        path: 'roles/edit/:id',
        element: <RoleEdit />
    },
    {
        name: 'expenseCategories',
        path: 'expense/categories',
        element: <ExpenseCategoryIndex />
    },
    {
        name: 'permissions',
        path: 'permissions',
        element: <PermissionIndex />
    },
    {
        name: 'users',
        path: 'users',
        element: <UserIndex />
    },
    {
        name: 'games',
        path: 'games',
        element: <GameIndex />
    },
    {
        name: 'gameAssets',
        path: 'game-assets',
        element: <GameAssetIndex />
    },
    {
        name: 'userAccount',
        path: 'users/:userId/account',
        element: <UserAccount />
    },
    {
        name: 'tickets',
        path: 'tickets',
        element: <TicketIndex />
    },
    {
        name: 'charts',
        path: 'charts',
        element: <Charts />
    },
    {
        name: 'expenses',
        path: 'expenses',
        element: <ExpenseIndex />,
    },
    {
        name: 'salaries',
        path: 'salaries',
        element: <SalaryIndex />,
    },
    // {
    //     name: 'dailyReports',
    //     path: 'daily-reports',
    //     element: <DailyReportIndex />
    // },
]

export default adminRoutes