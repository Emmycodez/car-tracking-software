// NoUsers.tsx
import { Users } from 'lucide-react';

export function NoUsers() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
      <Users className="w-16 h-16 mb-4" />
      <h2 className="text-xl font-semibold">No Users Found</h2>
      <p className="mt-2 text-sm">
        It looks like there are no users in your system yet.
        <br />
        Click the "Add New User" button to get started.
      </p>
    </div>
  );
}