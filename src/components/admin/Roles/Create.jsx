import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/Loader";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getRoles } from "@/stores/features/ajaxFeature";

function RoleCreate() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [perms, setPerms] = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const roles = useSelector((state) => state.ajax.roles);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      const response = await axiosClient.post(`roles/store`, form);
      toast.success(response.data.message);
      dispatch(getRoles())
      navigate('/roles');
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchPermissions()
    if (!roles) dispatch(getRoles())
  }, [])

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const updatedPerms = perms.map((perm) => ({
      ...perm,
      checked: newSelectAll,
    }));
    setPerms(updatedPerms);
  };

  const handleCheckboxChange = (id) => {
    const updatedPerms = perms.map((perm) => {
      if (perm.id == id) {
        return { ...perm, checked: !perm.checked };
      }
      return perm;
    });

    setPerms(updatedPerms);
    setSelectAll(updatedPerms.every((perm) => perm.checked));
  };

  const fetchPermissions = async () => {
    try {
      setIsLoading(true)
      const permsResponse = await axiosClient.get(`permissions/all`);
      const permissions = permsResponse.data.data;
      setPerms(permissions);
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    };
  }

  return (
    <div>
      <Card className="">
        <CardHeader>
          <CardTitle>Create new Role</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            {!perms ? <Loader /> : <>
              <div className="grid grid-cols-1 gap-4 mt-2">
                <div>
                  <label htmlFor="name">Name</label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                  />
                </div>
              </div>
              <br />
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAll} />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Select All
                </label>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-2">
                {perms && perms.map((perm, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={perm.id} name="permissions[]" value={perm.id} checked={selectAll || perm.checked} onCheckedChange={() => handleCheckboxChange(perm.id)} />
                    <label
                      htmlFor={perm.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {perm.name}
                    </label>
                  </div>
                ))}
              </div>
            </>}
          </CardContent>
          <CardFooter>
            {perms &&
              <Button type="submit" className="mt-4 ml-2" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create Role"
                )}
              </Button>}
          </CardFooter>
        </form>
      </Card>
    </div >
  );
}

export default RoleCreate;