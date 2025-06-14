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
        userActivity: [],
        financialOverview: [],
        ticketStatus: []
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
                userActivity: response.data.data.userActivity || [],
                financialOverview: response.data.data.financialOverview || [],
                ticketStatus: response.data.data.ticketStatus || []
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
            {/* Sales Overview Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('Sales Overview')}</CardTitle>
                    <CardDescription>{t('Sales performance across different periods')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <BarChartComponent data={chartData.salesOverview} />
                </CardContent>
            </Card>

            {/* Revenue Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('Revenue Trend')}</CardTitle>
                    <CardDescription>{t('Daily revenue over the last week')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <LineChartComponent data={chartData.revenueTrend} />
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

            {/* User Activity Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('User Activity')}</CardTitle>
                    <CardDescription>{t('User engagement and growth metrics')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <PieChartComponent data={chartData.userActivity} />
                </CardContent>
            </Card>

            {/* Financial Overview Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('Financial Overview')}</CardTitle>
                    <CardDescription>{t('Revenue vs Expenses comparison')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <LineChartComponent data={chartData.financialOverview} />
                </CardContent>
            </Card>

            {/* Ticket Status Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('Ticket Status')}</CardTitle>
                    <CardDescription>{t('Ticket usage and availability metrics')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <GaugeComponent data={chartData.ticketStatus} />
                </CardContent>
            </Card>
            </div>
        </div>
    );
}

export default Charts;
