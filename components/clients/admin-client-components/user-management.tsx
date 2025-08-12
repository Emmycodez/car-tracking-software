"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, HardDrive, Trash2, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const mockUsers = [
  {
    id: "usr_1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "user",
    traccarId: "1001",
    businessName: "Acme Corp",
  },
  {
    id: "usr_2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "admin",
    traccarId: "1002",
    businessName: "Global Logistics",
  },
  {
    id: "usr_3",
    name: "Mike Wilson",
    email: "mike.w@example.com",
    role: "user",
    traccarId: "1003",
    businessName: "City Deliveries",
  },
  {
    id: "usr_4",
    name: "Emma Davis",
    email: "emma.d@example.com",
    role: "user",
    traccarId: "1004",
    businessName: "Express Freight",
  },
  {
    id: "usr_5",
    name: "David Lee",
    email: "david.l@example.com",
    role: "user",
    traccarId: "1005",
    businessName: "Local Movers",
  },
]

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserBusinessName, setNewUserBusinessName] = useState("")

  const handleEditUser = (userId: string) => {
    console.log(`Editing user: ${userId}`)
    // In a real app, you'd open a modal or navigate to an edit page
    alert(`Simulating edit for user: ${userId}`)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm(`Are you sure you want to delete user ${userId}?`)) {
      setUsers(users.filter((user) => user.id !== userId))
      console.log(`Deleting user: ${userId}`)
      // In a real app, you'd call a server action to delete the user
    }
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserName || !newUserEmail) {
      alert("Full Name and Email Address are required.")
      return
    }

    const newUser = {
      id: `usr_${Date.now()}`, // Simple unique ID for mock
      name: newUserName,
      email: newUserEmail,
      role: "user", // Default role for new users
      traccarId: `TRC${Math.floor(Math.random() * 10000)}`, // Mock Traccar ID
      businessName: newUserBusinessName,
    }

    setUsers([...users, newUser])
    setNewUserName("")
    setNewUserEmail("")
    setNewUserBusinessName("")
    setIsAddUserModalOpen(false)
    alert(`User '${newUser.name}' created successfully!`)
    console.log("New user created:", newUser)
    // In a real app, you'd trigger a server action here
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Oversee all registered users in your system.</p>
        </div>
        <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Fill in the details to create a new user account.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="businessName" className="text-right">
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  value={newUserBusinessName}
                  onChange={(e) => setNewUserBusinessName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>All registered users and their details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Traccar ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.businessName || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.traccarId}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/devices?userId=${user.id}`}>
                              <HardDrive className="mr-2 h-4 w-4" />
                              Manage Devices
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
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
