"use client"

import React, { useState } from "react"
import { Bike, ChevronsUpDown, Factory, LucideBike, Plus, User2Icon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"


export function SiderBarHeader({ headers, user }) {
    const { isMobile } = useSidebar()
    console.log(user)
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <LucideBike className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                            {import.meta.env.VITE_APP_NAME}
                        </span>
                        <span className="truncate text-xs">{user.role?.name}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}