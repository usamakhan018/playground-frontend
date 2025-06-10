import { Separator } from "@/components/ui/separator"

import { AppSidebar } from "@/components/admin/Layouts/Includes/app-sidebar"
import {
  SidebarInset,
} from "@/components/ui/sidebar"


export default function AdminSidebar() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Separator orientation="vertical" className="" />
      </SidebarInset>
    </>
  )
}

