import { useSelector } from "react-redux";
import { format } from "date-fns";
import toast from "react-hot-toast";
import axiosClient from "@/axios";

export const can = (permissionName) => {
    const user = useSelector((state) => state.auth.user);
    const userPermissions = user?.role?.permissions || [];

    if (user?.role?.name === "Super Admin") {
        return true;
    }

    return userPermissions.some((permission) => permission.name === permissionName);
};


export const hasRole = (role) => {
    const user = useSelector((store) => store.auth.user);
    if (!user || !user.role || !user.role.name) {
        console.error("Error.");
        return false;
    }
    return user?.role?.name.toLowerCase() === role.toLowerCase();
};

export const hasNotRole = (roles) => {
    const user = useSelector((store) => store.auth.user);

    if (!user || !user.role || !user.role.name) {
        console.error("Error: User role not found.");
        return false;
    }

    const userRole = user.role.name.toLowerCase();

    if (Array.isArray(roles)) {
        return !roles.some((role) => role.toLowerCase() === userRole);
    }

    return roles.toLowerCase() !== userRole;
};

export const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getMonth = (createdAt) => {
    const date = new Date(createdAt);

    if (isNaN(date)) {
        throw new Error("Invalid date format");
    }

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return monthNames[date.getMonth()];
};

export const truncateWord = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
        ? words.slice(0, wordLimit).join(" ") + "..."
        : text;
};

export const truncateText = (text, charLimit) => {
    return text.length > charLimit ? text.slice(0, charLimit) + "..." : text;
};

export const monthList = () => {
    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ];
    return months;
};

export const dateFormat = (date, dateFormat) => {
    return dateFormat == "datetime"
        ? format(new Date(date), "dd MMM yyyy HH:mm")
        : format(new Date(date), "HH:mm");
};

export const handleError = (error) => {
    if (error.response) {
        const { data } = error.response;
        if (data.errors) {
            Object.values(data.errors)
                .flat()
                .forEach((message) => {
                    console.error(message);
                    toast.error(message);
                });
        } else if (data.message) {
            console.error(data.message);
            toast.error(data.message);
        } else {
            console.error("An error occurred:", data);
            toast.error("An error occurred. Please try again.");
        }
    } else if (error.request) {
        console.error("Server is not responding:", error.message);
        toast.error("The server is not responding. Please try again later.");
    } else {
        console.error("Unexpected error:", error.message);
        toast.error(`Unexpected error: ${error.message}`);
    }
};


export async function getSelectData(api) {
    const response = await axiosClient.get(api)
    console.log(response.data)
    return response.data
}

export async function fileDownloader({ url, fileName }) {
    try {
        const response = await axiosClient.get(url, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);

        return true;
    } catch (error) {
        console.error('Download failed:', error);
        throw error;
    }
}

export function humanizeRoom(room) {
    return `Room #${room.room_no} - ${room.property.name} · ${room.capacity} guests`;
}

export const humanizeText = (text) => {
    return text
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};


export const sleep = ms => new Promise(res => setTimeout(res, ms));