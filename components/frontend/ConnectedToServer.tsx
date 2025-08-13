"use client";
import useSocket from "@/hooks/useSocket";
import { cn } from "@/lib/utils";

export default function ConnectedToServer() {
  const { isConnected } = useSocket();

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-green-500" : "bg-red-500"
          )}
        ></div>
        <span>{isConnected ? "Live" : "Disconnected"}</span>
      </div>
    </div>
  );
}
