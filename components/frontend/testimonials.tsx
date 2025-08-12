"use client";
import { CardStack } from "../ui/card-stack";
import { cn } from "@/lib/utils";
export function Testimonials() {
  return (
    <div className="h-[22rem] flex items-center justify-center w-full">
      <CardStack items={CARDS} />
    </div>
  );
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-primary-foreground text-primary  px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

const CARDS = [
  {
    id: 0,
    name: "Chinelo Umeh",
    designation: "Pharmacy Owner, Enugu",
    content: (
      <p>
        Since switching to <Highlight>PharmOS</Highlight>, I no longer worry about stockouts or expired drugs. 
        The <Highlight>stock alert feature</Highlight> is a game-changer.
      </p>
    ),
  },
  {
    id: 1,
    name: "Dr. Musa Ibrahim",
    designation: "Managing Director, LifeMed Pharmacy",
    content: (
      <p>
        What impressed me most was how easy it was to track sales across all my branches.
        <Highlight>PharmOS&pos; POS system</Highlight> is fast, intuitive, and built for busy pharmacies like ours.
      </p>
    ),
  },
  {
    id: 2,
    name: "Blessing Okoro",
    designation: "Inventory Manager, VitalCare",
    content: (
      <p>
        Our workflow has improved dramatically. With <Highlight>PharmOS&apos; expiry tracking</Highlight> and 
        <Highlight>WhatsApp alerts</Highlight>, we&apos;re always ahead of issues before they become problems.
      </p>
    ),
  },
]
