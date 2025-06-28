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
import { EditIcon, MoreHorizontal, RefreshCw, Trash2Icon, SearchIcon } from "lucide-react";
import Edit from "./Edit";
import Create from "./Create";
import { can, handleError, humanizeText } from "@/utils/helpers";
import Loader from "@/components/Loader";
import DeleteAlert from "@/components/misc/DeleteAlert";
import { useTranslation } from "react-i18next";

const HotelExpenseIndex = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelExpenses, setHotelExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [showRefresh, setShowRefresh] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const accessAbility = can("Hotel Expense access");
  const createAbility = can("Hotel Expense create");
  const updateAbility = can("Hotel Expense update");
  const deleteAbility = can("Hotel Expense delete");

  useEffect(() => {
    if (!accessAbility) navigate("/unauthorized");
    fetchHotelExpenses(currentPage);
  }, [currentPage]);

  const fetchHotelExpenses = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`hotel_expenses?page=${page}`);
      setLinks(response.data.data.links);
      setHotelExpenses(response.data.data.data);
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
      const response = await axiosClient.get(`hotel_expenses?query=${search.trim()}`);
      setHotelExpenses(response.data.data);
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
    fetchHotelExpenses();
  };

  return (
    <div className="space-y-3">
      <PageTitle title={t("Hotel Expenses")} />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          {createAbility && <Create onSubmitSuccess={fetchHotelExpenses} />}
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
              <TableHead>{t("User")}</TableHead>
              <TableHead>{t("Category")}</TableHead>
              <TableHead>{t("Amount")}</TableHead>
              <TableHead>{t("Description")}</TableHead>
              <TableHead>{t("Payment Method")}</TableHead>
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
            ) : hotelExpenses.length > 0 ? (
              hotelExpenses.map((hotelExpense, index) => (
                <TableRow key={hotelExpense.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{hotelExpense.user?.name || '-'}</TableCell>
                  <TableCell>{hotelExpense.expense_category?.name || '-'}</TableCell>
                  <TableCell>${hotelExpense.amount}</TableCell>
                  <TableCell>{hotelExpense.description || '-'}</TableCell>
                  <TableCell>{humanizeText(hotelExpense.payment_method) || '-'}</TableCell>
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
                            setSelectedRecord(hotelExpense);
                            setEditDialogOpen(true);
                          }}>
                            <EditIcon className="mr-2 h-4 w-4" />
                            {t("Edit")}
                          </DropdownMenuItem>
                        )}
                        {deleteAbility && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedRecord(hotelExpense);
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

      {deleteAlertOpen && (
        <DeleteAlert
          open={deleteAlertOpen}
          onClose={setDeleteAlertOpen}
          onSubmitSuccess={fetchHotelExpenses}
          record={selectedRecord}
          api="hotel_expenses/delete"
        />
      )}

      {editDialogOpen && (
        <Edit
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmitSuccess={fetchHotelExpenses}
          record={selectedRecord}
        />
      )}
    </div>
  );
};

export default HotelExpenseIndex;