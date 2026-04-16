"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  CheckSquare,
  Clock,
  CheckCircle,
  Calendar,
  Megaphone,
  Users,
} from "lucide-react"
import { useAuthStore } from "@/store/auth"

interface Task {
  id: string
  title: string
  status: string
  priority: string
  dueDate?: string
  assignee?: { id: string; name: string }
}

interface Campaign {
  id: string
  name: string
  status: string
  budget: number
  spent: number
  client?: { name: string }
}

export default function TeamDashboard() {
  const { user } = useAuthStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [tasksRes, campaignsRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/campaigns"),
      ])
      const tasksData = await tasksRes.json()
      const campaignsData = await campaignsRes.json()
      setTasks(tasksData)
      setCampaigns(campaignsData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const myTasks = tasks.filter(t => t.assignee?.id === user?.id)
  const todoTasks = myTasks.filter(t => t.status === "todo")
  const inProgressTasks = myTasks.filter(t => t.status === "in_progress")
  const completedTasks = myTasks.filter(t => t.status === "completed")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome, {user?.name}!</h1>
        <p className="text-gray-400">Here&apos;s your work overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-[#12121a] border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{todoTasks.length}</p>
                  <p className="text-gray-400 text-sm">To Do</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-[#12121a] border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{inProgressTasks.length}</p>
                  <p className="text-gray-400 text-sm">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-[#12121a] border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{completedTasks.length}</p>
                  <p className="text-gray-400 text-sm">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-[#12121a] border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{campaigns.filter(c => c.status === "active").length}</p>
                  <p className="text-gray-400 text-sm">Active Campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-[#12121a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-purple-400" />
                My Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === "high" ? "bg-red-400" :
                      task.priority === "medium" ? "bg-yellow-400" : "bg-green-400"
                    }`} />
                    <div className="flex-1">
                      <p className="text-white text-sm">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-xs ${
                          task.status === "completed" ? "border-green-500 text-green-400" :
                          task.status === "in_progress" ? "border-yellow-500 text-yellow-400" :
                          "border-gray-500 text-gray-400"
                        }`}>
                          {task.status.replace("_", " ")}
                        </Badge>
                        {task.dueDate && (
                          <span className="text-xs text-gray-500">{task.dueDate}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {myTasks.length === 0 && (
                  <p className="text-gray-400 text-center py-8">No tasks assigned to you</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-[#12121a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-pink-400" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.filter(c => c.status === "active").slice(0, 5).map((campaign) => {
                  const progress = campaign.budget ? (campaign.spent / campaign.budget) * 100 : 0
                  return (
                    <div key={campaign.id} className="p-4 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-medium">{campaign.name}</p>
                        <Badge variant="outline" className="border-green-500 text-green-400">
                          Active
                        </Badge>
                      </div>
                      {campaign.client && (
                        <p className="text-gray-400 text-sm mb-2">{campaign.client.name}</p>
                      )}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Budget</span>
                          <span>${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    </div>
                  )
                })}
                {campaigns.filter(c => c.status === "active").length === 0 && (
                  <p className="text-gray-400 text-center py-8">No active campaigns</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
