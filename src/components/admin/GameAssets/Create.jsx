import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShadcnSelect from "@/components/misc/Select";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader, Plus } from "lucide-react";
import { handleError } from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { getGames } from "@/stores/features/ajaxFeature";

function Create({ onSubmitSuccess, selectedGame: preSelectedGame }) {
  const [showDialog, setShowDialog] = useState(false);
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
    if (showDialog && !gamesFromStore) {
      dispatch(getGames());
    }
  }, [showDialog, gamesFromStore, dispatch]);

  useEffect(() => {
    if (preSelectedGame && games.length > 0) {
      const gameOption = games.find(game => game.value === preSelectedGame.id);
      setSelectedGame(gameOption || null);
    }
  }, [preSelectedGame, games]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      if (selectedGame) {
        form.append('game_id', selectedGame.value);
      }
      const response = await axiosClient.post("game_assets/store", form);
      toast.success(response.data.message);
      onSubmitSuccess?.();
      setShowDialog(false);
      setImagePreview(null);
      setSelectedGame(null);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogChange = (open) => {
    setShowDialog(open);
    if (!open) {
      setImagePreview(null);
      setSelectedGame(null);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="w-4 h-4" />
          <span>{t("Create Game Asset")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Create Game Asset")}</DialogTitle>
        </DialogHeader>

        <form id="create-form" onSubmit={handleSubmit} className="space-y-6">
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
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

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
                t("Create")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Create; 