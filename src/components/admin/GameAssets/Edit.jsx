import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShadcnSelect from "@/components/misc/Select";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { handleError } from "@/utils/helpers";
import { useSelector, useDispatch } from "react-redux";
import { getGames } from "@/stores/features/ajaxFeature";

function Edit({ onSubmitSuccess, record, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Get games from Redux store
  const { games: gamesFromStore, loading: gamesLoading } = useSelector((state) => state.ajax);

  // Convert games to select options
  const games = gamesFromStore ? gamesFromStore.map(game => ({
    value: game.id,
    label: game.name
  })) : [];

  useEffect(() => {
    if (!gamesFromStore) {
      dispatch(getGames());
    }
  }, [gamesFromStore, dispatch]);

  useEffect(() => {
    if (games.length > 0 && record.game_id) {
      const gameOption = games.find(game => game.value === record.game_id);
      setSelectedGame(gameOption || null);
    }
  }, [games, record.game_id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      if (selectedGame) {
        formData.append('game_id', selectedGame.value);
      }
      const response = await axiosClient.post("game_assets/update", formData);
      toast.success(response.data.message);
      onSubmitSuccess?.();
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Update Game Asset")}</DialogTitle>
        </DialogHeader>

        <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="game_id" className="block text-sm font-medium">
                {t("Game")}
              </label>
              <ShadcnSelect
                options={games}
                value={selectedGame}
                onChange={setSelectedGame}
                placeholder={t("Select Game")}
                isSearchable
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                {t("Asset Name")}
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={record.name}
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium">
                {t("Asset Image")}
              </label>
              <div className="flex flex-col gap-2">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                
                {/* Show current image or preview */}
                <div className="mt-2">
                  {imagePreview ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t("New Image Preview:")}</p>
                      <img
                        src={imagePreview}
                        alt="New Preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  ) : record.image ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t("Current Image:")}</p>
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}${record.image}`}
                        alt={record.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("No image uploaded")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <input type="hidden" name="id" defaultValue={record.id} />
          
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t("Close")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || !selectedGame}>
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                t("Save Changes")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Edit; 