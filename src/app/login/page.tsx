"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Eye, EyeOff, Sparkles, ArrowRight, Loader2, Shield, Users, Briefcase, ArrowLeft } from "lucide-react"
import { useAuthStore } from "@/store/auth"

export default function LoginPage() {
  const router = useRouter()
  const { user, setUser, setToken, setLoading: setAuthLoading } = useAuthStore()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    if (user) {
      router.push("/admin")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register"
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed")
      }

      setUser(data.user)
      setToken(data.access_token)
      toast.success(isLogin ? "Welcome back!" : "Account created successfully!")
      router.push("/admin")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      // First seed the database
      await fetch("/api/seed", { method: "POST" })

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "sal@vsual.co", password: "demo123" }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Demo login failed")
      }

      setUser(data.user)
      setToken(data.access_token)
      toast.success("Welcome to the demo!")
      router.push("/admin")
    } catch (error) {
      toast.error("Demo login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Back to Home */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Home</span>
      </Link>

      {/* Background elements */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Animated orbs */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
        style={{
          background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
          left: "-10%",
          top: "10%",
        }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full blur-3xl opacity-15"
        style={{
          background: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)",
          right: "-5%",
          bottom: "10%",
        }}
        animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="absolute -inset-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 text-pink-400" />
              <Sparkles className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 text-purple-400" />
            </motion.div>
            <div className="w-16 h-16 rounded-xl shadow-2xl shadow-pink-500/30 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
          </motion.div>
          <h1 className="mt-4 text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Visual Digital Media
          </h1>
        </motion.div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-white">
              {isLogin ? "Portal Login" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isLogin
                ? "Access your Admin, Team, or Client portal"
                : "Start your marketing journey today"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    required={!isLogin}
                  />
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0a0a0f] px-2 text-gray-500">Or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 border-white/20 text-gray-300 hover:bg-white/10"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                <Sparkles className="mr-2 w-4 h-4 text-pink-400" />
                Try Demo Account
              </Button>
            </div>

            {/* Portal Info */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500 text-center mb-3">After login, access:</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                  <Shield className="w-4 h-4 text-pink-400 mx-auto mb-1" />
                  <span className="text-xs text-pink-400">Admin</span>
                </div>
                <div className="text-center p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Users className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <span className="text-xs text-purple-400">Team</span>
                </div>
                <div className="text-center p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <Briefcase className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <span className="text-xs text-cyan-400">Client</span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-pink-400 hover:text-pink-300 font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  )
}
