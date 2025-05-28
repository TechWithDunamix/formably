'use client'

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LockIcon, Loader2 } from "lucide-react"
import { authApi } from "@/lib/api"
import { useRouter } from "next/navigation"
export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("user_id")
  const code = searchParams.get("code")

  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!userId || !code) {
      setError("Invalid or expired reset link.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      await authApi.resetPassword({ password }, userId, code)
      setSuccess("Password reset successfully. Redirecting...")
      router.push("/login")
    } catch (err: any) {
      console.error(err)
      setError(err?.detail || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-6 bg-white rounded-2xl p-6 shadow"
      >
        <div className="text-center">
          <img src="/logo.svg" className="mx-auto h-10 mb-2" alt="Logo" />
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-sm text-gray-500">Enter your new password below</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="confirm"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pl-10 h-12"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-white font-semibold"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Reset Password"}
        </Button>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {success && <p className="text-sm text-green-600 text-center">{success}</p>}
      </form>
    </div>
  )
}
