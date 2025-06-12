import axiosClient from "@/axios";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PageTitle from "../Layouts/PageTitle";
import NoRecordFound from "@/components/NoRecordFound";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { toast } from 'react-hot-toast';
import { EditIcon, MoreHorizontal, RefreshCw, Trash2Icon, SearchIcon, Eye, Package } from "lucide-react";
import Edit from "./Edit";
import Create from "./Create";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import DeleteAlert from "@/components/misc/DeleteAlert";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GameAssetCreate from "../GameAssets/Create";
import GameAssetEdit from "../GameAssets/Edit";
import DeleteAlert2 from "@/components/misc/DeleteAlert";
import ImagePreview from "@/components/misc/ImagePreview";

const GameIndex = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [showRefresh, setShowRefresh] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [gameAssetsDialogOpen, setGameAssetsDialogOpen] = useState(false);
  const [selectedGameForAssets, setSelectedGameForAssets] = useState(null);
  const [gameAssets, setGameAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetEditDialogOpen, setAssetEditDialogOpen] = useState(false);
  const [assetDeleteAlertOpen, setAssetDeleteAlertOpen] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const accessAbility = can("Game access");
  const createAbility = can("Game create");
  const updateAbility = can("Game update");
  const deleteAbility = can("Game delete");
  const assetAccessAbility = can("Game Asset access");
  const assetCreateAbility = can("Game Asset create");
  const assetUpdateAbility = can("Game Asset update");
  const assetDeleteAbility = can("Game Asset delete");

  useEffect(() => {
    if (!accessAbility) navigate("/unauthorized");
    fetchGames(currentPage);
  }, [currentPage]);

  const fetchGames = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`games?page=${page}`);
      setLinks(response.data.data.links);
      setGames(response.data.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    setShowRefresh(true);
    try {
      const response = await axiosClient.get(`games?query=${search.trim()}`);
      setGames(response.data.data);
      setLinks([]);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearch("");
    setShowRefresh(false);
    fetchGames();
  };

  const fetchGameAssets = async (gameId) => {
    setAssetsLoading(true);
    try {
      const response = await axiosClient.get(`game_assets/by-game/${gameId}`);
      setGameAssets(response.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setAssetsLoading(false);
    }
  };

  const handleViewAssets = (game) => {
    setSelectedGameForAssets(game);
    setGameAssetsDialogOpen(true);
    fetchGameAssets(game.id);
  };

  const handleAssetCreate = () => {
    fetchGameAssets(selectedGameForAssets.id);
  };

  const handleAssetEdit = () => {
    fetchGameAssets(selectedGameForAssets.id);
  };

  return (
    <div className="space-y-3">
      <PageTitle title={t("Games")} />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          {createAbility && <Create onSubmitSuccess={fetchGames} />}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex gap-2">
            <Input
              id="search"
              name="search"
              value={search}
              placeholder={t("Search")}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <Button type="submit" aria-label={t("Search")}>
              <SearchIcon className="h-4 w-4" />
            </Button>
            {showRefresh && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRefresh}
                aria-label={t("Refresh")}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>{t("Image")}</TableHead>
              <TableHead>{t("Game Name")}</TableHead>
              <TableHead>{t("Price")}</TableHead>
              <TableHead>{t("Duration")}</TableHead>
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : games.length > 0 ? (
              games.map((game, index) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {game.image ? (
                      <ImagePreview
                        src={`${import.meta.env.VITE_BASE_URL}${game.image}`} 
                        alt={game.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Eye className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{game.name}</TableCell>
                  <TableCell>${game.price}</TableCell>
                  <TableCell>{game.duration || t("N/A")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0">
                          <span className="sr-only">{t("Open menu")}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewAssets(game)}>
                          <Package className="mr-2 h-4 w-4" />
                          {t("View Assets")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {updateAbility && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedRecord(game);
                            setEditDialogOpen(true);
                          }}>
                            <EditIcon className="mr-2 h-4 w-4" />
                            {t("Edit")}
                          </DropdownMenuItem>
                        )}
                        {deleteAbility && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedRecord(game);
                            setDeleteAlertOpen(true);
                          }}>
                            <Trash2Icon className="mr-2 h-4 w-4" />
                            {t("Delete")}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  <NoRecordFound />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {links.length > 0 && (
          <Pagination
            links={links}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            className="p-4"
          />
        )}
      </div>

      {deleteAlertOpen && (
        <DeleteAlert
          open={deleteAlertOpen}
          onClose={setDeleteAlertOpen}
          onSubmitSuccess={fetchGames}
          record={selectedRecord}
          api="games/delete"
        />
      )}

      {editDialogOpen && (
        <Edit
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmitSuccess={fetchGames}
          record={selectedRecord}
        />
      )}

      {gameAssetsDialogOpen && (
        <Dialog open={gameAssetsDialogOpen} onOpenChange={setGameAssetsDialogOpen}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>{t("Game Assets")} - {selectedGameForAssets?.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t("Assets for this game")}</h3>
                {assetCreateAbility && (
                  <GameAssetCreate 
                    onSubmitSuccess={handleAssetCreate}
                    selectedGame={selectedGameForAssets}
                  />
                )}
              </div>

              <div className="bg-background">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>{t("Image")}</TableHead>
                      <TableHead>{t("Asset Name")}</TableHead>
                      <TableHead className="text-right">{t("Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetsLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                          <Loader />
                        </TableCell>
                      </TableRow>
                    ) : gameAssets.length > 0 ? (
                      gameAssets.map((asset, index) => (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            {asset.image ? (
                              <img 
                                src={`${import.meta.env.VITE_BASE_URL}${asset.image}`} 
                                alt={asset.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Eye className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-8 w-8 p-0">
                                  <span className="sr-only">{t("Open menu")}</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {assetUpdateAbility && (
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedAsset(asset);
                                    setAssetEditDialogOpen(true);
                                  }}>
                                    <EditIcon className="mr-2 h-4 w-4" />
                                    {t("Edit")}
                                  </DropdownMenuItem>
                                )}
                                {assetDeleteAbility && (
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedAsset(asset);
                                    setAssetDeleteAlertOpen(true);
                                  }}>
                                    <Trash2Icon className="mr-2 h-4 w-4" />
                                    {t("Delete")}
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                          <NoRecordFound />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {assetDeleteAlertOpen && (
        <DeleteAlert2
          open={assetDeleteAlertOpen}
          onClose={setAssetDeleteAlertOpen}
          onSubmitSuccess={handleAssetEdit}
          record={selectedAsset}
          api="game_assets/delete"
        />
      )}

      {assetEditDialogOpen && (
        <GameAssetEdit
          open={assetEditDialogOpen}
          onClose={() => setAssetEditDialogOpen(false)}
          onSubmitSuccess={handleAssetEdit}
          record={selectedAsset}
        />
      )}
    </div>
  );
};

export default GameIndex; 