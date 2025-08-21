"use client";
import DrawerSheets from "./MapDrawerSheets";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import DeviceMenu from "./DeviceList";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Vehicle } from "@/types/types";

export default function MapComponent({ vehicles }: { vehicles: Vehicle[] }) {
  const [viewState, setViewState] = useState({
    longitude: 3.3515,
    latitude: 6.6018,
    zoom: 12,
  });
  const isMobile = useIsMobile();
  const [showPopup, setShowPopup] = useState(false);
  return (
    <Map
      reuseMaps
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: "100%", height: "100%", position: "relative" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {vehicles.map(({ id, coordinates: { lat, lng } }) => (
        <div key={id} className="lol" onMouseEnter={() => setShowPopup(true)}>
          <Marker key={id} longitude={lng} latitude={lat} color="red" />
        </div>
      ))}
      {showPopup &&
        vehicles.map(({ id, coordinates: { lat, lng } }) => (
          <Popup
            key={id}
            longitude={lng + 1}
            latitude={lat}
            anchor="bottom"
            onClose={() => setShowPopup(false)}
          >
            You are here
          </Popup>
        ))}
      {isMobile ? <DrawerSheets /> : <DeviceMenu devices={vehicles} />}
    </Map>
  );
}
