"use client";

import { useState, useEffect, useRef } from "react";

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8082/api/socket");
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      setIsConnected(true);
    });

    socket.addEventListener("close", () => {
      setIsConnected(false);
    });

    socket.addEventListener("message", (e) => {
      console.log(e.data);
    });

    return () => {
      socket.close();
    };
  }, []);

  return { isConnected, socket: socketRef.current };
};

export default useSocket;
