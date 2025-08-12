import type React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/clients/admin-client-components/admin-sidebar" 
import { Separator } from "@/components/ui/separator"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <Suspense fallback={<div>Loading...</div>}>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
