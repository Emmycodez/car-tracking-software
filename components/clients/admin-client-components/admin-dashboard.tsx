import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, HardDrive, Activity, Clock, Car, UserPlus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const mockStats = {
  totalUsers: 150,
  totalDevices: 98,
  activeDevices: 70,
  offlineDevices: 30,
}

const mockRecentActivity = [
  {
    id: 1,
    type: "device_registration",
    message: "New device 'VAN005' registered by Sarah Johnson",
    timestamp: "5 minutes ago",
    icon: HardDrive,
    color: "bg-green-500",
  },
  {
    id: 2,
    type: "user_creation",
    message: "New user 'David Lee' added to the system",
    timestamp: "15 minutes ago",
    icon: UserPlus,
    color: "bg-blue-500",
  },
  {
    id: 3,
    type: "device_status",
    message: "Device 'TRK003' went offline",
    timestamp: "30 minutes ago",
    icon: Car,
    color: "bg-red-500",
  },
  {
    id: 4,
    type: "device_status",
    message: "Device 'VAN002' is now active",
    timestamp: "1 hour ago",
    icon: Car,
    color: "bg-green-500",
  },
  {
    id: 5,
    type: "user_role_change",
    message: "Role of 'Mike Wilson' changed to 'admin'",
    timestamp: "2 hours ago",
    icon: Users,
    color: "bg-yellow-500",
  },
]

export function AdminDashboarPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Admin Dashboard Overview</h1>
      <p className="text-muted-foreground">High-level summary of the entire system.</p>

      {/* Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalDevices}</div>
            <p className="text-xs text-muted-foreground">Managed devices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeDevices}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline Devices</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.offlineDevices}</div>
            <p className="text-xs text-muted-foreground">Not reporting data</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest events and system updates</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${activity.color}`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
