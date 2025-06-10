import axiosClient from "@/axios";
import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import PageTitle from "../Layouts/PageTitle";
import NoRecordFound from "../../NoRecordFound";
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
import { Badge } from "@/components/ui/badge"
import { Link, useNavigate } from "react-router-dom"
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { toast } from 'react-hot-toast';
import { EditIcon, MoreHorizontal, Plus, RefreshCcw, Trash2Icon } from "lucide-react";
import { can, handleError } from "@/utils/helpers";
import DeleteAlert from "@/components/misc/DeleteAlert";
import Loader from "@/components/Loader";
import { useTranslation } from "react-i18next";

const RoleIndex = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [refreshBtn, setRefreshBtn] = useState(false)

  // Edit & Delete & Pagination Logic - Start
  const [selectedRecord, setselectedRecord] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false)

  const navigate = useNavigate()
  const { t } = useTranslation()

  const accessAbility = can("Role access")
  const createAbility = can("Role create")
  const updateAbility = can("Role update")
  const deleteAbility = can("Role delete")

  useEffect(() => {
    if (!accessAbility) {
      navigate("unauthorized")
    }

    fetchRoles(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchRoles = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`roles?page=${pageNumber}`);
      setLinks(response.data.data.links);
      setRoles(response.data.data.data);
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false);
    }
  };


  // DELETE ALERT
  const openDeleteAlert = (record) => {
    setselectedRecord(record);
    setDeleteAlert(true);
  };

  const closeDeleteAlert = () => {
    setselectedRecord(null);
    setDeleteAlert(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search || search.trim() === "") {
      return;
    }
    setLoading(true);
    setRefreshBtn(true)
    try {
      const response = await axiosClient.get(`roles?query=${search}`);
      setRoles(response.data.data);
      setLinks([])
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearch("")
    setRefreshBtn(false)
    fetchRoles()
  }

  const handleSubmitSuccess = () => {
    fetchRoles();
  };

  return (
    <div>
      <PageTitle title={t("Roles")} />
      <div className="flex justify-between mt-2">
        <div>
          <div>
            {createAbility &&
              <Link to={'create'}>
                <Button
                  type="button"
                  className="flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t("Create Role")}</span>
                </Button>
              </Link>}
          </div>
        </div>

        <form action="" onSubmit={handleSearch}>
          <div className="flex space-x-2">
            <Input name="search" type="text" className="w-[200px]" value={search} id="search" placeholder={t("Search")} onChange={e => setSearch(e.target.value)} />
            <Button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
              </svg>
            </Button>
            {refreshBtn &&
              <Button type="button" style={{ background: "#f59e0b" }} onClick={handleRefresh}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
            }
          </div>
        </form>
      </div>

      <div className="shadow-md p-4 mt-2 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>{t("Name")}</TableHead>
              <TableHead>{t("Permissions")}</TableHead>
              <TableHead className="text-right">{t("Action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {loading ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : roles && roles.length > 0 ? (
              roles?.map((role, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    {role?.permissions?.map((permission, index) => (
                      <Badge key={index} style={{ margin: "2px 2px" }}>{permission.name}</Badge>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" className="h-10 w-10 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuSeparator />
                        {updateAbility &&
                          <Link to={'/roles/edit/' + role.id}>
                            <DropdownMenuItem>
                              <EditIcon className="p-1" /> {t("Edit")}
                            </DropdownMenuItem>
                          </Link>
                        }

                        {deleteAbility &&
                          <DropdownMenuItem
                            onClick={() => openDeleteAlert(role)}
                          >
                            <Trash2Icon className="p-1" /> {t("Delete")}
                          </DropdownMenuItem>
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center">
                  <NoRecordFound />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination
          links={links}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {deleteAlert && (
        <DeleteAlert
          onSubmitSuccess={handleSubmitSuccess}
          record={selectedRecord}
          onClose={closeDeleteAlert}
          api={'roles/delete'}
        />
      )}
    </div >
  );

}

export default RoleIndex


