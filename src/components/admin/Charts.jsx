import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import BarChartComponent from '@/components/charts/BarChartComponent';
import LineChartComponent from '@/components/charts/LineChartComponent';
import PieChartComponent from '@/components/charts/PieChartComponent';
import GaugeComponent from '@/components/charts/GaugeComponent';
import { useTranslation } from 'react-i18next';
import axiosClient from '@/axios';
import { handleError } from '@/utils/helpers';
import Loader from '../Loader';

function Charts() {
    const { t } = useTranslation();
    
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
        salesOverview: [],
        revenueTrend: [],
        gamePopularity: [],
        productPopularity: [],
        businessSplit: [],
        expenseOverview: [],
        financialOverview: [],
        systemStatus: []
    });

    useEffect(() => {
        fetchChartsData();
    }, []);

    const fetchChartsData = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/charts');
            
            setChartData({
                salesOverview: response.data.data.salesOverview || [],
                revenueTrend: response.data.data.revenueTrend || [],
                gamePopularity: response.data.data.gamePopularity || [],
                productPopularity: response.data.data.productPopularity || [],
                businessSplit: response.data.data.businessSplit || [],
                expenseOverview: response.data.data.expenseOverview || [],
                financialOverview: response.data.data.financialOverview || [],
                systemStatus: response.data.data.systemStatus || []
            });
        } catch (error) {
            console.error('Error fetching charts data:', error);
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchChartsData();
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with Refresh Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">{t('Charts')}</h2>
                    <p className="text-muted-foreground">{t('Real-time analytics and insights')}</p>
                </div>
                <Button 
                    onClick={handleRefresh} 
                    disabled={loading}
                    size="sm"
                    className="gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    {t('Refresh')}
                </Button>
            </div>

            {/* Charts Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Sales Overview Chart - Playground vs Restaurant */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('Sales Overview')}</CardTitle>
                    <CardDescription>{t('Playground vs Restaurant sales comparison')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <BarChartComponent data={chartData.salesOverview} />
                </CardContent>
            </Card>

            {/* Revenue Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('Revenue Trend')}</CardTitle>
                    <CardDescription>{t('Daily revenue breakdown for the last week')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <LineChartComponent data={chartData.revenueTrend} />
                </CardContent>
            </Card>

            {/* Business Split Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('Business Split')}</CardTitle>
                    <CardDescription>{t('Revenue distribution between playground and restaurant')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <PieChartComponent data={chartData.businessSplit} />
                </CardContent>
            </Card>

            {/* Game Popularity Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('Game Popularity')}</CardTitle>
                    <CardDescription>{t('Most played games by session count')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <BarChartComponent data={chartData.gamePopularity} />
                </CardContent>
            </Card>

            {/* Product Popularity Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('Product Popularity')}</CardTitle>
                    <CardDescription>{t('Best selling products by sales count')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <BarChartComponent data={chartData.productPopularity} />
                </CardContent>
            </Card>

            {/* Expense Overview Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('Expense Overview')}</CardTitle>
                    <CardDescription>{t('General vs Hotel expenses over time')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <LineChartComponent data={chartData.expenseOverview} />
                </CardContent>
            </Card>

            {/* Financial Overview Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('Financial Overview')}</CardTitle>
                    <CardDescription>{t('Complete revenue and expense breakdown')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <LineChartComponent data={chartData.financialOverview} />
                </CardContent>
            </Card>

            {/* System Status Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('System Status')}</CardTitle>
                    <CardDescription>{t('Key system metrics and operational status')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <GaugeComponent data={chartData.systemStatus} />
                </CardContent>
            </Card>
            </div>
        </div>
    );
}

export default Charts;
