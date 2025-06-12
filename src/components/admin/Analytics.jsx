import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import PageTitle from "./Layouts/PageTitle";
import { useTranslation } from "react-i18next";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { handleError } from "@/utils/helpers";
import Select from "../misc/Select";
import {
  Play,
  Clock,
  GamepadIcon,
  Trophy,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  Timer,
  Gamepad2,
  Target,
  RefreshCw
} from "lucide-react";
import Loader from "../Loader";
import StartGameDialog from "./Sales/StartGameDialog";
import ActiveGameCard from "./Sales/ActiveGameCard";
import CompletedGameCard from "./Sales/CompletedGameCard";

export const Analytics = () => {
  const { t } = useTranslation();

  // State management
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_sales: 0,
    active_games: 0,
    completed_games: 0,
    total_revenue: 0,
    average_revenue_per_game: 0
  });
  const [activeGames, setActiveGames] = useState([]);
  const [completedGames, setCompletedGames] = useState([]);
  const [games, setGames] = useState([]);
  const [gameAssets, setGameAssets] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGameAsset, setSelectedGameAsset] = useState(null);
  const [barcode, setBarcode] = useState('');
  const [startGameDialogOpen, setStartGameDialogOpen] = useState(false);
  const [startingGame, setStartingGame] = useState(false);

  // Auto-refresh interval for dashboard data
  useEffect(() => {
    if (games) {
      const interval = setInterval(() => {
        fetchDashboardData();
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchCompletedGames(),
        fetchGames()
      ]);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axiosClient.get('/sales/dashboard-data');
      const { stats, active_games } = response.data.data;
      setStats(stats);
      setActiveGames(active_games);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };



  const fetchCompletedGames = async () => {
    try {
      const response = await axiosClient.get('/sales/completed-games');
      setCompletedGames(response.data.data);
    } catch (error) {
      console.error('Error fetching completed games:', error);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await axiosClient.get('/games/all');
      setGames(response.data.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchGameAssets = async (gameId) => {
    console.log(gameId);
    try {
      const response = await axiosClient.get(`/game_assets/available-by-game/${gameId.value}`);
      setGameAssets(response.data.data);
    } catch (error) {
      console.error('Error fetching game assets:', error);
    }
  };

  const handleGameSelect = (selectedOption) => {
    if (selectedOption) {
      const game = games.find(g => g.id === parseInt(selectedOption.value));
      setSelectedGame(game);
      setSelectedGameAsset(null);
      fetchGameAssets(selectedOption);
    } else {
      setSelectedGame(null);
      setSelectedGameAsset(null);
      setGameAssets([]);
    }
  };

  const handleGameAssetSelect = (selectedOption) => {
    if (selectedOption) {
      const asset = gameAssets.find(a => a.id === parseInt(selectedOption.value));
      setSelectedGameAsset(asset);
    } else {
      setSelectedGameAsset(null);
    }
  };

  const handleStartGame = async () => {
    if (!selectedGame || !selectedGameAsset || !barcode.trim()) {
      toast.error(t("Please fill all fields"));
      return;
    }

    setStartingGame(true);
    try {
      const response = await axiosClient.post('/sales/start-game', {
        game_id: selectedGame.id,
        game_asset_id: selectedGameAsset.id,
        barcode: barcode.trim()
      });

      toast.success(response.data.message);

      // Reset form
      setSelectedGame(null);
      setSelectedGameAsset(null);
      setBarcode('');
      setGameAssets([]);

      // Refresh data
      fetchDashboardData();

    } catch (error) {
      handleError(error);
    } finally {
      setStartingGame(false);
    }
  };

  const completeGame = async (saleId) => {
    try {
      const response = await axiosClient.post('/sales/complete-game', { id: saleId });
      toast.success(response.data.message);

      // Refresh data
      fetchDashboardData();
      fetchCompletedGames();

      // Refresh available assets if a game is selected
      if (selectedGame) {
        fetchGameAssets({ value: selectedGame.id });
      }

      // Play completion sound
      playCompletionSound();

    } catch (error) {
      handleError(error);
    }
  };

  const playCompletionSound = () => {
    // Create audio context for completion sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle title={t("Sales Dashboard")} />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDashboardData}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {t("Refresh")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{t("Total Sales Today")}</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.total_sales}</div>
            <p className="text-xs text-muted-foreground">
              ${parseFloat(stats.total_revenue)} {t("Revenue")}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{t("Active Games")}</h3>
            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-green-600">{stats.active_games}</div>
            <p className="text-xs text-muted-foreground">{t("Currently Running")}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{t("Completed Games")}</h3>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-blue-600">{stats.completed_games}</div>
            <p className="text-xs text-muted-foreground">{t("Finished Today")}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{t("Average Revenue")}</h3>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-purple-600">
              ${stats.average_revenue_per_game || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">{t("Per Game Today")}</p>
          </div>
        </div>
      </div>

      {/* Quick Start Form - Horizontal Layout */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          {t("Quick Game Start")}
        </h3>

        <div className="grid gap-4 md:grid-cols-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">{t("Select Game")}</label>
            <Select
              placeholder={t("Choose a game")}
              value={selectedGame ? {
                value: selectedGame.id,
                label: `${selectedGame.name} - $${selectedGame.price} (${selectedGame.duration})`
              } : null}
              onChange={handleGameSelect}
              options={games.map(game => ({
                value: game.id,
                label: `${game.name} - $${game.price} (${game.duration})`
              }))}
              isClearable
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t("Select Asset")}</label>
            <Select
              placeholder={gameAssets.length === 0 ? t("No available assets") : t("Choose game asset")}
              value={selectedGameAsset ? {
                value: selectedGameAsset.id,
                label: selectedGameAsset.name
              } : null}
              onChange={handleGameAssetSelect}
              options={gameAssets.map(asset => ({
                value: asset.id,
                label: asset.name
              }))}
              isClearable
              isDisabled={gameAssets.length === 0 || !selectedGame}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t("Ticket Barcode")}</label>
            <Input
              placeholder={t("Scan or enter barcode")}
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
            />
          </div>

          <div>
            <Button
              onClick={handleStartGame}
              disabled={!selectedGame || !selectedGameAsset || !barcode.trim() || startingGame}
              className="w-full"
            >
              {startingGame ? (
                <>
                  <Loader className="h-4 w-4 mr-2" />
                  {t("Starting...")}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {t("Start Game")}
                </>
              )}
            </Button>
          </div>
        </div>

        {selectedGame && gameAssets.length === 0 && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {t("All assets for this game are currently in use")}
            </p>
          </div>
        )}
      </div>

      {/* Active Games - Full Width */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-green-600" />
          {t("Active Games")} ({activeGames.length})
        </h3>

        {activeGames.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Gamepad2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{t("No active games at the moment")}</p>
            <p className="text-sm">{t("Start a new game to see it here")}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeGames.map((sale) => (
              <ActiveGameCard
                key={sale.id}
                sale={sale}
                onComplete={completeGame}
                onExpired={playCompletionSound}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Games */}
      {completedGames.length > 0 && (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
            {t("Completed Games Today")} ({completedGames.length})
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedGames.map((sale) => (
              <CompletedGameCard key={sale.id} sale={sale} />
            ))}
          </div>
        </div>
      )}

      {/* Start Game Dialog */}
      <StartGameDialog
        open={startGameDialogOpen}
        onOpenChange={setStartGameDialogOpen}
        games={games}
        onGameStarted={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
};
