"use client";
import { useState } from "react";
import VehicleInfo from "./VehicleInfo";
import { useMap } from "react-map-gl/mapbox";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Car, User, MapPin, TrendingUp, Fuel } from "lucide-react";
import { Vehicle } from "@/types/types";

export default function DeviceMenu({ devices }: { devices: Vehicle[] }) {
  const { current: map } = useMap();
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<Vehicle | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="sidebar flex flex-col fixed top-16 right-30">
      <AnimatePresence>
        <button
          className="rounded-3xl mr-0 ml-auto bg-white p-2 cursor-pointer"
          onClick={() => setIsPanelOpen((prev) => !prev)}
        >
          <Menu height={25} width={25} />
        </button>
        {isPanelOpen && (
          <motion.div
            key={"modal"}
            className="bg-white p-4 relative rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold">Vehicles</h1>
            <ul
              className="vehicle-list min-w-70 [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-gray-400
                [&::-webkit-scrollbar-thumb]:rounded-full
                dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 overflow-y-scroll flex flex-col max-h-[50svh]"
            >
              {devices.map((vehicle) => {
                return (
                  //   <>
                  <li
                    key={vehicle.id}
                    className="border-t p-2 cursor-default"
                    onClick={() =>
                      map?.flyTo({
                        center: [
                          vehicle.coordinates.lng,
                          vehicle.coordinates.lat,
                        ],
                        zoom: 12,
                      })
                    }
                  >
                    {" "}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span
                          className="font-medium text-sm hover:underline cursor-pointer"
                          onClick={() => {
                            setShowVehicleInfo(true);
                            setVehicleInfo(vehicle);
                          }}
                        >
                          {vehicle.name}
                        </span>
                      </div>
                      {/* {getStatusBadge(vehicle.status)} */}
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between items-center gap-1">
                        <span className="font-medium">
                          {vehicle.licensePlate}
                        </span>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 hover:underline cursor-pointer" />
                          <a className="hover:underline cursor-pointer">
                            {vehicle.driver}
                          </a>
                        </div>
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
                      <div className="text-xs text-muted-foreground pt-1">
                        Updated {vehicle.lastUpdate}
                      </div>
                    </div>
                    <VehicleInfo
                      showVehicleInfo={showVehicleInfo}
                      setShowVehicleInfo={setShowVehicleInfo}
                      setVehicleInfo={setVehicleInfo}
                      vehicle={vehicleInfo}
                    />
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
