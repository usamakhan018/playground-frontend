import axiosClient from "@/axios";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageTitle from "../Layouts/PageTitle";
import NoRecordFound from "@/components/NoRecordFound";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Link, useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { toast } from 'react-hot-toast';
import { 
  EditIcon, 
  MoreHorizontal, 
  RefreshCw, 
  Trash2Icon, 
  SearchIcon, 
  FileText, 
  QrCode, 
  Ticket, 
  Printer,
  Eye,
  Package,
  Users,
  Calendar,
  Hash
} from "lucide-react";
import Create from "./Create";
import ValidateTicket from "./ValidateTicket";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import DeleteAlert from "@/components/misc/DeleteAlert";
import { useTranslation } from "react-i18next";
import BatchTicketsDialog from "./BatchTicketsDialog";

const TicketBatchesIndex = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [showRefresh, setShowRefresh] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchTicketsDialogOpen, setBatchTicketsDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    total_batches: 0,
    total_tickets: 0,
    total_used_tickets: 0,
    total_available_tickets: 0
  });

  const navigate = useNavigate();
  const { t } = useTranslation();

  const accessAbility = can("Ticket access");
  const createAbility = can("Ticket create");
  const deleteAbility = can("Ticket delete");

  useEffect(() => {
    if (!accessAbility) navigate("/unauthorized");
    fetchBatches(currentPage);
  }, [currentPage]);

  const fetchBatches = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`tickets/batches?page=${page}`);
      setBatches(response.data.data.data);
      setLinks(response.data.data.links);
      
      // Calculate stats
      const batchData = response.data.data.data;
      const totalBatches = batchData.length;
      const totalTickets = batchData.reduce((sum, batch) => sum + (batch.tickets_count || 0), 0);
      
      setStats({
        total_batches: totalBatches,
        total_tickets: totalTickets,
        total_used_tickets: 0, // We'll need to get this from API if needed
        total_available_tickets: totalTickets
      });
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
      const response = await axiosClient.get(`tickets/batches?query=${search.trim()}`);
      setBatches(response.data.data);
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
    fetchBatches();
  };

  const handleViewTickets = (batch) => {
    setSelectedBatch(batch);
    setBatchTicketsDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <PageTitle title={t("Ticket Batches")} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Batches")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_batches}</div>
            <p className="text-xs text-muted-foreground">
              {t("Active batches")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Tickets")}</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_tickets}</div>
            <p className="text-xs text-muted-foreground">
              {t("All tickets in batches")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Available Tickets")}</CardTitle>
            <QrCode className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.total_available_tickets}</div>
            <p className="text-xs text-muted-foreground">
              {t("Ready to use")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Used Tickets")}</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.total_used_tickets}</div>
            <p className="text-xs text-muted-foreground">
              {t("Already used")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons and Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {createAbility && <Create onSubmitSuccess={fetchBatches} />}
          <ValidateTicket />
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex gap-2">
            <Input
              id="search"
              name="search"
              value={search}
              placeholder={t("Search batches")}
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

      {/* Batches Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>{t("Batch Name")}</TableHead>
              <TableHead className="text-center">{t("Tickets Count")}</TableHead>
              <TableHead>{t("Created By")}</TableHead>
              <TableHead>{t("Created Date")}</TableHead>
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
            ) : batches.length > 0 ? (
              batches.map((batch, index) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">
                    {((currentPage - 1) * 8) + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {batch.name || `Batch #${batch.id}`}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="gap-1">
                      <Hash className="h-3 w-3" />
                      {batch.tickets_count || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {batch.created_by?.name || 'System'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(batch.created_at)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTickets(batch)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {t("View Tickets")}
                      </Button>
                      
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
                          <DropdownMenuItem onClick={() => handleViewTickets(batch)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("View Tickets")}
                          </DropdownMenuItem>
                          {deleteAbility && (
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedRecord(batch);
                                setDeleteAlertOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2Icon className="mr-2 h-4 w-4" />
                              {t("Delete Batch")}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
      </Card>

      {/* Batch Tickets Dialog */}
      {batchTicketsDialogOpen && (
        <BatchTicketsDialog
          open={batchTicketsDialogOpen}
          onClose={() => setBatchTicketsDialogOpen(false)}
          batch={selectedBatch}
          onRefresh={fetchBatches}
        />
      )}

      {/* Delete Alert */}
      {deleteAlertOpen && (
        <DeleteAlert
          open={deleteAlertOpen}
          onClose={setDeleteAlertOpen}
          onSubmitSuccess={fetchBatches}
          record={selectedRecord}
          api="ticket-batches/delete"
        />
      )}
    </div>
  );
};

export default TicketBatchesIndex; 