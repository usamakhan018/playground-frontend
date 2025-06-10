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
import { useSelector } from "react-redux"

export default function NotificationDropdown() {

    const [notifications, setNotifications] = useState([])
    const user = useSelector(store => store.auth.user)
    const role = user.role.name == "Admin" ? 'admin' : 'company'
    useEffect(() => {
        axiosClient.get(`api/${role}/notifications`).then((response) => {

            setNotifications(response.data.data.data)
        });
    }, [
    ])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <ScrollArea className="h-[300px] w-full p-2">
                    {notifications.map((notification) => (
                        <Link key={notification.id} to={`/${role}/notifications`}>
                            <DropdownMenuItem key={notification.id} onSelect={() => handleNotificationClick(notification)}>
                                <div className="flex items-start space-x-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{notification.user.name}</p>
                                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        </Link>
                    ))}
                </ScrollArea>
                <Link to={`/${role}/notifications`}>
                    <DropdownMenuItem className="cursor-pointer">
                        <div className="flex items-center justify-between w-full">
                            <span>More notifications...</span>
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
