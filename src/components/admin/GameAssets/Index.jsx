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
import { EditIcon, MoreHorizontal, RefreshCw, Trash2Icon, SearchIcon, Eye, Printer } from "lucide-react";
import Edit from "./Edit";
import Create from "./Create";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import DeleteAlert from "@/components/misc/DeleteAlert";
import { useTranslation } from "react-i18next";
import ImagePreview from "@/components/misc/ImagePreview";
import BarcodeGenerator from "@/components/misc/BarcodeGenerator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const GameAssetIndex = () => {
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [gameAssets, setGameAssets] = useState([]);
    const [search, setSearch] = useState("");
    const [showRefresh, setShowRefresh] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false);
    const [selectedAssetForBarcode, setSelectedAssetForBarcode] = useState(null);

    const navigate = useNavigate();
    const { t } = useTranslation();

    const accessAbility = can("Game Asset access");
    const createAbility = can("Game Asset create");
    const updateAbility = can("Game Asset update");
    const deleteAbility = can("Game Asset delete");

    useEffect(() => {
        if (!accessAbility) navigate("/unauthorized");
        fetchGameAssets(currentPage);
    }, [currentPage]);

    const fetchGameAssets = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`game_assets?page=${page}`);
            setLinks(response.data.data.links);
            setGameAssets(response.data.data.data);
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
            const response = await axiosClient.get(`game_assets?query=${search.trim()}`);
            setGameAssets(response.data.data);
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
        fetchGameAssets();
    };

    return (
        <div className="space-y-3">
            <PageTitle title={t("Game Assets")} />

            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    {createAbility && <Create onSubmitSuccess={fetchGameAssets} />}
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
                            <TableHead>{t("Barcode")}</TableHead>
                            <TableHead>{t("Asset Name")}</TableHead>
                            <TableHead>{t("Game")}</TableHead>
                            <TableHead className="text-right">{t("Actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    <Loader />
                                </TableCell>
                            </TableRow>
                        ) : gameAssets.length > 0 ? (
                            gameAssets.map((gameAsset, index) => (
                                <TableRow key={gameAsset.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        {gameAsset.image ? (
                                            <ImagePreview
                                                src={`${import.meta.env.VITE_BASE_URL}${gameAsset.image}`}
                                                alt={gameAsset.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <Eye className="h-6 w-6 text-gray-500" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>{gameAsset.barcode}</TableCell>
                                    <TableCell>{gameAsset.name}</TableCell>
                                    <TableCell>{gameAsset.game?.name || t("N/A")}</TableCell>
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
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedAssetForBarcode(gameAsset);
                                                    setBarcodeDialogOpen(true);
                                                }}>
                                                    <Printer className="mr-2 h-4 w-4" />
                                                    {t("Print Barcode")}
                                                </DropdownMenuItem>
                                                {updateAbility && (
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedRecord(gameAsset);
                                                        setEditDialogOpen(true);
                                                    }}>
                                                        <EditIcon className="mr-2 h-4 w-4" />
                                                        {t("Edit")}
                                                    </DropdownMenuItem>
                                                )}
                                                {deleteAbility && (
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedRecord(gameAsset);
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
                                <TableCell colSpan={5} className="text-center h-24">
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
                    onSubmitSuccess={fetchGameAssets}
                    record={selectedRecord}
                    api="game_assets/delete"
                />
            )}

            {editDialogOpen && (
                <Edit
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    onSubmitSuccess={fetchGameAssets}
                    record={selectedRecord}
                />
            )}

            {barcodeDialogOpen && selectedAssetForBarcode && (
                <Dialog open={barcodeDialogOpen} onOpenChange={setBarcodeDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Printer className="h-5 w-5" />
                                {t("Print Barcode")}
                            </DialogTitle>
                            <DialogDescription>
                                {t("Generate and print barcode for")} {selectedAssetForBarcode.name}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4">
                            <BarcodeGenerator
                                value={selectedAssetForBarcode.barcode}
                                label={`${selectedAssetForBarcode.name} - ${selectedAssetForBarcode.game?.name || t("N/A")}`}
                                showPrintButton={true}
                                showDownloadButton={true}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default GameAssetIndex; 