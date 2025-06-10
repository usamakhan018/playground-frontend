import React, { useEffect, useState } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import axiosClient from "@/axios";
import { toast } from 'react-hot-toast';
import { Loader, Loader2 } from "lucide-react";
import { handleError } from "@/utils/helpers";
import { useTranslation } from "react-i18next";


function DeleteAlert({ onSubmitSuccess, record, onClose, api, title = "Are you sure?", message = "This action cannot be undone. This will permanently delete your your data." }) {
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation()

    const handleDelete = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {

            const response = await axiosClient.post(api, {
                id: record.id,
            });

            toast.success(response.data.message);
            onClose();
            if (onSubmitSuccess) {
                onSubmitSuccess();
            }

        } catch (error) {
            handleError(error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogTrigger></AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader className="sm:max-w-[1000px]">
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{message}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isLoading} onClick={handleDelete}>
                        {isLoading ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            t("Continue")
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    );
}

export default DeleteAlert;