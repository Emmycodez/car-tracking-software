import { DeviceManagement } from "@/components/clients/admin-client-components" 
import { db } from "@/prisma/db"


export default async function DeviceManagementPage() {
  const data = await db.user.findMany();

   const users = data.map(user => ({
    ...user,
    id: user.id.toString() // Convert number to string
  }));

  const deviceData = await db.device.findMany();
  const devices = deviceData.map(device => ({
    ...device,
    id:device.id.toString()
  }))
  

  return <DeviceManagement  users={users} deviceList={devices}/>
}
