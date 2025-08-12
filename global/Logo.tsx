import { cn } from "@/lib/utils";
import { MapPinned } from "lucide-react";
import Link from "next/link";

export default function Logo({}) {
  return (
    <Link href={"/"} className="flex items-center space-x-2">
      <div className="bg-blue-500 rounded-full p-1">
        <span className="font-bold text-xl text-white">
          <MapPinned className={cn("w-6 h-6", "w-10 h-10")} />
        </span>
      </div>
      <span className={cn(" font-bold text-xl", "text-4xl")}>
        Tracker <span className="text-primary">App</span>
      </span>
    </Link>
  );
}
