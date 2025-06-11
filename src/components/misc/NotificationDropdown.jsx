import { Bell, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import axiosClient from "@/axios"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { humanizeText } from "@/utils/helpers"

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState([])

    const { t } = useTranslation()

    useEffect(() => {
        axiosClient.get(`notifications`).then((response) => {
            setNotifications(response.data.data.data)
        });
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                    <span className="sr-only">{t("Notifications")}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <ScrollArea className="max-h-[300px] w-full p-2">
                    {notifications?.length > 0 ? (
                        notifications.map((notification) => (
                            <Link key={notification.id} to="/notifications">
                                <DropdownMenuItem>
                                    <div className="flex items-start space-x-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {notification.data?.message}
                                            </p>
                                            {/* <p className="text-sm text-muted-foreground">
                                                {humanizeText(notification.type)}
                                            </p> */}
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            </Link>
                        ))
                    ) : (
                        <span className="block w-full text-center text-sm text-muted-foreground">
                            {t("No Notifications")}
                        </span>
                    )}
                </ScrollArea>
                <Link to={`/notifications`}>
                    <DropdownMenuItem className="cursor-pointer">
                        <div className="flex items-center justify-between w-full">
                            <span>{t("More notifications...")}</span>
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
