"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Navigation, Eye, EyeOff } from "lucide-react"
import { signIn } from "next-auth/react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin =  async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevents NextAuth from redirecting automatically
    });

    console.log("result: ", result)
    if (!result?.error) {
      router.push("/admin/dashboard"); // Redirect to the dashboard on successful login
    } else {
      // If the login fails, display the error message
      setError("Invalid credentials. Please try again.");
      setIsLoading(false)
    }

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Navigation className="size-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full cursor-pointer">
              {isLoading ? <Loader2 className="animate-spin"/> : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}