import AdminDashboard from "@/components/admin/AdminDashboard"
import AdminProfile from "@/components/admin/AdminProfile"
import AdminSetting from "@/components/admin/AdminSetting"
import PermissionIndex from "@/components/admin/Permissions/Index"
import RoleCreate from "@/components/admin/Roles/Create"
import RoleEdit from "@/components/admin/Roles/Edit"
import RoleIndex from "@/components/admin/Roles/Index"
import ExpenseCategoryIndex from "@/components/admin/ExpenesCategory/Index"
import UserIndex from "@/components/admin/Users/Index"

const adminRoutes = [
    {
        name: 'Dashboard',
        path: 'dashboard',
        element: <AdminDashboard />
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
]

export default adminRoutes