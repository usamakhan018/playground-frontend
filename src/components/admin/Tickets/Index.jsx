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
import { Link, useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { toast } from 'react-hot-toast';
import { EditIcon, MoreHorizontal, RefreshCw, Trash2Icon, SearchIcon, FileText, QrCode, Ticket, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Create from "./Create";
import ValidateTicket from "./ValidateTicket";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import DeleteAlert from "@/components/misc/DeleteAlert";
import { useTranslation } from "react-i18next";

const TicketIndex = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [showRefresh, setShowRefresh] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const accessAbility = can("Ticket access");
  const createAbility = can("Ticket create");
  const deleteAbility = can("Ticket delete");

  useEffect(() => {
    if (!accessAbility) navigate("/unauthorized");
    fetchTickets(currentPage);
  }, [currentPage]);

  const fetchTickets = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`tickets?page=${page}`);
      setLinks(response.data.data.links);
      setTickets(response.data.data.data);
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
      const response = await axiosClient.get(`tickets?query=${search.trim()}`);
      setTickets(response.data.data);
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
    fetchTickets();
  };

  // const handlePrintTickets = () => {
  //   const printUrl = ``;
  //   window.open(printUrl, '_blank', 'width=800,height=600');
  //   toast.success(t("Print page opened successfully"));
  // };

  const getStatusBadge = (ticket) => {
    if (ticket.is_used) {
      return <Badge variant="used">{t("Used")}</Badge>;
    }
    if (ticket.status === 'available') {
      return <Badge variant="available">{t("Available")}</Badge>;
    }
    if (ticket.status === 'sold') {
      return <Badge variant="sold">{t("Sold")}</Badge>;
    }
    return <Badge variant="default">{ticket.status}</Badge>;
  };

  return (
    <div className="space-y-3">
      <PageTitle title={t("Tickets")} />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {createAbility && <Create onSubmitSuccess={fetchTickets} />}
          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => {
              const link = document.createElement('a');
              link.href = `${axiosClient.defaults.baseURL}tickets/unused-pdf`;
              link.download = 'unused_tickets.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success(t("PDF download started"));
            }}
          >
            <Printer className="w-4 h-4" />
            <span>{t("Download PDF")}</span>
          </Button>
          <ValidateTicket />
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex gap-2">
            <Input
              id="search"
              name="search"
              value={search}
              placeholder={t("Search tickets")}
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
              <TableHead>{t("Barcode")}</TableHead>
              <TableHead>{t("Status")}</TableHead>
              <TableHead>{t("Game")}</TableHead>
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
            ) : tickets.length > 0 ? (
              tickets.map((ticket, index) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-mono">{ticket.barcode || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(ticket)}</TableCell>
                  <TableCell>{ticket.game?.name || 'N/A'}</TableCell>
                  <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
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
                        {deleteAbility && ticket.status === 'available' && !ticket.is_used && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedRecord(ticket);
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
          onSubmitSuccess={fetchTickets}
          record={selectedRecord}
          api="tickets/delete"
        />
      )}
    </div>
  );
};

export default TicketIndex; 