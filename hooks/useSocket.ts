"use client";
import { Vehicle } from "@/types/types";
import { useState, useEffect, useRef } from "react";

interface Devices {
    positions:  {
            id: number,
            attributes: {
                motion: boolean,
                odometer: number,
                activity: string,
                distance: number,
                totalDistance: number
            },
            deviceId: number,
            protocol: string,
            serverTime: string,
            deviceTime: string,
            fixTime: string,
            outdated: boolean,
            valid: boolean,
            latitude: number,
            longitude: number,
            altitude: number,
            speed: number,
            course: number,
            address: null,
            accuracy: number,
            network: null,
            geofenceIds: null
        }[]
}

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [devicePositions, setDevicePositions] = useState<Devices|null>(null)
  const socketRef = useRef<WebSocket>(null);

  useEffect(() => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_TRACCAR_WS_URL!);
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      setIsConnected(true);
    });

    socket.addEventListener("close", () => {
      setIsConnected(false);
    });

    socket.addEventListener("message", ({data}) => {
      setDevicePositions(data)
      
    });

    return () => {
      socket.close();
    };
  }, []);

  return { isConnected, socket: socketRef.current, devicePositions };
};

export default useSocket;
