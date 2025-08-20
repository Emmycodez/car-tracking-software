"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeviceProps, UserProps } from "@/types/types";
import { Edit, MoreHorizontal, PlusCircle, Trash2, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { createDevice, deleteDevice } from "@/actions/admin-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

interface DevicePageProps {
  users: UserProps[];
  deviceList: DeviceProps[];
}

export function DeviceManagement({ users, deviceList }: DevicePageProps) {
  const [devices, setDevices] = useState(deviceList);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceUniqueId, setNewDeviceUniqueId] = useState("");
  const [newDeviceAssignedUser, setNewDeviceAssignedUser] = useState("");

  const handleCreateDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName || !newDeviceUniqueId) {
      toast.error("Please fill all fields for the new device.");
      return;
    }

    const assignedUserId =
      Number(users.find((user) => user.id === newDeviceAssignedUser)?.id) || 0;
      console.log("This is the assigned user ID:", assignedUserId);

    const newDevice = {
      id: `dev_${Date.now()}`, // Simple unique ID for mock
      name: newDeviceName,
      uniqueId: newDeviceUniqueId,
      userId: assignedUserId,
      status: "offline",
    };

    toast.promise(createDevice(newDevice), {
      loading: "Creating device...",
      success: () => {
        setDevices((prevDevices) => [...prevDevices, newDevice]);
        return "Device created successfully!";
      },
      error: (err) => {
        console.error("Error creating device:", err);
        return "Failed to create device. Please try again.";
      },
    });

    setNewDeviceName("");
    setNewDeviceUniqueId("");
    setNewDeviceAssignedUser("");
  };

  const handleEditDevice = (deviceId: string) => {
    console.log(`Editing device: ${deviceId}`);
    alert(`Simulating edit for device: ${deviceId}`);
    // In a real app, you'd open a modal or navigate to an edit page
  };

  const handleReassignDevice = (
    deviceId: string,
    currentAssignedUser: string
  ) => {
    const newUserId = prompt(
      `Reassign device ${deviceId}. Current user: ${currentAssignedUser}. Enter new user ID (e.g., usr_1):`
    );
    if (newUserId) {
      const newUser = users.find((user) => user.id === newUserId);
      if (newUser) {
        setDevices(
          devices.map((device) =>
            device.id === deviceId
              ? { ...device, assignedUser: newUser.name }
              : device
          )
        );
        alert(`Device ${deviceId} reassigned to ${newUser.name}.`);
        console.log(`Device ${deviceId} reassigned to ${newUser.name}`);
        // In a real app, you'd trigger a server action here
      } else {
        alert("User ID not found.");
      }
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    toast.promise(deleteDevice(Number(deviceId)), {
      loading: "Deleting device...",
      success: () => {
        setDevices((prevDevices) =>
          prevDevices.filter((device) => device.id !== deviceId)
        );
        return "Device deleted successfully!";
      },
      error: (err) => {
        console.error("Error deleting device:", err);
        return "Failed to delete device. Please try again.";
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Device Management</h1>
      <p className="text-muted-foreground">
        Create, assign, and manage all tracking devices.
      </p>

      {/* Create New Device Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Device</CardTitle>
          <CardDescription>
            Register a new tracking device and assign it to a user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreateDevice}
            className="grid gap-4 md:grid-cols-2"
          >
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
              <Select
                value={newDeviceAssignedUser}
                onValueChange={setNewDeviceAssignedUser}
                required
              >
                <SelectTrigger id="assignedUser">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id ?? ""}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full hover:cursor-pointer">
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
          <CardDescription>
            All registered devices and their current status.
          </CardDescription>
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
                    <TableCell>{device.user?.name ?? ""}</TableCell>
                    <TableCell></TableCell>
                    {/* <TableCell>{getStatusBadge(device.status)}</TableCell> */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditDevice(device.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleReassignDevice(
                                device.id,
                                device.user?.name ?? ""
                              )
                            }
                          >
                            <User className="mr-2 h-4 w-4" />
                            Reassign
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure you want to delete this device?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. The user and all
                                  related data will be permanently removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteDevice(device.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Yes, delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
  );
}
