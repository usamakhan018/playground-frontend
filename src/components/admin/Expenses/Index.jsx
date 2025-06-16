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
      await axiosClient.delete(`expenses/${selectedRecord.id}`);
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
          <Input
            placeholder={t("Search...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="outline">
            <SearchIcon className="w-4 h-4" />
          </Button>
          {showRefresh && (
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : expenses.length === 0 ? (
        <NoRecordFound />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("User")}</TableHead>
                <TableHead>{t("Amount")}</TableHead>
                <TableHead>{t("Category")}</TableHead>
                <TableHead>{t("Description")}</TableHead>
                <TableHead>{t("Date")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead className="text-right">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.user?.name}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.category?.name}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>{expense.status}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {updateAbility && (
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedRecord(expense);
                              setEditDialogOpen(true);
                            }}
                          >
                            <EditIcon className="mr-2 w-4 h-4" />
                            {t("Edit")}
                          </DropdownMenuItem>
                        )}
                        {deleteAbility && (
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedRecord(expense);
                              setDeleteAlertOpen(true);
                            }}
                          >
                            <Trash2Icon className="mr-2 w-4 h-4" />
                            {t("Delete")}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {links.length > 0 && (
        <Pagination links={links} onPageChange={setCurrentPage} />
      )}

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

      <DeleteAlert 
        open={deleteAlertOpen}
        onClose={() => setDeleteAlertOpen(false)}
        onConfirm={handleDelete}
        title={t("Delete Expense")}
        message={t("Are you sure you want to delete this expense?")}
      />
    </div>
  );
};

export default ExpenseIndex;
