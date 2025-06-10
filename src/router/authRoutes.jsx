import CheckRole from "@/components/CheckRole"
import adminRoutes from "./adminRoutes"
import { AdminLayout } from "@/components/admin/AdminLayout"
import UnAuthorized from "@/components/UnAuthorized"
const authRoutes = [
    // {
    //     name: 'checkRole',
    //     path: '/',
    //     element: <CheckRole />

    // },
    {
        name: 'adminLayout',
        path: '/',
        element: <AdminLayout />,
        children: adminRoutes,
    },
    {
        name: 'unauthorized',
        path: '/unauthorized',
        element: <UnAuthorized />
    },


]

export default authRoutes