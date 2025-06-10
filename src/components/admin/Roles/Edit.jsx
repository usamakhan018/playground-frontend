import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { useTranslation } from "react-i18next";

function RoleEdit() {
  const [isLoading, setIsLoading] = useState(false);
  const [perms, setPerms] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [role, setRole] = useState({})

  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const { t } = useTranslation()



  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget)
      const response = await axiosClient.post("roles/update", formData);
      toast.success(response.data.message);
      navigate('/roles')
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const roleResponse = await axiosClient.post("roles/edit/" + params.id);
      const fetchedRole = roleResponse.data.data;
      setRole(fetchedRole);

      const permsResponse = await axiosClient.get("permissions/all");
      const permissions = permsResponse.data.data;

      const updatedPerms = permissions.map((perm) => ({
        ...perm,
        checked: fetchedRole.permissions?.some((p) => p.id === perm.id) || false,
      }));

      setPerms(updatedPerms);
      setSelectAll(updatedPerms.every((perm) => perm.checked));
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false);
    }
  };



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

  console.log(perms)

  return (
    <div>
      <Card className="">
        <CardHeader>
          <CardTitle>{t("Update Role")}</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <CardContent>
            {isLoading ? <Loader className="" /> : <>
              <div className="grid grid-cols-1 gap-4 mt-2">
                <div>
                  <label htmlFor="name">{t("Name")}</label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={role.name}
                  />
                </div>
              </div>
              <br />
              {perms &&
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAll} />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    Select All
                  </label>
                </div>
              }
              <div className="grid grid-cols-4 gap-4 mt-2">
                {perms && perms.map((perm, index) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={perm.id}
                      name="permissions[]"
                      value={perm.id}
                      checked={perm.checked}
                      onCheckedChange={() => handleCheckboxChange(perm.id)}
                    />
                    <label
                      htmlFor={perm.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {perm.name}
                    </label>
                  </div>
                ))}
              </div>
              <input type="hidden" name="id" value={role.id} />
            </>}
          </CardContent>
          <CardFooter>
            {perms && !isLoading &&
              <Button type="submit" className="mt-4 ml-2" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("Save Changes")
                )}
              </Button>}
          </CardFooter>
        </form>
      </Card>
    </div >
  );
}

export default RoleEdit