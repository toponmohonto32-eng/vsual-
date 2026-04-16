"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Users,
  Megaphone,
  CheckSquare,
  Lightbulb,
  UserCircle,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronDown,
  Settings,
} from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { toast } from "sonner"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/admin/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/admin/team", label: "Team", icon: UserCircle },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (!["admin", "manager"].includes(user.role)) {
      toast.error("Access denied. Admin or Manager role required.")
      router.push("/")
    }
  }, [user, router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      // Ignore logout errors
    }
    logout()
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden lg:flex flex-col bg-[#12121a] border-r border-white/5 fixed h-full z-30"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Visual Digital Media Logo" className="w-10 h-10 rounded-lg object-contain flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-bold text-white whitespace-nowrap overflow-hidden"
                >
                  Admin Portal
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-pink-500/10 transition-colors group"
            >
              <item.icon className="w-5 h-5 flex-shrink-0 group-hover:text-pink-400" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-12 flex items-center justify-center border-t border-white/5 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronDown className={`w-5 h-5 transition-transform ${sidebarOpen ? "-rotate-90" : "rotate-90"}`} />
        </button>
      </motion.aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#12121a] border-b border-white/5 flex items-center justify-between px-4 z-30">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Visual Digital Media Logo" className="w-10 h-10 rounded-lg object-contain" />
          <span className="font-bold text-white">Admin Portal</span>
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
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-pink-500/10 transition-colors"
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
      <div className={`flex-1 flex flex-col ${sidebarOpen ? "lg:ml-[280px]" : "lg:ml-[80px]"}`}>
        {/* Top Bar */}
        <header className="h-16 bg-[#12121a]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-6 mt-16 lg:mt-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-pink-400" />
            <span className="text-gray-400 text-sm">Admin Access</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatarUrl || ""} />
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm">
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
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
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
