import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import SmallTitle from "./small-title";
import Link from "next/link";
import { CustomLinkButton } from "@/global/CustomLinkButton";
import StarRating from "@/global/StarRating";
import { AnimatedAvatars } from "@/global/avatar-circles";

export default async function HeroSection() {
  return (
    <section className="relative min-h-[100vh] w-full flex items-center justify-center bg-background text-foreground">
      <div className="container max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        <SmallTitle title="Welcome to FleetTracker (v1) 🚗📍" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl mx-auto">
          Your All-In-One<span className="text-primary"> Vehicle Tracking Solution</span>{" "}
          for Real-Time Fleet Management
        </h1>

        <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-lg">
          Monitor your vehicles in real time from a single dashboard. Track locations,
          routes, driving behavior, and alerts — all from one powerful,
          easy-to-use platform built for modern fleet management.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="rounded-full h-12 px-6 text-lg">
              Talk to Sales
              <Phone className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <CustomLinkButton title="Login" href="/login" />
        </div>
        <div className="pt-8 pb-4 flex items-center justify-center gap-8">
          <div className="">
            <AnimatedAvatars />
          </div>
          <div className="">
            <StarRating count={5} />
            <p className="dark:text-slate-900">Fleet managers trust it.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
