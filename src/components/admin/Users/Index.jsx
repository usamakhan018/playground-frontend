import axiosClient from "@/axios";
import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import PageTitle from "../Layouts/PageTitle";
import NoRecordFound from "../../NoRecordFound";
import {
  Table,
  TableBody,
  TableCaption,
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
import { Link } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { toast } from 'react-hot-toast';
import { EditIcon, EyeIcon, MoreHorizontal, RefreshCcw, Trash2Icon } from "lucide-react";
import Edit from "./Edit";
import Create from "./Create";
import Password from "./Password";
import View from "./View";
import DeleteAlert from "@/components/misc/DeleteAlert";
import { can, handleError } from "@/utils/helpers";
import Loader from "@/components/Loader";
import { t } from "i18next";

const UserIndex = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [refreshBtn, setRefreshBtn] = useState(false)
  const [deleteAlert, setDeleteAlert] = useState(false)

  // Edit & Delete & Pagination Logic - Start
  const [selectedRecord, setselectedRecord] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);

  const accessAbility = can("User access")
  const createAbility = can("User create")
  const updateAbility = can("User update")
  const deleteAbility = can("User delete")

  const openViewDialog = (record) => {
    setselectedRecord(record);
    setViewDialogOpen(true);
  };

  const openEditDialog = (record) => {
    setselectedRecord(record);

    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setselectedRecord(null);
    setEditDialogOpen(false);
  };

  const openPasswordDialog = (record) => {
    setselectedRecord(record);

    setPasswordDialog(true);
  };

  const closePasswordDialog = () => {
    setselectedRecord(null);
    setPasswordDialog(false);
  };

  const closeViewDialog = () => {
    setselectedRecord(null);
    setViewDialogOpen(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Edit & Delete & Pagination Logic - End

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`users?page=${pageNumber}`);
      setLinks(response.data.data.links);
      setUsers(response.data.data.data);
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
    setLoading(true);
    setRefreshBtn(true)
    try {
      const response = await axiosClient.get(`users?query=${search}`);
      setUsers(response.data.data);
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
    fetchUsers()
  }

  const handleSubmitSuccess = () => {
    fetchUsers(currentPage);
  };

  return (
    <div>
      <PageTitle title={t("Users")} />
      <div className="flex justify-between mt-2">
        {createAbility && <div>
          <Create onSubmitSuccess={handleSubmitSuccess} />
        </div>}


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
              <TableHead>{t("Email")}</TableHead>
              <TableHead>{t("Phone")}</TableHead>
              <TableHead>{t("Role")}</TableHead>
              <TableHead>{t("View")}</TableHead>
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
            ) : users && users.length > 0 ? (
              users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.roles[0]?.name}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => openViewDialog(user)}
                      className="mr-2 py-[4px] px-2 border hover:opacity-50 rounded"
                    >
                      <EyeIcon></EyeIcon>{" "}
                    </button>
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
                        {updateAbility && <DropdownMenuItem
                          onClick={() => openEditDialog(user)}
                        >
                          <EditIcon className="p-1" /> Edit
                        </DropdownMenuItem>}
                        {updateAbility &&
                          <DropdownMenuItem
                            onClick={() => openPasswordDialog(user)}
                          >
                            <EditIcon className="p-1" /> Update Password
                          </DropdownMenuItem>}
                        {deleteAbility &&
                          <DropdownMenuItem
                            onClick={() => openDeleteAlert(user)}
                          >
                            <Trash2Icon className="p-1" /> Delete
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
        {/* <Pagination links={links} /> */}
        <Pagination
          links={links}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {viewDialogOpen && (
        <View record={selectedRecord} onClose={closeViewDialog} />
      )}

      {editDialogOpen && (
        <Edit
          onSubmitSuccess={handleSubmitSuccess}
          record={selectedRecord}
          onClose={closeEditDialog}
        />
      )}

      {passwordDialog && (
        <Password
          onSubmitSuccess={handleSubmitSuccess}
          record={selectedRecord}
          onClose={closePasswordDialog}
        />
      )}

      {deleteAlert && (
        <DeleteAlert
          onSubmitSuccess={handleSubmitSuccess}
          record={selectedRecord}
          onClose={closeDeleteAlert}
          api={'users/delete'}
        />
      )}
    </div>
  );


  // return (
  //   <div>User index <hr />
  //     <Link to={'create'}>Create User</Link><hr />
  //     <Link to={'edit'}>Update User</Link><hr />


  //     <ul>
  //       {users && users.map((user, index) => (  
  //         <li key={index}><h3>{user.name}</h3></li>
  //       ))}

  //     </ul>
  //   </div>
  // )
}

export default UserIndex
