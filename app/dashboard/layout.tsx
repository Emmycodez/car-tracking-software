import type React from "react"
import ConnectedToServer from "@/components/frontend/ConnectedToServer"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/clients/dashboard-sidebar"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="relative">
         <header className="flex h-16 fixed w-full bg-transparent shrink-0 items-center gap-2 px-4 z-50">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-md bg-white">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search vehicles..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <ConnectedToServer />
          </header>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
