"use client"
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MailIcon, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState()
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.forgotPassword({'email':email})
      setSent(true)
      
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (sent){
       return ( <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="w-full max-w-lg space-y-6 bg-white rounded-2xl p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Check Your Email</h2>
      <p className="text-sm text-gray-500">
        A password reset link has been sent to <strong>{email}</strong>. Please check your inbox and follow the instructions.
      </p>
      <Button onClick={() => window.location.href = '/login'} className="w-full h-12 text-white font-semibold">
        Go to Login
      </Button>
    </div>
        </div>
       )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-6 bg-white rounded-2xl p-6"
      >
        <div className="text-center">
            <img src="/logo.svg" className="mx-auto"/>
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
          <p className="text-sm text-gray-500">
            Enter your email to receive a reset link
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            "Send Reset Link"
          )}
        </Button>
        <p className="text-sm text-red-500 text-center">{error}</p>
      </form>
    </div>
  );
}
