// This page is a placeholder for the Reports section in the Admin Dashboard.
// You can integrate the existing ReportsPage component here or create a new one
// tailored for admin-specific reporting needs.

import { ReportsPageClient } from "@/components/clients/reports-page" 

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Admin Reports</h1>
      <p className="text-muted-foreground">Access and generate comprehensive reports for fleet and user activity.</p>
      <ReportsPageClient /> {/* Reusing the existing ReportsPage component */}
    </div>
  )
}
