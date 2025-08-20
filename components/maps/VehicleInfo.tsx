"use client";
import { MoveLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Vehicle } from "@/types/types";

interface Props {
  setVehicleInfo: (vehicle: Vehicle | null) => void;
  vehicle: Vehicle | null;
  setShowVehicleInfo: (show: boolean) => void;
  showVehicleInfo: boolean;
}

export default function VehicleInfo({
  setVehicleInfo,
  vehicle,
  setShowVehicleInfo,
  showVehicleInfo,
}: Props) {
  function handleClick() {
    setShowVehicleInfo(false);
    setVehicleInfo(null);
  }
  return (
    <AnimatePresence>
      {showVehicleInfo && (
        <motion.div
          className="absolute inset-0 z-50 bg-white flex flex-col rounded-lg"
          initial={{ x: "10%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "10%", opacity: 0 }}
          transition={{ type: "tween", duration: 0.5 }}
        >
          <div className="flex items-center p-4 gap-4 border-b">
            <button onClick={handleClick} className="cursor-pointer">
              <MoveLeft />
            </button>
            <div>
              <h2 className="text-xl font-semibold">{vehicle?.name}</h2>
              <span className="flex gap-4 items-center">
                <p className="text-sm text-gray-500">{vehicle?.licensePlate}</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    vehicle?.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {vehicle?.status}
                </span>
              </span>
            </div>
          </div>
          <div className="flex flex-col h-full p-6 overflow-y-auto  [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-gray-600">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">Driver</h3>
              <a className="text-gray-900 hover:underline cursor-pointer">
                {vehicle?.driver}
              </a>
            </div>

            {/* Location + movement */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">Location</h3>
              <p className="text-gray-900">{vehicle?.location}</p>
              <p className="text-xs text-gray-500">
                Lat: {vehicle?.coordinates.lat}, Lng: {vehicle?.coordinates.lng}
              </p>
              <p className="text-gray-900 mt-2">Speed: {vehicle?.speed} km/h</p>
              <p className="text-xs text-gray-500">
                Last update: {vehicle?.lastUpdate}
              </p>
            </div>

            {/* Vehicle condition */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Fuel</h3>
                <p>{vehicle?.fuel}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Battery</h3>
                <p>{vehicle?.battery}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Temperature
                </h3>
                <p>{vehicle?.temperature}°C</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Ignition</h3>
                <p>{vehicle?.ignition ? "On" : "Off"}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
