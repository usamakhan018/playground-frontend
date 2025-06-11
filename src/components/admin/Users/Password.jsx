import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader2 } from "lucide-react";

function Password({ onSubmitSuccess, record, onClose }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget)
      const response = await axiosClient.post("api/company/users/change_password", formData,);
      toast.success(response.data.message);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      onClose();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.forEach((errorMessage) => {
          toast.error(errorMessage);
        });
      } else {
        toast.error("An error occurred while submitting the form.");
      }
      console.error("Failed to submit data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader id="no-print">
          <DialogTitle>Update Password - {record.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 gap-4 mt-2">
            {/* <div>
              <label htmlFor="current_password">Current Password</label>
              <Input
                id="current_password"
                name="current_password"
                type="text"
              />
            </div> */}
            <div>
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                name="password"
                type="text"
              />
            </div>
            {/* <div>
              <label htmlFor="password_confirmation">Password Confirmation</label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="text"
              />
            </div> */}
          </div>
          <input type="hidden" name="id" value={record.id} />
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" className="mt-2 ml-2" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Password;
