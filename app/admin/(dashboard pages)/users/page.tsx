import { UserManagement } from "@/components/clients/admin-client-components"
import { db } from "@/prisma/db"

export default async function UserManagementPage() {
  const dbUsers = await db.user.findMany();
  
  // Transform the data to match your UserProps interface
  const users = dbUsers.map(user => ({
    ...user,
    id: user.id.toString() // Convert number to string
  }));

  return <UserManagement dbUsers={users} />
}