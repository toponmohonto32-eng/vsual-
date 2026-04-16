"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Megaphone,
  LogOut,
  Menu,
  X,
  Briefcase,
  ChevronDown,
} from "lucide-react"
import { useAuthStore } from "@/store/auth"

const navItems = [
  { href: "/client", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client/campaigns", label: "Campaigns", icon: Megaphone },
]

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      // Ignore
    }
    logout()
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#12121a] border-r border-white/5 fixed h-full z-30">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="VSUAL Logo" className="w-10 h-10 rounded-lg object-contain" />
            <span className="font-bold text-white">Client Portal</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-cyan-500/10 transition-colors group"
            >
              <item.icon className="w-5 h-5 group-hover:text-cyan-400" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#12121a] border-b border-white/5 flex items-center justify-between px-4 z-30">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="VSUAL Logo" className="w-10 h-10 rounded-lg object-contain" />
          <span className="font-bold text-white">Client Portal</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="lg:hidden fixed inset-0 top-16 bg-[#12121a] z-20 p-4"
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-cyan-500/10 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top Bar */}
        <header className="h-16 bg-[#12121a]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-6 mt-16 lg:mt-0">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <span className="text-gray-400 text-sm">Client Access</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatarUrl || ""} />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-teal-600 text-white text-sm">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm text-white font-medium">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-[#12121a] border border-white/10 rounded-lg shadow-xl overflow-hidden"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
