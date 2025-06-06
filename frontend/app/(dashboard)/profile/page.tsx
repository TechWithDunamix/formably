"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Lock, Save, Send } from "lucide-react"
import { accountApi, authApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function Component() {
  const [firstName, setFirstName] = useState("John")
  const [lastName, setLastName] = useState("Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [resetEmail, setResetEmail] = useState("")
  const [profileError, setProfileError] = useState("")
  const [resetError, setResetError] = useState("")
  const { token } = useAuth()
  const router = useRouter()

  const handleSaveProfile = async () => {
    if (!token) return

    try {
      setProfileError("")
      const updatedProfile = {
        first_name: firstName,
        last_name: lastName,
        email: email,
      }
      await accountApi.updateProfile(updatedProfile, token)
      const currentSession = JSON.parse(localStorage.getItem("formably_user"))
      currentSession.first_name = firstName
      currentSession.last_name = lastName
      currentSession.email = email
      localStorage.setItem("formably_user", JSON.stringify(currentSession))
      router.refresh()
    } catch (error) {
      console.error("Error saving profile:", error)
      setProfileError("Failed to save profile. Please try again.")
    }
  }

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setResetError("Please enter an email address.")
      return
    }

    try {
      setResetError("")
      await authApi.forgotPassword({ email: resetEmail })
      console.log("Password reset request sent successfully.")
    } catch (error) {
      console.error("Error resetting password:", error)
      setResetError("Failed to send reset link. Please try again.")
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary-900">Formably</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary-600" />
              Personal Information
            </CardTitle>
            <CardDescription>View and update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {profileError && (
              <p className="text-sm text-red-600">{profileError}</p>
            )}
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} className="flex items-center gap-2 ">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Password Reset Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary-600" />
              Password Reset
            </CardTitle>
            <CardDescription>Request a password reset link to be sent to your email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email Address</Label>
              <Input
                id="resetEmail"
                type="email"
                placeholder="Enter your email address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                A secure link will be sent to your email address. Click the link to reset your password.
              </p>
            </div>
            {resetError && (
              <p className="text-sm text-red-600">{resetError}</p>
            )}
            <Separator />
            <div className="flex justify-end">
              <Button
                onClick={handlePasswordReset}
                variant="outline"
                className="flex items-center gap-2 border-primary-200 text-primary-700 hover:bg-primary-50"
              >
                <Send className="h-4 w-4" />
                Send Reset Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
