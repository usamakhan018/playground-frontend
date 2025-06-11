import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { t } from "i18next";

function View({ record, onClose }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader id="no-print">
          <DialogTitle>{t("User")} :: {record.name}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="grid grid-cols-1 gap-4">
          <div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("Name")}</span>
                <span>{record.name}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("Phone")}</span>
                <span>{record.phone}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("Email")}</span>
                <span>{record.email}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("Role")}</span>
                <span>{record.roles[0]?.name}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Created At</span>
                <span>{new Date(record.created_at).toLocaleString()}</span>
              </li>
              {/* <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Image</span>
                <span><Link target="_blank" to={import.meta.env.VITE_FILE_URL + '/' + record.image}><img width={"200px"} src={import.meta.env.VITE_FILE_URL + '/' + record.image} alt="" /></Link></span>
              </li> */}
            </ul>
          </div>
        </div>
        <Separator />
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default View;
