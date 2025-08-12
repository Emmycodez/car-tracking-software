"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, User, Trash2, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock Data
const mockUsersForDropdown = [
  { id: "usr_1", name: "John Smith" },
  { id: "usr_2", name: "Sarah Johnson" },
  { id: "usr_3", name: "Mike Wilson" },
  { id: "usr_4", name: "Emma Davis" },
  { id: "usr_5", name: "David Lee" },
]

const mockDevices = [
  {
    id: "dev_1",
    name: "Delivery Truck Alpha",
    uniqueId: "IMEI123456789012345",
    assignedUser: "John Smith",
    status: "online",
  },
  {
    id: "dev_2",
    name: "Service Van Beta",
    uniqueId: "IMEI987654321098765",
    assignedUser: "Sarah Johnson",
    status: "moving",
  },
  {
    id: "dev_3",
    name: "Cargo Truck Gamma",
    uniqueId: "IMEI112233445566778",
    assignedUser: "Mike Wilson",
    status: "offline",
  },
  {
    id: "dev_4",
    name: "Express Van Delta",
    uniqueId: "IMEI998877665544332",
    assignedUser: "Emma Davis",
    status: "idle",
  },
]

export function DeviceManagement() {
  const [devices, setDevices] = useState(mockDevices)
  const [newDeviceName, setNewDeviceName] = useState("")
  const [newDeviceUniqueId, setNewDeviceUniqueId] = useState("")
  const [newDeviceAssignedUser, setNewDeviceAssignedUser] = useState("")

  const getStatusBadge = (status: string) => {
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

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDeviceName || !newDeviceUniqueId || !newDeviceAssignedUser) {
      alert("Please fill all fields for the new device.")
      return
    }

    const assignedUserName =
      mockUsersForDropdown.find((user) => user.id === newDeviceAssignedUser)?.name || "Unassigned"

    const newDevice = {
      id: `dev_${Date.now()}`, // Simple unique ID for mock
      name: newDeviceName,
      uniqueId: newDeviceUniqueId,
      assignedUser: assignedUserName,
      status: "offline", // New devices start offline
    }

    setDevices([...devices, newDevice])
    setNewDeviceName("")
    setNewDeviceUniqueId("")
    setNewDeviceAssignedUser("")
    alert(`Device '${newDevice.name}' created and assigned to ${assignedUserName}.`)
    console.log("New device created:", newDevice)
    // In a real app, you'd trigger a server action here
  }

  const handleEditDevice = (deviceId: string) => {
    console.log(`Editing device: ${deviceId}`)
    alert(`Simulating edit for device: ${deviceId}`)
    // In a real app, you'd open a modal or navigate to an edit page
  }

  const handleReassignDevice = (deviceId: string, currentAssignedUser: string) => {
    const newUserId = prompt(
      `Reassign device ${deviceId}. Current user: ${currentAssignedUser}. Enter new user ID (e.g., usr_1):`,
    )
    if (newUserId) {
      const newUser = mockUsersForDropdown.find((user) => user.id === newUserId)
      if (newUser) {
        setDevices(
          devices.map((device) => (device.id === deviceId ? { ...device, assignedUser: newUser.name } : device)),
        )
        alert(`Device ${deviceId} reassigned to ${newUser.name}.`)
        console.log(`Device ${deviceId} reassigned to ${newUser.name}`)
        // In a real app, you'd trigger a server action here
      } else {
        alert("User ID not found.")
      }
    }
  }

  const handleDeleteDevice = (deviceId: string) => {
    if (confirm(`Are you sure you want to delete device ${deviceId}? This will remove it from the system.`)) {
      setDevices(devices.filter((device) => device.id !== deviceId))
      alert(`Device ${deviceId} deleted.`)
      console.log(`Deleting device: ${deviceId}`)
      // In a real app, you'd trigger a server action here
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Device Management</h1>
      <p className="text-muted-foreground">Create, assign, and manage all tracking devices.</p>

      {/* Create New Device Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Device</CardTitle>
          <CardDescription>Register a new tracking device and assign it to a user.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateDevice} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                placeholder="e.g., Car 1, Jane's Truck"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceUniqueId">Device Unique ID (IMEI)</Label>
              <Input
                id="deviceUniqueId"
                placeholder="e.g., 123456789012345"
                value={newDeviceUniqueId}
                onChange={(e) => setNewDeviceUniqueId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="assignedUser">Assign to User</Label>
              <Select value={newDeviceAssignedUser} onValueChange={setNewDeviceAssignedUser} required>
                <SelectTrigger id="assignedUser">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsersForDropdown.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Device
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Device List */}
      <Card>
        <CardHeader>
          <CardTitle>Device List</CardTitle>
          <CardDescription>All registered devices and their current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Unique ID</TableHead>
                  <TableHead>Assigned User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.uniqueId}</TableCell>
                    <TableCell>{device.assignedUser}</TableCell>
                    <TableCell>{getStatusBadge(device.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditDevice(device.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReassignDevice(device.id, device.assignedUser)}>
                            <User className="mr-2 h-4 w-4" />
                            Reassign
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteDevice(device.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
