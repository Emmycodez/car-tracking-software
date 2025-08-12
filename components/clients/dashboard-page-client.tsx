"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import {
  Car,
  MapPin,
  AlertTriangle,
  Fuel,
  Clock,
  X,
  TrendingUp,
  FileText,
  Thermometer,
  Battery,
  User,
  Navigation2,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const VehicleMap = dynamic(
  () => import("./vehicle-map").catch((error) => {
    console.error("Failed to load VehicleMap:", error)
    // Return a fallback component
    return {
      default: () => (
        <div className="h-full w-full bg-red-50 rounded-lg border-2 border-red-200 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Failed to load map</p>
            <p className="text-sm text-red-500">Check console for details</p>
          </div>
        </div>
      )
    }
  }),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Loading Map...</p>
        </div>
      </div>
    ),
  }
)

const vehicles = [
  {
    id: "TRK001",
    name: "Delivery Truck Alpha",
    licensePlate: "ABC-1234",
    driver: "John Smith",
    status: "driving",
    location: "Victoria Island, Lagos",
    speed: 65,
    lastUpdate: "2 seconds ago",
    fuel: 78,
    battery: 95,
    temperature: 72,
    ignition: true,
    coordinates: { lat: 6.4281, lng: 3.4219 }, // Victoria Island, Lagos
  },
  {
    id: "VAN002",
    name: "Service Van Beta",
    licensePlate: "XYZ-5678",
    driver: "Sarah Johnson",
    status: "stopped",
    location: "Ikeja, Lagos",
    speed: 0,
    lastUpdate: "1 minute ago",
    fuel: 92,
    battery: 88,
    temperature: 68,
    ignition: true,
    coordinates: { lat: 6.6018, lng: 3.3515 }, // Ikeja, Lagos
  },
  {
    id: "TRK003",
    name: "Cargo Truck Gamma",
    licensePlate: "DEF-9012",
    driver: "Mike Wilson",
    status: "offline",
    location: "Apapa Port, Lagos",
    speed: 0,
    lastUpdate: "2 hours ago",
    fuel: 45,
    battery: 12,
    temperature: 65,
    ignition: false,
    coordinates: { lat: 6.4395, lng: 3.3669 }, // Apapa Port, Lagos
  },
  {
    id: "VAN004",
    name: "Express Van Delta",
    licensePlate: "GHI-3456",
    driver: "Emma Davis",
    status: "idling",
    location: "Lekki Phase 1, Lagos",
    speed: 0,
    lastUpdate: "30 seconds ago",
    fuel: 67,
    battery: 91,
    temperature: 70,
    ignition: true,
    coordinates: { lat: 6.4698, lng: 3.5852 }, // Lekki Phase 1, Lagos
  },
]

const recentEvents = [
  {
    id: 1,
    vehicleId: "TRK001",
    type: "speed_alert",
    message: "Speed limit exceeded (70 mph in 65 mph zone)",
    timestamp: "2 minutes ago",
    severity: "warning",
  },
  {
    id: 2,
    vehicleId: "VAN002",
    type: "stop",
    message: "Vehicle stopped at customer location",
    timestamp: "5 minutes ago",
    severity: "info",
  },
  {
    id: 3,
    vehicleId: "TRK003",
    type: "offline",
    message: "Vehicle went offline",
    timestamp: "2 hours ago",
    severity: "error",
  },
  {
    id: 4,
    vehicleId: "VAN004",
    type: "geofence_entry",
    message: "Entered designated rest area",
    timestamp: "15 minutes ago",
    severity: "info",
  },
]

const mockHistoricalRoute = [
  { lat: 6.4281, lng: 3.4219, timestamp: "09:00 AM", event: "Trip Started - Victoria Island" },
  { lat: 6.6018, lng: 3.3515, timestamp: "09:15 AM", event: "Customer Stop - Ikeja" },
  { lat: 6.4698, lng: 3.5852, timestamp: "09:45 AM", event: "Delivery Complete - Lekki" },
  { lat: 6.4395, lng: 3.3669, timestamp: "10:30 AM", event: "Return to Depot - Apapa" },
]

const mockTripData = {
  date: "Today, Dec 8, 2024",
  totalDistance: "127.5 km",
  totalDuration: "4h 32m",
  averageSpeed: "28 km/h",
  fuelConsumed: "12.3 liters",
  stops: 5,
  idleTime: "45 minutes",
  maxSpeed: "65 km/h",
}

export default function DashboardPageClient() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [showDetailsPanel, setShowDetailsPanel] = useState(false)
  const [showHistoricalRoute, setShowHistoricalRoute] = useState(false)
  const [showTripReport, setShowTripReport] = useState(false)
  const [mapCentered, setMapCentered] = useState(false)


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "driving":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Driving</Badge>
      case "stopped":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Stopped</Badge>
      case "idling":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Idling</Badge>
      case "offline":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Offline</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleVehicleClick = (vehicleId: string) => {
    setSelectedVehicle(vehicleId)
    setShowDetailsPanel(true)
  }

  const selectedVehicleData = vehicles.find((v) => v.id === selectedVehicle)

  const handleViewHistoricalRoute = () => {
    setShowHistoricalRoute(true)
  }

  const handleGenerateTripReport = () => {
    setShowTripReport(true)
  }

  const handleCenterMapOnVehicle = () => {
    setMapCentered(true)
    // Simulate centering animation
    setTimeout(() => setMapCentered(false), 2000)
  }

  return (
    <div className="flex flex-1">
      <div className="flex flex-1 flex-col">
        {/* Dashboard Stats Cards */}
        <div className="pb-0">
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

        {/* Map - Command Center */}
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Live Fleet Map - Lagos, Nigeria</CardTitle>
                  <CardDescription>Real-time vehicle positions with street-level detail</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Navigation2 className="h-4 w-4 mr-2" />
                    Show Routes
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Geofences
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <div className="h-[calc(100vh-280px)] w-full">
                <VehicleMap
                  vehicles={vehicles}
                  onVehicleClick={handleVehicleClick}
                  selectedVehicle={selectedVehicle}
                  mapCentered={mapCentered}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Cards - Quick Glance Information */}
        <div className="pt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {vehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleVehicleClick(vehicle.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{vehicle.name}</span>
                    </div>
                    {getStatusBadge(vehicle.status)}
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{vehicle.licensePlate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{vehicle.driver}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{vehicle.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {vehicle.speed} km/h
                      </span>
                      <span className="flex items-center gap-1">
                        <Fuel className="h-3 w-3" />
                        {vehicle.fuel}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground pt-1">Updated {vehicle.lastUpdate}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Details Panel - The Deep Dive */}
      {showDetailsPanel && selectedVehicleData && (
        <div className="w-96 border-l bg-background">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Vehicle Details</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowDetailsPanel(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="p-4 space-y-6">
              {/* Vehicle Info */}
              <div>
                <h4 className="font-medium mb-3">{selectedVehicleData.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License Plate:</span>
                    <span className="font-medium">{selectedVehicleData.licensePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Driver:</span>
                    <span>{selectedVehicleData.driver}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    {getStatusBadge(selectedVehicleData.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Update:</span>
                    <span>{selectedVehicleData.lastUpdate}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Telemetry Data */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Live Telemetry
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-3 text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                      <div className="text-lg font-bold">{selectedVehicleData.speed}</div>
                      <div className="text-xs text-muted-foreground">km/h</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <Fuel className="h-6 w-6 mx-auto mb-1 text-green-500" />
                      <div className="text-lg font-bold">{selectedVehicleData.fuel}%</div>
                      <div className="text-xs text-muted-foreground">Fuel</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <Battery className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
                      <div className="text-lg font-bold">{selectedVehicleData.battery}%</div>
                      <div className="text-xs text-muted-foreground">Battery</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <Thermometer className="h-6 w-6 mx-auto mb-1 text-red-500" />
                      <div className="text-lg font-bold">{selectedVehicleData.temperature}°C</div>
                      <div className="text-xs text-muted-foreground">Engine</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Timeline of Events */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Events
                </h4>
                <div className="space-y-3">
                  {recentEvents
                    .filter((event) => event.vehicleId === selectedVehicleData.id)
                    .map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            event.severity === "error"
                              ? "bg-red-500"
                              : event.severity === "warning"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm">{event.message}</p>
                          <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div>
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={handleViewHistoricalRoute}
                  >
                    <Navigation2 className="h-4 w-4 mr-2" />
                    View Historical Route
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={handleGenerateTripReport}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Trip Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={handleCenterMapOnVehicle}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Center Map on Vehicle
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Historical Route Modal */}
      {showHistoricalRoute && selectedVehicleData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historical Route - {selectedVehicleData.name}</CardTitle>
                  <CardDescription>Route history for the last trip in Lagos</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowHistoricalRoute(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Route Timeline */}
                <div className="space-y-3">
                  {mockHistoricalRoute.map((point, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{point.event}</span>
                          <span className="text-sm text-muted-foreground">{point.timestamp}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Lat: {point.lat}, Lng: {point.lng}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Route Map Placeholder */}
                <div className="h-64 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <div className="text-center">
                    <Navigation2 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Historical Route Visualization</p>
                    <p className="text-sm text-muted-foreground">Lagos route path would be displayed here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trip Report Modal */}
      {showTripReport && selectedVehicleData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Trip Report - {selectedVehicleData.name}</CardTitle>
                  <CardDescription>{mockTripData.date}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowTripReport(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-96">
                <div className="space-y-6">
                  {/* Trip Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Navigation2 className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <div className="text-lg font-bold">{mockTripData.totalDistance}</div>
                        <div className="text-sm text-muted-foreground">Total Distance</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Clock className="h-6 w-6 mx-auto mb-2 text-green-500" />
                        <div className="text-lg font-bold">{mockTripData.totalDuration}</div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                        <div className="text-lg font-bold">{mockTripData.averageSpeed}</div>
                        <div className="text-sm text-muted-foreground">Avg Speed</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Fuel className="h-6 w-6 mx-auto mb-2 text-red-500" />
                        <div className="text-lg font-bold">{mockTripData.fuelConsumed}</div>
                        <div className="text-sm text-muted-foreground">Fuel Used</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Trip Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Number of Stops:</span>
                        <span className="font-medium">{mockTripData.stops}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Idle Time:</span>
                        <span className="font-medium">{mockTripData.idleTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Speed:</span>
                        <span className="font-medium">{mockTripData.maxSpeed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Driver:</span>
                        <span className="font-medium">{selectedVehicleData.driver}</span>
                      </div>
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
