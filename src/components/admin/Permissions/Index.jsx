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

import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { toast } from 'react-hot-toast';
import { RefreshCcw } from "lucide-react";
import Loader from "@/components/Loader";
import { useTranslation } from "react-i18next";

const PermissionIndex = () => {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [permissions, setPermissions] = useState([]);
  const [search, setSearch] = useState("");
  const [refreshBtn, setRefreshBtn] = useState(false)

  const {t} = useTranslation()

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchPermissions(currentPage);
  }, [currentPage]);

  const fetchPermissions = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`permissions?page=${pageNumber}`);
      console.log(response)
      setLinks(response.data.data[0].links);
      setPermissions(response.data.data[0].data);
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true);
    setRefreshBtn(true)
    try {
      const response = await axiosClient.get(`permissions?query=${search}`);
      setPermissions(response.data.data[0]);
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
    fetchPermissions()
  }

  return (
    <div>

      <div className="flex justify-between mt-2">
        <PageTitle title={t("Permissions")} />

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
              <TableHead>{t("Guard")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {loading ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : permissions && permissions.length > 0 ? (
              permissions.map((permission, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{permission.name}</TableCell>
                  <TableCell>{permission.guard_name}</TableCell>
                  {/* <TableCell className="text-right">
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
                        <DropdownMenuItem
                          onClick={() => openEditDialog(permission)}
                        >
                          <EditIcon className="p-1" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteRecord(permission.id)}
                        >
                          <Trash2Icon className="p-1" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
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

      {/* {viewDialogOpen && (
        <View record={selectedRecord} onClose={closeViewDialog} />
      )} */}
    </div>
  );


  // return (
  //   <div>Permission index <hr />
  //     <Link to={'create'}>Create Permission</Link><hr />
  //     <Link to={'edit'}>Update Permission</Link><hr />


  //     <ul>
  //       {permissions && permissions.map((permission, index) => (  
  //         <li key={index}><h3>{permission.name}</h3></li>
  //       ))}

  //     </ul>
  //   </div>
  // )
}

export default PermissionIndex
