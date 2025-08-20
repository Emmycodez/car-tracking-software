import { db } from "@/prisma/db";
import { Navigation } from "lucide-react";
import { ActivationForm } from "./_components/activation-form";

interface ActivatePageProps {
  searchParams: {
    token?: string;
  };
}

export default async function ActivatePage({
  searchParams,
}: ActivatePageProps) {
  const params =  await searchParams;
  const token = params.token;

  if (!token) {
    return <p>Invalid Activation Link</p>;
  }

  // Look up the user by the activation token and check its expiry
  const user = await db.user.findUnique({
    where: {
      accountActivationToken: token,
      activationTokenExpiry: {
        gte: new Date(), // Check if the current date is less than or equal to the expiry date
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  // If no user is found with the valid token (e.g., token expired or never existed)
  if (!user) {
    return (
      <p>
        /Invalid or expired activation link. Please contact support if you need
        a new one
      </p>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center">
          <Navigation className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Welcome, {user.name || user.email}!
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600 ">
            Please set a **strong password** to activate your account.
          </p>
        </div>
        <ActivationForm userId={user.id} />
      </div>
    </div>
  );
}
