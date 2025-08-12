"use client"

import { useState } from "react"
import {
  Download,
  FileText,
  Search,
  TrendingUp,
  Clock,
  Car,
  Fuel,
  BarChart3,
  PieChart,
  Activity,
  Navigation2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const reportData = {
  summary: {
    totalTrips: 156,
    totalDistance: "2,847 km",
    totalFuelUsed: "342 liters",
    averageSpeed: "32 km/h",
    totalIdleTime: "18h 45m",
    co2Emissions: "810 kg",
  },
  topVehicles: [
    {
      id: "TRK001",
      name: "Delivery Truck Alpha",
      trips: 45,
      distance: "892 km",
      fuelEfficiency: "8.2 km/l",
      uptime: "94%",
    },
    {
      id: "VAN002",
      name: "Service Van Beta",
      trips: 38,
      distance: "654 km",
      fuelEfficiency: "9.1 km/l",
      uptime: "97%",
    },
    {
      id: "TRK003",
      name: "Cargo Truck Gamma",
      trips: 32,
      distance: "743 km",
      fuelEfficiency: "7.8 km/l",
      uptime: "89%",
    },
    {
      id: "VAN004",
      name: "Express Van Delta",
      trips: 41,
      distance: "558 km",
      fuelEfficiency: "8.9 km/l",
      uptime: "96%",
    },
  ],
  recentReports: [
    {
      id: 1,
      title: "Weekly Fleet Summary",
      type: "Summary",
      dateRange: "Dec 1-7, 2024",
      generatedOn: "Dec 8, 2024",
      status: "completed",
    },
    {
      id: 2,
      title: "Fuel Consumption Analysis",
      type: "Fuel",
      dateRange: "Nov 2024",
      generatedOn: "Dec 5, 2024",
      status: "completed",
    },
    {
      id: 3,
      title: "Driver Performance Report",
      type: "Driver",
      dateRange: "Nov 15-30, 2024",
      generatedOn: "Dec 3, 2024",
      status: "completed",
    },
    {
      id: 4,
      title: "Route Optimization Report",
      type: "Routes",
      dateRange: "Nov 2024",
      generatedOn: "Dec 1, 2024",
      status: "processing",
    },
  ],
  alerts: [
    {
      id: 1,
      type: "fuel",
      message: "High fuel consumption detected in TRK003",
      severity: "warning",
      date: "Dec 7, 2024",
    },
    {
      id: 2,
      type: "maintenance",
      message: "VAN002 due for scheduled maintenance",
      severity: "info",
      date: "Dec 6, 2024",
    },
    {
      id: 3,
      type: "speed",
      message: "Multiple speeding incidents - TRK001",
      severity: "error",
      date: "Dec 5, 2024",
    },
  ],
}

export function ReportsPageClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [selectedReportType, setSelectedReportType] = useState("all")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Processing</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-red-500"
      case "warning":
        return "bg-yellow-500"
      case "info":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fleet Reports</h1>
          <p className="text-muted-foreground">Comprehensive analytics and reporting for your fleet</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary.totalTrips}</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Navigation2 className="h-4 w-4 text-muted-foreground" /> {/* Changed from MapPin to Navigation2 */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary.totalDistance}</div>
            <p className="text-xs text-muted-foreground">+8% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Consumed</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary.totalFuelUsed}</div>
            <p className="text-xs text-muted-foreground">-3% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary.averageSpeed}</div>
            <p className="text-xs text-muted-foreground">+2% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Idle Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary.totalIdleTime}</div>
            <p className="text-xs text-muted-foreground">-15% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Emissions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary.co2Emissions}</div>
            <p className="text-xs text-muted-foreground">-5% from last period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Vehicle Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Vehicles</CardTitle>
            <CardDescription>Vehicle performance metrics for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Car className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{vehicle.name}</p>
                      <p className="text-sm text-muted-foreground">{vehicle.id}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{vehicle.trips}</p>
                      <p className="text-muted-foreground">Trips</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{vehicle.distance}</p>
                      <p className="text-muted-foreground">Distance</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{vehicle.fuelEfficiency}</p>
                      <p className="text-muted-foreground">Efficiency</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{vehicle.uptime}</p>
                      <p className="text-muted-foreground">Uptime</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Important notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {reportData.alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(alert.severity)}`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Generated reports and analytics</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="fuel">Fuel</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="routes">Routes</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate New
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{report.dateRange}</span>
                      <span>•</span>
                      <span>Generated on {report.generatedOn}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{report.type}</Badge>
                  {getStatusBadge(report.status)}
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Generation</CardTitle>
          <CardDescription>Generate common reports with one click</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <BarChart3 className="h-6 w-6" />
              <span>Fleet Summary</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Fuel className="h-6 w-6" />
              <span>Fuel Analysis</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <PieChart className="h-6 w-6" />
              <span>Driver Performance</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Navigation2 className="h-6 w-6" /> {/* Changed from MapPin to Navigation2 */}
              <span>Route Optimization</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
