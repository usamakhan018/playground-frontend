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
import { EditIcon, MoreHorizontal, RefreshCw, Trash2Icon, SearchIcon, DollarSign } from "lucide-react";
import Edit from "./Edit";
import Create from "./Create";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import DeleteAlert from "@/components/misc/DeleteAlert";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import ImagePreview from "@/components/misc/ImagePreview";

const ProductIndex = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showRefresh, setShowRefresh] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const accessAbility = can("Product access");
  const createAbility = can("Product create");
  const updateAbility = can("Product update");
  const deleteAbility = can("Product delete");

  useEffect(() => {
    if (!accessAbility) navigate("/unauthorized");
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`products?page=${page}`);
      setLinks(response.data.data.links);
      setProducts(response.data.data.data);
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
      const response = await axiosClient.get(`products?query=${search.trim()}`);
      setProducts(response.data.data);
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
    fetchProducts();
  };

  return (
    <div className="space-y-3">
      <PageTitle title={t("Products")} />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          {createAbility && <Create onSubmitSuccess={fetchProducts} />}
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
              <TableHead>{t("Product Name")}</TableHead>
              <TableHead>{t("Category")}</TableHead>
              <TableHead>{t("Price")}</TableHead>
              <TableHead>{t("Status")}</TableHead>
              <TableHead>{t("Image")}</TableHead>
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                      {product.category?.name || t("N/A")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                      <span className="font-medium">{product.price}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.status === 'available' ? 'available' : 'unavailable'}>
                      {product.status === 'available' ? t("Available") : t("Unavailable")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.image ? (
                      <ImagePreview
                        src={`${import.meta.env.VITE_BASE_URL}${product.image}`} 
                        alt={product.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">{t("No image uploaded")}</span>
                    )}
                  </TableCell>
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
                        {updateAbility && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedRecord(product);
                            setEditDialogOpen(true);
                          }}>
                            <EditIcon className="mr-2 h-4 w-4" />
                            {t("Edit")}
                          </DropdownMenuItem>
                        )}
                        {deleteAbility && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedRecord(product);
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
                <TableCell colSpan={7} className="text-center h-24">
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

      {editDialogOpen && selectedRecord && (
        <Edit
          record={selectedRecord}
          onSubmitSuccess={fetchProducts}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedRecord(null);
          }}
        />
      )}

      {deleteAlertOpen && (
        <DeleteAlert
          open={deleteAlertOpen}
          onClose={setDeleteAlertOpen}
          onSubmitSuccess={fetchProducts}
          record={selectedRecord}
          api="products/delete"
        />
      )}
    </div>
  );
};

export default ProductIndex; 