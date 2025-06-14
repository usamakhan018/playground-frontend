import React, { useEffect, useState } from "react";
import PageTitle from "./Layouts/PageTitle";
import { useTranslation } from "react-i18next";
import { 
    Home, 
    RefreshCcw, 
    Users, 
    ShoppingCart, 
    GamepadIcon,
    Ticket,
    DollarSign,
    TrendingUp,
    TrendingDown,
    FileText,
    CreditCard,
    PiggyBank,
    Calendar,
    Activity,
    Target,
    UserCheck,
    UserPlus,
    Gamepad2,
    Receipt,
    Banknote,
    ClipboardList,
    Wallet,
    BarChart3
} from "lucide-react";
import { handleError } from "@/utils/helpers";
import axiosClient from "@/axios";
import Loader from "../Loader";
import StatCard from "./StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation()
    const [stats, setStats] = useState(null);

    useEffect(() => {
        getStats()
    }, [])

    const getStats = async () => {
        setLoading(true)
        try {
            const response = await axiosClient.get('admin-stats')
            setStats(response.data.data);
        } catch (error) {
            handleError(error);
            console.error("Error fetching admin stats:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading || !stats) {  
        return <Loader />
    }

    // Sales & Revenue Overview
    const salesOverview = [
        {
            title: t("Sales Today"),
            count: stats.sales_today || 0,
            icon: ShoppingCart,
            bgColor: "bg-blue-100 dark:bg-blue-900",
            textColor: "text-blue-800 dark:text-blue-100",
            iconColor: "text-blue-600 dark:text-blue-400",
            description: t("Total sales made today")
        },
        {
            title: t("Revenue Today"),
            count: `$${(stats.revenue_today || 0).toLocaleString()}`,
            icon: DollarSign,
            bgColor: "bg-emerald-100 dark:bg-emerald-900",
            textColor: "text-emerald-800 dark:text-emerald-100",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            description: t("Total revenue generated today")
        },
        {
            title: t("Active Games"),
            count: stats.active_sales_today || 0,
            icon: GamepadIcon,
            bgColor: "bg-orange-100 dark:bg-orange-900",
            textColor: "text-orange-800 dark:text-orange-100",
            iconColor: "text-orange-600 dark:text-orange-400",
            description: t("Games currently being played")
        },
        {
            title: t("Net Profit Today"),
            count: `$${(stats.net_profit_today || 0).toLocaleString()}`,
            icon: stats.net_profit_today >= 0 ? TrendingUp : TrendingDown,
            bgColor: stats.net_profit_today >= 0 ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900",
            textColor: stats.net_profit_today >= 0 ? "text-green-800 dark:text-green-100" : "text-red-800 dark:text-red-100",
            iconColor: stats.net_profit_today >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
            description: t("Today's profit after expenses")
        }
    ];

    // Monthly Overview  
    const monthlyOverview = [
        {
            title: t("Monthly Sales"),
            count: stats.sales_this_month || 0,
            icon: BarChart3,
            bgColor: "bg-purple-100 dark:bg-purple-900",
            textColor: "text-purple-800 dark:text-purple-100",
            iconColor: "text-purple-600 dark:text-purple-400"
        },
        {
            title: t("Monthly Revenue"),
            count: `$${(stats.revenue_this_month || 0).toLocaleString()}`,
            icon: Banknote,
            bgColor: "bg-cyan-100 dark:bg-cyan-900",
            textColor: "text-cyan-800 dark:text-cyan-100",
            iconColor: "text-cyan-600 dark:text-cyan-400"
        },
        {
            title: t("Monthly Expenses"),
            count: `$${(stats.expenses_this_month || 0).toLocaleString()}`,
            icon: Receipt,
            bgColor: "bg-red-100 dark:bg-red-900",
            textColor: "text-red-800 dark:text-red-100",
            iconColor: "text-red-600 dark:text-red-400"
        },
        {
            title: t("Monthly Profit"),
            count: `$${(stats.net_profit_this_month || 0).toLocaleString()}`,
            icon: stats.net_profit_this_month >= 0 ? TrendingUp : TrendingDown,
            bgColor: stats.net_profit_this_month >= 0 ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900",
            textColor: stats.net_profit_this_month >= 0 ? "text-green-800 dark:text-green-100" : "text-red-800 dark:text-red-100", 
            iconColor: stats.net_profit_this_month >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        }
    ];

    // User Statistics
    const userStats = [
        {
            title: t("Total Users"),
            count: stats.total_users || 0,
            icon: Users,
            bgColor: "bg-indigo-100 dark:bg-indigo-900",
            textColor: "text-indigo-800 dark:text-indigo-100",
            iconColor: "text-indigo-600 dark:text-indigo-400"
        },
        {
            title: t("New Users Today"),
            count: stats.new_users_today || 0,
            icon: UserPlus,
            bgColor: "bg-teal-100 dark:bg-teal-900",
            textColor: "text-teal-800 dark:text-teal-100",
            iconColor: "text-teal-600 dark:text-teal-400"
        },
        {
            title: t("Active Users Today"),
            count: stats.active_users_today || 0,
            icon: UserCheck,
            bgColor: "bg-green-100 dark:bg-green-900",
            textColor: "text-green-800 dark:text-green-100",
            iconColor: "text-green-600 dark:text-green-400"
        }
    ];

    // Gaming System Statistics
    const gamingStats = [
        {
            title: t("Total Games"),
            count: stats.total_games || 0,
            icon: Gamepad2,
            bgColor: "bg-violet-100 dark:bg-violet-900",
            textColor: "text-violet-800 dark:text-violet-100",
            iconColor: "text-violet-600 dark:text-violet-400"
        },
        {
            title: t("Game Assets"),
            count: stats.total_game_assets || 0,
            icon: Target,
            bgColor: "bg-pink-100 dark:bg-pink-900",
            textColor: "text-pink-800 dark:text-pink-100",
            iconColor: "text-pink-600 dark:text-pink-400"
        },
        {
            title: t("Total Tickets"),
            count: stats.total_tickets || 0,
            icon: Ticket,
            bgColor: "bg-amber-100 dark:bg-amber-900",
            textColor: "text-amber-800 dark:text-amber-100",
            iconColor: "text-amber-600 dark:text-amber-400"
        },
        {
            title: t("Unused Tickets"),
            count: stats.unused_tickets || 0,
            icon: Ticket,
            bgColor: "bg-yellow-100 dark:bg-yellow-900",
            textColor: "text-yellow-800 dark:text-yellow-100",
            iconColor: "text-yellow-600 dark:text-yellow-400"
        }
    ];

    // Financial Management
    const financialStats = [
        {
            title: t("Pending Salaries"),
            count: stats.pending_salaries || 0,
            icon: CreditCard,
            bgColor: "bg-rose-100 dark:bg-rose-900",
            textColor: "text-rose-800 dark:text-rose-100",
            iconColor: "text-rose-600 dark:text-rose-400"
        },
        {
            title: t("Account Balance"),
            count: `$${(stats.total_account_balance || 0).toLocaleString()}`,
            icon: Wallet,
            bgColor: "bg-emerald-100 dark:bg-emerald-900",
            textColor: "text-emerald-800 dark:text-emerald-100",
            iconColor: "text-emerald-600 dark:text-emerald-400"
        },
        {
            title: t("Pending Reports"),
            count: stats.pending_reports || 0,
            icon: FileText,
            bgColor: "bg-orange-100 dark:bg-orange-900",
            textColor: "text-orange-800 dark:text-orange-100",
            iconColor: "text-orange-600 dark:text-orange-400"
        },
        {
            title: t("Pending Collections"),
            count: stats.pending_collections || 0,
            icon: PiggyBank,
            bgColor: "bg-blue-100 dark:bg-blue-900",
            textColor: "text-blue-800 dark:text-blue-100",
            iconColor: "text-blue-600 dark:text-blue-400"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <PageTitle title={t("Admin Dashboard")} />
                <Button
                    variant="outline"
                    size="sm"
                    onClick={getStats}
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {t("Refresh")}
                </Button>
            </div>

            {/* Today's Overview */}
            <div>
                <h2 className="text-xl font-semibold mb-4">{t("Today's Overview")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {salesOverview.map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>
            </div>

            {/* Monthly Overview */}
            <div>
                <h2 className="text-xl font-semibold mb-4">{t("Monthly Overview")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {monthlyOverview.map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>
            </div>

            {/* User Statistics */}
            <div>
                <h2 className="text-xl font-semibold mb-4">{t("User Statistics")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userStats.map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>
            </div>

            {/* Gaming System */}
            <div>
                <h2 className="text-xl font-semibold mb-4">{t("Gaming System")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {gamingStats.map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>
            </div>

            {/* Financial Management */}
            <div>
                <h2 className="text-xl font-semibold mb-4">{t("Financial Management")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {financialStats.map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Games */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("Popular Games")}</CardTitle>
                        <CardDescription>{t("Top performing games by sales count")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.popular_games && stats.popular_games.length > 0 ? (
                            <div className="space-y-3">
                                {stats.popular_games.map((game, index) => (
                                    <div key={game.game_id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <span className="font-medium">{game.game?.name || 'Unknown Game'}</span>
                                        </div>
                                        <span className="text-muted-foreground">{game.sales_count} {t("sales")}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">{t("No games data available")}</p>
                        )}
                    </CardContent>
                </Card>

                {/* System Health */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("System Health")}</CardTitle>
                        <CardDescription>{t("Key system metrics and status")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">{t("Reports Status")}</span>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">
                                        {stats.confirmed_reports || 0} {t("confirmed")} / {stats.submitted_reports || 0} {t("submitted")}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">{t("Collections Status")}</span>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">
                                        {stats.confirmed_collections || 0} {t("confirmed")} / {stats.settled_collections || 0} {t("settled")}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">{t("Salary Status")}</span>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">
                                        {stats.paid_salaries || 0} {t("paid")} / {stats.pending_salaries || 0} {t("pending")}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">{t("Active Accounts")}</span>
                                <div className="text-right">
                                    <div className="text-sm font-medium">{stats.accounts_count || 0}</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
