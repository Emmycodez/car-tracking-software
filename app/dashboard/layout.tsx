import type React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/clients/dashboard-sidebar"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Suspense fallback={<div>Loading...</div>}>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search vehicles..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live</span>
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
