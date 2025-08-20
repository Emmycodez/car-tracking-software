"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { vehicles } from "./dashboard-components";
import {
  Car,
  Menu,
  Plus,
  MapPin,
  AlertTriangle,
  Fuel,
  Clock,
  X,
  Minus,
  TrendingUp,
  FileText,
  Thermometer,
  Battery,
  User,
  Navigation2,
  Activity,
} from "lucide-react";
import DrawerSheets from "../maps/MapDrawerSheets";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const Map = dynamic(() => import("../maps/MapComponent"), {
  ssr: false,
});

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
];

const mockHistoricalRoute = [
  {
    lat: 6.4281,
    lng: 3.4219,
    timestamp: "09:00 AM",
    event: "Trip Started - Victoria Island",
  },
  {
    lat: 6.6018,
    lng: 3.3515,
    timestamp: "09:15 AM",
    event: "Customer Stop - Ikeja",
  },
  {
    lat: 6.4698,
    lng: 3.5852,
    timestamp: "09:45 AM",
    event: "Delivery Complete - Lekki",
  },
  {
    lat: 6.4395,
    lng: 3.3669,
    timestamp: "10:30 AM",
    event: "Return to Depot - Apapa",
  },
];

const mockTripData = {
  date: "Today, Dec 8, 2024",
  totalDistance: "127.5 km",
  totalDuration: "4h 32m",
  averageSpeed: "28 km/h",
  fuelConsumed: "12.3 liters",
  stops: 5,
  idleTime: "45 minutes",
  maxSpeed: "65 km/h",
};

export default function DashboardPageClient() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [myRef, setMyRef] = useState<HTMLDivElement | null>(null);
  const [snap, setSnap] = useState<number | string>(0.4);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showHistoricalRoute, setShowHistoricalRoute] = useState(false);
  const [showTripReport, setShowTripReport] = useState(false);
  const [mapCentered, setMapCentered] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "driving":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Driving
          </Badge>
        );
      case "stopped":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Stopped
          </Badge>
        );
      case "idling":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Idling
          </Badge>
        );
      case "offline":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Offline
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleVehicleClick = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    setShowDetailsPanel(true);
  };
  // const selectedVehicleData = vehicles.find((v) => v.id === selectedVehicle);

  const handleViewHistoricalRoute = () => {
    setShowHistoricalRoute(true);
  };

  const handleGenerateTripReport = () => {
    setShowTripReport(true);
  };

  const handleCenterMapOnVehicle = () => {
    setMapCentered(true);
    // Simulate centering animation
    setTimeout(() => setMapCentered(false), 2000);
  };

  useEffect(() => {
    if (drawerRef.current) {
      setMyRef(drawerRef.current);
    }
  }, []);

  return (
    <div
      ref={drawerRef}
      className="flex flex-1 max-h-[100svh] relative w-screen flex-col gap-4"
    >
      <Map vehicles={vehicles} />

      {/* <DrawerSheets ref={myRef} /> */}
      {/* Details Panel - The Deep Dive */}
    </div>
  );
}
