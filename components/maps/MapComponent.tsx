"use client";
import { motion } from "motion/react";
import { useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Vehicle } from "@/types/types";
import { Menu, Car, User, MapPin, TrendingUp, Fuel } from "lucide-react";

export default function MapComponent({ vehicles }: { vehicles: Vehicle[] }) {
  const [viewState, setViewState] = useState({
    longitude: 3.3515,
    latitude: 6.6018,
    zoom: 12,
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <Map
        reuseMaps
        mapboxAccessToken="pk.eyJ1IjoiZWdoMHNhYSIsImEiOiJjbWVicWg3ZWMxNTh1MmtxdWl4M2Z1bWdvIn0.QtIAOEQIxmFY0PUBaob1sw"
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        scrollZoom={false}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {vehicles.map(({ id, coordinates: { lat, lng } }) => (
          <Marker key={id} longitude={lng} latitude={lat} color="red" />
        ))}
      </Map>

      <div className="sidebar flex flex-col fixed top-16 right-30">
        <button
          className="rounded-3xl mr-0 ml-auto bg-white p-2 cursor-pointer"
          onClick={() => setIsPanelOpen((prev) => !prev)}
        >
          <Menu height={25} width={25} />
        </button>
        {isPanelOpen && (
          <motion.div
            className="bg-white p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="text-2xl font-bold">Vehicles</h1>
            <ul className="vehicle-list min-w-40 overflow-y-scroll flex flex-col max-h-[65svh]">
              {vehicles.map((vehicle) => {
                return (
                  <li key={vehicle.id} className="border-t p-2">
                    {" "}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">
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
                        <User className="h-3 w-3" />
                        <span>{vehicle.driver}</span>
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
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </div>
    </>
  );
}
