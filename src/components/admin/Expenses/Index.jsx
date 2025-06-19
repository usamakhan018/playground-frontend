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
import { Badge } from "@/components/ui/badge";
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
import { EditIcon, MoreHorizontal, RefreshCw, Trash2Icon, SearchIcon } from "lucide-react";
import Edit from "./Edit";
import Create from "./Create";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import DeleteAlert from "@/components/misc/DeleteAlert";
import { useTranslation } from "react-i18next";

const ExpenseIndex = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [showRefresh, setShowRefresh] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const accessAbility = can("Expense access");
  const createAbility = can("Expense create");
  const updateAbility = can("Expense update");
  const deleteAbility = can("Expense delete");

  useEffect(() => {
    if (!accessAbility) navigate("/unauthorized");
    fetchExpenses(currentPage);
  }, [currentPage]);

  const fetchExpenses = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`expenses?page=${page}`);
      setLinks(response.data.data.links);
      setExpenses(response.data.data.data);
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
      const response = await axiosClient.get(`expenses?query=${search.trim()}`);
      setExpenses(response.data.data);
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
    fetchExpenses();
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;

    try {
      const formData = new FormData();
      formData.append('id', selectedRecord.id);

      await axiosClient.post('expenses/delete', formData);
      toast.success(t("Expense deleted successfully"));
      fetchExpenses(currentPage);
      setDeleteAlertOpen(false);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="space-y-3">
      <PageTitle title={t("Expenses")} />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          {createAbility && <Create onSubmitSuccess={fetchExpenses} />}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex gap-2">
            <Input
              id="search"
              name="search"
              value={search}
              placeholder={t("Search...")}
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
              <TableHead>{t("Amount")}</TableHead>
              <TableHead>{t("Category")}</TableHead>
              <TableHead>{t("Description")}</TableHead>
              <TableHead>{t("Date")}</TableHead>
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
            ) : expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{expense.user?.name}</TableCell>
                  <TableCell>OMR {expense.amount}</TableCell>
                  <TableCell>{expense.category?.name}</TableCell>
                  <TableCell className="max-w-32 truncate">{expense.description}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
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
                            setSelectedRecord(expense);
                            setEditDialogOpen(true);
                          }}>
                            <EditIcon className="mr-2 h-4 w-4" />
                            {t("Edit")}
                          </DropdownMenuItem>
                        )}
                        {deleteAbility && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedRecord(expense);
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
          onSubmitSuccess={() => {
            fetchExpenses(currentPage);
            setEditDialogOpen(false);
          }}
          onClose={() => setEditDialogOpen(false)}
        />
      )}

      {deleteAlertOpen && (
        <DeleteAlert
          open={deleteAlertOpen}
          onClose={setDeleteAlertOpen}
          onSubmitSuccess={fetchExpenses}
          record={selectedRecord}
          api="expenses/delete"
        />
      )}
    </div>
  );
};

export default ExpenseIndex;
