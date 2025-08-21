"use client";
import { ChevronDown } from "lucide-react";
import { Drawer } from "vaul";
import { useIsMobile } from "@/hooks/use-mobile";
import useSocket from "@/hooks/useSocket";

interface Props {
  ref: HTMLDivElement | null;
}

export default function DrawerSheets() {
  return (
    <Drawer.Root open snapPoints={["50px", "250px", "300px"]} activeSnapPoint="300px">
      <Drawer.Portal>
        
        <Drawer.Content className="absolute bottom-0 left-0 right-0 bg-gray-100 rounded-t-xl flex flex-col outline-none z-50">
          <Drawer.Handle className="my-2" />
          <div className="p-4 bg-white rounded-t-[10px] flex-1">
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-medium mb-4 text-gray-900">
                Drawer for React.
              </Drawer.Title>
              <p className="text-gray-600 mb-2">
                This component can be used as a Dialog replacement on mobile and
                tablet devices. You can read about why and how it was built{" "}
                <a
                  target="_blank"
                  className="underline"
                  href="https://emilkowal.ski/ui/building-a-drawer-component"
                >
                  here
                </a>
                .
              </p>
              <p className="text-gray-600 mb-2">
                This one specifically is the most simplest setup you can have,
                just a simple drawer with a trigger.
              </p>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
