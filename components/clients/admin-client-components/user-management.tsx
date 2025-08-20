"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type React from "react";

import { createClientAccount, deleteUser } from "@/actions/admin-actions";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTableProps } from "@/types/types";
import {
  Edit,
  HardDrive,
  Loader2,
  MoreHorizontal,
  Trash2,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { NoUsers } from "./no-users";

export function UserManagement({ dbUsers }: UserTableProps) {
  const [users, setUsers] = useState(dbUsers);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserBusinessName, setNewUserBusinessName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEditUser = (userId: string) => {
    console.log(`Editing user: ${userId}`);
    // In a real app, you'd open a modal or navigate to an edit page
    alert(`Simulating edit for user: ${userId}`);
  };

  const handleDeleteUser = async (userId: string) => {
    toast.promise(deleteUser(Number(userId)), {
      loading: "Deleting user...",
      success: () => {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        return "User deleted successfully!";
      },
      error: (err) => {
        console.error("Error deleting user:", err);
        return `<b>Error:</b> ${err.message || "Failed to delete user"}`;
      },
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!newUserName || !newUserEmail) {
      toast.error("Full Name and Email Address are required.");
      return;
    }

    const response = await createClientAccount({
      name: newUserName,
      email: newUserEmail,
      businessName: newUserBusinessName,
    });

    if (response.error) {
      toast.error(`Error: ${response.error}`);
      setIsLoading;
      return;
    }

    if (response.id) {
      setUsers((prev) => [
        ...prev,
        {
          id: String(response.id), // Assuming your API returns the new user ID
          name: newUserName,
          email: newUserEmail,
          businessName: newUserBusinessName,
          role: "user", // Or whatever your API returns
          traccarId: response.traccarId || "",
        },
      ]);
    }
    // Update local state to add the new user

    toast.success("User account created successfully!");

    // Optionally, close modal and reset form
    setIsLoading(false);
    setIsAddUserModalOpen(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserBusinessName("");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Oversee all registered users in your system.
          </p>
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
              <DialogDescription>
                Fill in the details to create a new user account.
              </DialogDescription>
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
                <Button type="submit" className="cursor-pointer">
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Create User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            All registered users and their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Traccar ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                { users.length > 0 ?(users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.businessName || "N/A"}</TableCell>
                    <TableCell className="font-medium">
                      <Badge
                        variant={user.isActive ? "default" : "destructive"}
                        className={`${
                          user.isActive
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
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
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user.id ?? "")}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/devices?userId=${user.id}`}>
                              <HardDrive className="mr-2 h-4 w-4" />
                              Manage Devices
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-red-600"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure you want to delete this user:{" "}
                                  <span className="font-semibold text-primary">
                                    {user.name}
                                  </span>
                                  ?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. The user and all
                                  related data will be permanently removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteUser(user.id ?? "")
                                  }
                                  className="bg-red-600 hover:bg-red-700"
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
                ))): (
                  <NoUsers/>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
