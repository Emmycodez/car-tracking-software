"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import "leaflet/dist/leaflet.css"

interface Vehicle {
  id: string
  name: string
  status: string
  coordinates: { lat: number; lng: number }
  speed: number
  fuel: number
}

interface VehicleMapProps {
  vehicles: Vehicle[]
  onVehicleClick: (vehicleId: string) => void
  selectedVehicle: string | null
  mapCentered: boolean
}

const getMarkerColor = (status: string) => {
  switch (status) {
    case "driving":
      return "#22c55e" // green
    case "stopped":
      return "#3b82f6" // blue
    case "idling":
      return "#f59e0b" // orange
    case "offline":
      return "#ef4444" // red
    default:
      return "#6b7280" // gray
  }
}

const createCustomIcon = (L: typeof import("leaflet"), status: string, isSelected = false) => {
  const color = getMarkerColor(status)
  const size = isSelected ? 20 : 15

  return L.divIcon({
    className: "custom-vehicle-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ${status === "driving" ? "animation: pulse 2s infinite;" : ""}
        ${isSelected ? "transform: scale(1.3);" : ""}
      "></div>
      <style>
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 ${color}40; }
          70% { box-shadow: 0 0 0 10px ${color}00; }
          100% { box-shadow: 0 0 0 0 ${color}00; }
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export default function VehicleMap({ vehicles, onVehicleClick, selectedVehicle, mapCentered }: VehicleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any | null>(null)
  const markersRef = useRef<{ [key: string]: any }>({})
  const [leafletInstance, setLeafletInstance] = useState<any | null>(null)

  useEffect(() => {
    import("leaflet")
      .then((LModule) => {
        setLeafletInstance(LModule)
        
        // Fix for default markers in Next.js - Use unpkg CDN URLs
        delete (LModule.Icon.Default.prototype as any)._getIconUrl
        LModule.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })
        
        // Wait for next tick to ensure DOM element is rendered
        setTimeout(() => {
          if (!mapRef.current && mapContainerRef.current) {
            mapRef.current = LModule.map(mapContainerRef.current).setView([6.5244, 3.3792], 11)
            
            LModule.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 19,
            }).addTo(mapRef.current)
            
            // Create a custom control class
            const InfoControl = LModule.Control.extend({
              options: {
                position: 'bottomright'
              },
              
              onAdd: function(map: any) {
                const div = LModule.DomUtil.create('div', 'info')
                div.innerHTML = `
                  <div style="
                    background: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    font-size: 12px;
                    color: #666;
                  ">
                    <strong>Lagos, Nigeria</strong><br>
                    Real-time vehicle tracking
                  </div>
                `
                return div
              }
            })
            
            // Add the custom control to the map
            new InfoControl().addTo(mapRef.current)
          }
        }, 0)
      })
      .catch((error) => {
        console.error("Failed to load Leaflet:", error)
      })
      
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!leafletInstance || !mapRef.current) return

    Object.values(markersRef.current).forEach((marker) => {
      mapRef.current?.removeLayer(marker)
    })
    markersRef.current = {}

    vehicles.forEach((vehicle) => {
      const isSelected = vehicle.id === selectedVehicle
      const marker = leafletInstance.marker([vehicle.coordinates.lat, vehicle.coordinates.lng], {
        icon: createCustomIcon(leafletInstance, vehicle.status, isSelected),
      })

      marker.bindPopup(`
        <div style="font-family: system-ui; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${vehicle.name}</h3>
          <div style="font-size: 12px; color: #666; line-height: 1.4;">
            <div><strong>Status:</strong> ${vehicle.status}</div>
            <div><strong>Speed:</strong> ${vehicle.speed} km/h</div>
            <div><strong>Fuel:</strong> ${vehicle.fuel}%</div>
          </div>
        </div>
      `)

      marker.on("click", () => {
        onVehicleClick(vehicle.id)
      })

      marker.addTo(mapRef.current!)
      markersRef.current[vehicle.id] = marker
    })
  }, [vehicles, selectedVehicle, onVehicleClick, leafletInstance])

  useEffect(() => {
    if (mapCentered && selectedVehicle && mapRef.current && leafletInstance) {
      const vehicle = vehicles.find((v) => v.id === selectedVehicle)
      if (vehicle) {
        mapRef.current.setView([vehicle.coordinates.lat, vehicle.coordinates.lng], 15, {
          animate: true,
          duration: 1,
        })
      }
    }
  }, [mapCentered, selectedVehicle, vehicles, leafletInstance])

  if (!leafletInstance) {
    return (
      <div
        className="h-full w-full bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Loading Map...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mapContainerRef}
      className="h-full w-full rounded-lg overflow-hidden" 
      style={{ minHeight: "400px" }} 
    />
  )
}