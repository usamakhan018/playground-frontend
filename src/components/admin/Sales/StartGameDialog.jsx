import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Select from "@/components/misc/Select";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { handleError } from "@/utils/helpers";
import { Play } from "lucide-react";
import Loader from "@/components/Loader";

const StartGameDialog = ({ open, onOpenChange, onGameStarted }) => {
  const { t } = useTranslation();
  
  // Redux state
  const games = useSelector((state) => state.ajax.games);
  const gameAssets = useSelector((state) => state.ajax.gameAssets);
  
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGameAsset, setSelectedGameAsset] = useState(null);
  const [availableGameAssets, setAvailableGameAssets] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setSelectedGame(null);
      setSelectedGameAsset(null);
      setAvailableGameAssets([]);
      setBarcode('');
    }
  }, [open]);

  const filterAvailableAssets = async (gameId) => {
    if (!gameAssets || !gameId) {
      setAvailableGameAssets([]);
      return;
    }

    try {
      // Get current active games to determine which assets are in use
      const response = await axiosClient.get('/sales/dashboard-data');
      const activeGames = response.data.data.active_games;
      
      // Get assets that belong to the selected game
      const gameSpecificAssets = gameAssets.filter(asset => asset.game_id === parseInt(gameId));
      
      // Get assets that are currently in use (from active games)
      const assetsInUse = activeGames.map(sale => sale.game_asset_id);
      
      // Filter out assets that are currently in use
      const availableAssets = gameSpecificAssets.filter(asset => !assetsInUse.includes(asset.id));
      
      setAvailableGameAssets(availableAssets);
    } catch (error) {
      console.error('Error filtering game assets:', error);
      // Fallback: show all assets for the game
      const gameSpecificAssets = gameAssets.filter(asset => asset.game_id === parseInt(gameId));
      setAvailableGameAssets(gameSpecificAssets);
    }
  };

  const handleGameSelect = (selectedOption) => {
    if (selectedOption && games) {
      const game = games.find(g => g.id === parseInt(selectedOption.value));
      setSelectedGame(game);
      setSelectedGameAsset(null);
      filterAvailableAssets(selectedOption.value);
    } else {
      setSelectedGame(null);
      setSelectedGameAsset(null);
      setAvailableGameAssets([]);
    }
  };

  const handleGameAssetSelect = (selectedOption) => {
    if (selectedOption) {
      const asset = availableGameAssets.find(a => a.id === parseInt(selectedOption.value));
      setSelectedGameAsset(asset);
    } else {
      setSelectedGameAsset(null);
    }
  };

  const handleStartGame = async (e) => {
    e.preventDefault();
    
    if (!selectedGame || !selectedGameAsset || !barcode.trim()) {
      toast.error(t("Please fill all fields"));
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/sales/start-game', {
        game_id: selectedGame.id,
        game_asset_id: selectedGameAsset.id,
        barcode: barcode.trim()
      });

      toast.success(response.data.message);
      
      // Reset form and close dialog
      setSelectedGame(null);
      setSelectedGameAsset(null);
      setBarcode('');
      setAvailableGameAssets([]);
      onOpenChange(false);
      
      // Notify parent component
      if (onGameStarted) {
        onGameStarted();
      }
      
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Play className="h-5 w-5 mr-2" />
            {t("Start New Game")}
          </DialogTitle>
          <DialogDescription>
            {t("Select a game, game asset, and scan the ticket barcode to start a new game session.")}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleStartGame} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="game">{t("Select Game")}</Label>
            <Select
              placeholder={t("Choose a game")}
              value={selectedGame ? {
                value: selectedGame.id,
                label: `${selectedGame.name} - $${selectedGame.price} (${selectedGame.duration})`
              } : null}
              onChange={handleGameSelect}
              options={games ? games.map(game => ({
                value: game.id,
                label: `${game.name} - $${game.price} (${game.duration})`
              })) : []}
              isClearable
            />
          </div>
          
          {selectedGame && (
            <div className="space-y-2">
              <Label htmlFor="asset">{t("Select Game Asset")}</Label>
              <Select
                placeholder={t("Choose game asset")}
                value={selectedGameAsset ? {
                  value: selectedGameAsset.id,
                  label: selectedGameAsset.name
                } : null}
                onChange={handleGameAssetSelect}
                options={availableGameAssets.map(asset => ({
                  value: asset.id,
                  label: asset.name
                }))}
                isClearable
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="barcode">{t("Ticket Barcode")}</Label>
            <Input
              id="barcode"
              placeholder={t("Scan or enter ticket barcode")}
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              required
            />
          </div>
          
          {selectedGame && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">{t("Game Details")}</h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">{t("Name")}:</span> {selectedGame.name}</p>
                <p><span className="font-medium">{t("Price")}:</span> ${selectedGame.price}</p>
                <p><span className="font-medium">{t("Duration")}:</span> {selectedGame.duration}</p>
                {selectedGameAsset && (
                  <p><span className="font-medium">{t("Asset")}:</span> {selectedGameAsset.name}</p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t("Cancel")}
            </Button>
            <Button 
              type="submit"
              disabled={!selectedGame || !selectedGameAsset || !barcode.trim() || loading}
            >
              {loading ? (
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StartGameDialog; 