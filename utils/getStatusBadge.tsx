import { Badge } from "@/components/ui/badge"

export const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Online</Badge>
      case "moving":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Moving</Badge>
      case "idle":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Idle</Badge>
      case "offline":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Offline</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }