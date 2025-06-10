import AdminDashboard from "@/components/admin/AdminDashboard"
import AdminProfile from "@/components/admin/AdminProfile"
import AdminSetting from "@/components/admin/AdminSetting"
import PermissionIndex from "@/components/admin/Permissions/Index"
import RoleCreate from "@/components/admin/Roles/Create"
import RoleEdit from "@/components/admin/Roles/Edit"
import RoleIndex from "@/components/admin/Roles/Index"
import RoomTypeIndex from "@/components/admin/RoomType/Index"

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
        name: 'roomTypes',
        path: 'room/types',
        element: <RoomTypeIndex />
    },
    {
        name: 'permissions',
        path: 'permissions',
        element: <PermissionIndex />
    },
]

export default adminRoutes