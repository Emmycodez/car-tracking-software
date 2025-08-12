"use client";

import {
  BarChart,
  BarChart2,
  Layout,
  Lock,
  MapPinPlus,
  ScanBarcode,
  Store,
  UsersRound,
  WalletMinimal
} from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionHeader from "./section-header";

const features = [
  {
    icon: Store,
    tab: "Inventory",
    title: "Inventory Management",
    description:
      "Track, manage, and optimize your pharmacy’s inventory with real-time data and automation.",
    href: "/features/inventory",
    subFeatures: [
      "Real-time stock level tracking",
      "Low stock alerts via WhatsApp, SMS, and email",
      "Batch and expiry date management",
      "Product categorization by type and brand",
      "Sales trend identification (fast/slow movers)",
      "Barcode support for efficient inventory updates",
      "Bulk import/export for inventory",
      "Stock history and audit logs",
    ],
    image: "/images/inventory.webp",
  },
  {
    icon: ScanBarcode,
    tab: "POS",
    title: "Point of Sale (POS)",
    description:
      "Streamlined checkout system for seamless sales transactions at your pharmacy.",
    href: "/features/pos",
    subFeatures: [
      "Quick product lookup with barcode scanning",
      "Multi-payment method support (cash, bank, card)",
      "Real-time inventory sync with POS",
      "Sales receipt generation and printing",
      "POS roles and permission controls",
      "Track cashier activity and sales logs",
      "Daily sales summary report",
      "Offline mode for continuous operations",
    ],
    image: "/images/pos.webp",
  },
  {
    icon: Layout,
    tab: "E-commerce",
    title: "E-commerce Website",
    description:
      "Responsive online storefront connected to your inventory to drive more pharmacy sales.",
    href: "/features/ecommerce",
    subFeatures: [
      "Product catalog synced with backend inventory",
      "Mobile-optimized shopping experience",
      "Customer order tracking and history",
      "SEO-optimized pages for local search",
      "Built-in payment gateway integration",
      "Real-time inventory availability display",
      "Social sharing and marketing tools",
    ],
    image: "/images/ecommerce.webp",
  },
  {
    icon: WalletMinimal,
    tab: "Accounting",
    title: "Accounting & Bookkeeping",
    description:
      "Monitor income and expenses, and generate financial insights effortlessly.",
    href: "/features/accounting",
    subFeatures: [
      "Track income and expenditures in real time",
      "Record daily and monthly cash flow",
      "Automated sales-to-revenue reconciliation",
      "View profit/loss summaries",
      "Attach expenses to branches and staff",
      "Export reports to Excel or PDF",
      "Support for multiple currencies",
      "Audit trail for financial transactions",
    ],
    image: "/images/accounting.webp",
  },
  {
    icon: BarChart2,
    tab: "Data",
    title: "Advanced Data Tables",
    description:
      "Powerful data tables for managing inventory, sales, and employees efficiently.",
    href: "/features/data-tables",
    subFeatures: [
      "Custom column filtering and sorting",
      "Inline row editing for fast updates",
      "Pagination and search capabilities",
      "Role-based visibility and editing rights",
      "Bulk action support (delete, update)",
      "CSV and Excel export options",
      "Responsive for mobile and tablet views",
      "Integration with backend APIs",
    ],
    image: "/images/data-tables.webp",
  },
  {
    icon: Lock,
    tab: "Security",
    title: "Secure Platform",
    description:
      "Enterprise-grade security built into every layer of the platform to protect your data.",
    href: "/features/security",
    subFeatures: [
      "Role-based access control system",
      "Secure login with NextAuth",
      "Encrypted storage of sensitive data",
      "Session timeout and logout controls",
      "Activity logs and user tracking",
      "Multi-location authentication awareness",
      "Protection against common attacks (XSS, CSRF)",
      "Secure password reset flow",
    ],
    image: "/images/security.webp",
  },
  {
    icon: UsersRound,
    tab: "Employees",
    title: "Employee Activity Tracking",
    description:
      "Track staff activities across locations with role-based access and full transparency.",
    href: "/features/employees",
    subFeatures: [
      "Assign roles (cashier, manager, admin, etc.)",
      "Track who made which sale or update",
      "Login history and session tracking",
      "Daily employee productivity reports",
      "Branch-specific access control",
      "Time-based access windows",
      "Restrict access to sensitive modules",
      "Create and deactivate accounts anytime",
    ],
    image: "/images/employees.webp",
  },
  {
    icon: MapPinPlus,
    tab: "Locations",
    title: "Multi-Location Support",
    description:
      "Manage multiple pharmacy outlets from a unified dashboard with centralized controls.",
    href: "/features/multi-location",
    subFeatures: [
      "Switch between branches in one click",
      "Separate inventory and sales per location",
      "Centralized dashboard for performance overview",
      "Role-specific access per branch",
      "Branch-level analytics and reporting",
      "Manage users by location",
      "Custom pricing per branch (if needed)",
      "Track stock transfers between branches",
    ],
    image: "/images/multi-location.webp",
  },
  {
    icon: BarChart,
    tab: "Analytics",
    title: "Analytics Integration",
    description:
      "Gain insights into your business performance with powerful reporting tools and dashboards.",
    href: "/features/analytics",
    subFeatures: [
      "Track sales trends and product performance",
      "Monitor most and least sold products",
      "Revenue and profit analytics",
      "Inventory turnover rate and restock timing",
      "Exportable PDF/Excel reports",
      "Branch-by-branch performance comparison",
    ],
    image: "/images/analytics.webp",
  },
];

export default function TabbedFeatures() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="py-8">
        <SectionHeader
          title="Core Features"
          heading="Your Complete Pharmacy Operating System"
          description="Everything you need to start managing the end-to-end business operations of your pharmacy online"
        />
      </div>
      <Tabs defaultValue={features[0].tab.toLowerCase()} className="space-y-8">
        <TabsList className="inline-flex h-auto w-full justify-start gap-4 rounded-none border-b bg-transparent p-0 flex-wrap">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <TabsTrigger
                key={feature.tab}
                value={feature.tab.toLowerCase()}
                className="inline-flex items-center gap-2 border-b-2 border-transparent px-4 pb-4 pt-2 data-[state=active]:border-primary"
              >
                <Icon className="h-5 w-5" />
                {feature.tab}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {features.map((feature) => (
          <TabsContent
            key={feature.tab}
            value={feature.tab.toLowerCase()}
            className="space-y-8"
          >
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">
                  {feature.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {feature.description}
                </p>
                <Card>
                  <CardContent className="grid gap-4 p-6">
                    {feature.subFeatures.map((subFeature, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {index + 1}
                        </div>
                        <span>{subFeature}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                {/* <Button asChild>
                  <Link href={feature.href}>
                    Learn more about {feature.title}
                  </Link>
                </Button> */}
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-muted lg:aspect-square">
                <Image
                  src={feature.image}
                  alt={`${feature.title} illustration`}
                  className="object-contain"
                  fill
                  priority
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
