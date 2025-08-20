import { cn } from "@/lib/utils";
import { Navigation } from "lucide-react";
import Link from "next/link";

export default function Logo({}) {
  return (
    <Link href={"/"} className="flex items-center space-x-2">
      <div className="bg-primary rounded-full p-2">
        <span className="font-bold text-lg text-white">
          <Navigation className={cn("w-6 h-6", "w-10 h-10")} />
        </span>
      </div>
      <span className={cn(" font-bold text-lg")}>
        Fleet <span className="text-primary">Tracker App</span>
      </span>
    </Link>
  );
}
