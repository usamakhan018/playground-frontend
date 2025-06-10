import AdditionIndex from "@/components/company/Addition/Index"
import AssignDriverIndex from "@/components/company/AssignDriver/Index"
import BankAccountIndex from "@/components/company/BankAccounts/Index"
import CashinIndex from "@/components/company/Cashin/Index"
import CompanyDashboard from "@/components/company/CompanyDashboard"
import CompanyDriver from "@/components/company/CompanyDriver"
import CompanyNotifications from "@/components/company/CompanyNotifications"
import ContactDetailIndex from "@/components/company/ContactDetails/Index"
import DeductionIndex from "@/components/company/Deduction/Index"
import DriverCreate from "@/components/company/Drivers/Create"
import DriverEdit from "@/components/company/Drivers/Edit"
import DriverIndex from "@/components/company/Drivers/Index"
import DriverView from "@/components/company/Drivers/View"
import ExpenseTypeIndex from "@/components/company/ExpenseType/Index"
import HolidayIndex from "@/components/company/Holiday/Index"
import HolidayReasonIndex from "@/components/company/HolidayReason/Index"
import PaymentTypeIndex from "@/components/company/PaymentType/Index"
import PermissionIndex from "@/components/company/Permissions/Index"
import RoleIndex from "@/components/company/Roles/Index"
import UserIndex from "@/components/company/Users/Index"
import VehicleCreate from "@/components/company/Vehicles/Create"
import VehicleEdit from "@/components/company/Vehicles/Edit"
import VehicleIndex from "@/components/company/Vehicles/Index"
import VehicleView from "@/components/company/Vehicles/View"

const companyRoutes = [
    {
        name: 'companyDashboard',
        path: 'dashboard',
        element: <CompanyDashboard />
    },
    {
        name: 'notifications',
        path: 'notifications',
        element: <CompanyNotifications />
    },
    {
        name: 'drivers',
        path: 'drivers',
        element: <DriverIndex />
    },
    {
        name: 'driversCreate',
        path: 'drivers/create',
        element: <DriverCreate />
    },
    {
        name: 'driversEdit',
        path: 'drivers/edit/:id',
        element: <DriverEdit />
    },
    {
        name: 'driversShow',
        path: 'drivers/view/:id',
        element: <DriverView />
    },
    {
        name: 'vehicles',
        path: 'vehicles',
        element: <VehicleIndex />
    },
    {
        name: 'vehiclesCreate',
        path: 'vehicles/create',
        element: <VehicleCreate />
    },
    {
        name: 'vehiclesEdit',
        path: 'vehicles/edit/:id',
        element: <VehicleEdit />
    },
    {
        name: 'vehiclesShow',
        path: 'vehicles/view/:id',
        element: <VehicleView />
    },
    {
        name: 'assign_driver',
        path: 'assign/driver',
        element: <AssignDriverIndex />
    },
    {
        name: 'bank_account',
        path: 'bank/accounts',
        element: <BankAccountIndex />
    },
    {
        name: 'additions',
        path: 'additions',
        element: <AdditionIndex />
    },
    {
        name: 'deductions',
        path: 'deductions',
        element: <DeductionIndex />
    },
    {
        name: 'payment_types',
        path: 'payment/types',
        element: <PaymentTypeIndex />
    },
    {
        name: 'expense_types',
        path: 'expense/types',
        element: <ExpenseTypeIndex />
    },
    {
        name: 'holiday_reasons',
        path: 'holiday/reasons',
        element: <HolidayReasonIndex />
    },
    {
        name: 'holidays',
        path: 'holidays',
        element: <HolidayIndex />
    },
    {
        name: 'cashins',
        path: 'cashins',
        element: <CashinIndex />
    },
    {
        name: 'users',
        path: 'users',
        element: <UserIndex />
    },
    {
        name: 'permissions',
        path: 'permissions',
        element: <PermissionIndex />
    },
    {
        name: 'contact_details',
        path: 'contact/details',
        element: <ContactDetailIndex />
    },
    {
        name: 'roles',
        path: 'roles',
        element: <RoleIndex />
    },
]

export default companyRoutes