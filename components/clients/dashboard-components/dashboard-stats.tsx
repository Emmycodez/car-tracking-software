import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, Car, Fuel } from 'lucide-react'
import React from 'react'
import { recentEvents, vehicles } from '.'

const DashboardStatsCards = () => {
  return (
   <div className="p-4 pb-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vehicles.length}</div>
                <p className="text-xs text-muted-foreground">Fleet size</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    vehicles.filter((v) => v.status === "driving" || v.status === "stopped" || v.status === "idling")
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((vehicles.filter((v) => v.status !== "offline").length / vehicles.length) * 100)}% of
                  fleet
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Fuel Level</CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(vehicles.reduce((acc, v) => acc + v.fuel, 0) / vehicles.length)}%
                </div>
                <p className="text-xs text-muted-foreground">Fleet average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {recentEvents.filter((e) => e.severity === "warning" || e.severity === "error").length}
                </div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </div>
        </div>
  )
}

export default DashboardStatsCards