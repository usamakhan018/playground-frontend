// =====================
// Data
// =====================

import { t } from "i18next";
import { Gamepad2, DollarSign, CreditCard, TrendingUp, CheckCircle } from "lucide-react";

// Games
export const gameKpis = (stats) => [
    {
        title: t("Total Games Played"),
        count: stats?.total_games || 0,
        icon: Gamepad2,
        bgColor: "bg-blue-100 dark:bg-blue-900",
        textColor: "text-blue-800 dark:text-blue-100",
        iconColor: "text-blue-600 dark:text-blue-400",
        description: t("Total games played")
    },
    {
        title: t("Total Game Revenue"),
        count: `OMR ${parseFloat(stats?.total_game_revenue ? stats?.total_game_revenue : 0).toFixed(2)}`,
        icon: DollarSign,
        bgColor: "bg-green-100 dark:bg-green-900",
        textColor: "text-green-800 dark:text-green-100",
        iconColor: "text-green-600 dark:text-green-400",
        description: t("Total game revenue")
    },
    {
        title: t("Total Game Expenses"),
        count: `OMR ${parseFloat(stats?.total_game_expenses ? stats?.total_game_expenses : 0).toFixed(2)}`,
        icon: CreditCard,
        bgColor: "bg-red-100 dark:bg-red-900",
        textColor: "text-red-800 dark:text-red-100",
        iconColor: "text-red-600 dark:text-red-400",
        description: t("Total game expenses")
    },
    {
        title: t("Total Game Profit"),
        count: `OMR ${parseFloat(stats?.total_game_profit ? stats?.total_game_profit : 0).toFixed(2)}`,
        icon: TrendingUp,
        bgColor: "bg-blue-100 dark:bg-blue-900",
        textColor: "text-blue-800 dark:text-blue-100",
        iconColor: "text-blue-600 dark:text-blue-400",
        description: t("Total game profit")
    },
];


// Assets
export const assetKpis = (stats) => [
    {
        title: t("Total Assets"),
        count: stats?.total_assets || 0,
        icon: CheckCircle,
        bgColor: "bg-blue-100 dark:bg-blue-900",
        textColor: "text-blue-800 dark:text-blue-100",
        iconColor: "text-blue-600 dark:text-blue-400",
        description: t("Total assets")
    },
    {
        title: t("Total Asset Revenue"),
        count: `OMR ${parseFloat(stats?.total_asset_revenue ? stats?.total_asset_revenue : 0).toFixed(2)}`,
        icon: DollarSign,
        bgColor: "bg-green-100 dark:bg-green-900",
        textColor: "text-green-800 dark:text-green-100",
        iconColor: "text-green-600 dark:text-green-400",
        description: t("Total asset revenue")
    },
    {
        title: t("Total Asset Expenses"),
        count: `OMR ${parseFloat(stats?.total_asset_expenses ? stats?.total_asset_expenses : 0).toFixed(2)}`,
        icon: CreditCard,
        bgColor: "bg-red-100 dark:bg-red-900",
        textColor: "text-red-800 dark:text-red-100",
        iconColor: "text-red-600 dark:text-red-400",
        description: t("Total asset expenses")
    },
    {
        title: t("Total Asset Profit"),
        count: `OMR ${parseFloat(stats?.total_asset_profit ? stats?.total_asset_profit : 0).toFixed(2)}`,
        icon: TrendingUp,
        bgColor: "bg-blue-100 dark:bg-blue-900",
        textColor: "text-blue-800 dark:text-blue-100",
        iconColor: "text-blue-600 dark:text-blue-400",
        description: t("Total asset profit")
    },
];

// Products
export const productKpis = (stats) => [
    {
        title: t("Total Products"),
        count: stats?.total_products || 0,
        icon: CheckCircle,
        bgColor: "bg-blue-100 dark:bg-blue-900",
        textColor: "text-blue-800 dark:text-blue-100",
        iconColor: "text-blue-600 dark:text-blue-400",
        description: t("Total products")
    },
    {
        title: t("Total Product Revenue"),
        count: `OMR ${parseFloat(stats?.total_product_revenue ? stats?.total_product_revenue : 0).toFixed(2)}`,
        icon: DollarSign,
        bgColor: "bg-green-100 dark:bg-green-900",
        textColor: "text-green-800 dark:text-green-100",
        iconColor: "text-green-600 dark:text-green-400",
        description: t("Total product revenue")
    },
    {
        title: t("Total Product Expenses"),
        count: `OMR ${parseFloat(stats?.total_product_expenses ? stats?.total_product_expenses : 0).toFixed(2)}`,
        icon: CreditCard,
        bgColor: "bg-red-100 dark:bg-red-900",
        textColor: "text-red-800 dark:text-red-100",
        iconColor: "text-red-600 dark:text-red-400",
        description: t("Total product expenses")
    },
    {
        title: t("Total Product Profit"),
        count: `OMR ${parseFloat(stats?.total_product_profit ? stats?.total_product_profit : 0).toFixed(2)}`,
        icon: TrendingUp,
        bgColor: "bg-blue-100 dark:bg-blue-900",
        textColor: "text-blue-800 dark:text-blue-100",
        iconColor: "text-blue-600 dark:text-blue-400",
        description: t("Total product profit")
    },
];
// Branches
export const branchKpis = (stats) => [
    {
        title: t("Total Branches"),
        count: stats?.total_branches || 0,
        icon: CheckCircle,
        bgColor: "bg-blue-100 dark:bg-blue-900",
        textColor: "text-blue-800 dark:text-blue-100",
        iconColor: "text-blue-600 dark:text-blue-400",
        description: t("Total branches")
    },
    {
        title: t("Total Branch Revenue"),
        count: `OMR ${parseFloat(stats?.total_branch_revenue ? stats?.total_branch_revenue : 0).toFixed(2)}`,
        icon: DollarSign,
        bgColor: "bg-green-100 dark:bg-green-900",
        textColor: "text-green-800 dark:text-green-100",
        iconColor: "text-green-600 dark:text-green-400",
        description: t("Total branch revenue")
    },
    {
        title: t("Total Branch Expenses"),
        count: `OMR ${parseFloat(stats?.total_branch_expenses ? stats?.total_branch_expenses : 0).toFixed(2)}`,
        icon: CreditCard,
        bgColor: "bg-red-100 dark:bg-red-900",
        textColor: "text-red-800 dark:text-red-100",
        iconColor: "text-red-600 dark:text-red-400",
        description: t("Total branch expenses")
    },
    {
        title: t("Total Branch Profit"),
        count: `OMR ${parseFloat(stats?.total_branch_profit ? stats?.total_branch_profit : 0).toFixed(2)}`,
        icon: TrendingUp,
        bgColor: "bg-blue-100 dark:bg-blue-900",
        textColor: "text-blue-800 dark:text-blue-100",
        iconColor: "text-blue-600 dark:text-blue-400",
        description: t("Total branch profit")
    },
];
export const employeeKpis = (stats) => [
    {
        title: t("Total Employees"),
        count: stats?.total_employees || 0,
        icon: CheckCircle,
        bgColor: "bg-blue-100 dark:bg-blue-900",
        textColor: "text-blue-800 dark:text-blue-100",
        iconColor: "text-blue-600 dark:text-blue-400",
        description: t("Total employees")
    },
    {
        title: t("Total Employee Revenue"),
        count: `OMR ${parseFloat(stats?.total_employee_revenue ? stats?.total_employee_revenue : 0).toFixed(2)}`,
        icon: DollarSign,
        bgColor: "bg-green-100 dark:bg-green-900",
        textColor: "text-green-800 dark:text-green-100",
        iconColor: "text-green-600 dark:text-green-400",
        description: t("Total employee revenue")
    },
    {
        title: t("Total Employee Expenses"),
        count: `OMR ${parseFloat(stats?.total_employee_expenses ? stats?.total_employee_expenses : 0).toFixed(2)}`,
        icon: CreditCard,
        bgColor: "bg-red-100 dark:bg-red-900",
        textColor: "text-red-800 dark:text-red-100",
        iconColor: "text-red-600 dark:text-red-400",
        description: t("Total employee expenses")
    },
    {
        title: t("Total Employee Profit"),
        count: `OMR ${parseFloat(stats?.total_employee_profit ? stats?.total_employee_profit : 0).toFixed(2)}`,
        icon: TrendingUp,
        bgColor: "bg-blue-100 dark:bg-blue-900",
        textColor: "text-blue-800 dark:text-blue-100",
        iconColor: "text-blue-600 dark:text-blue-400",
        description: t("Total employee profit")
    },
];