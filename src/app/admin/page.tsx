"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Megaphone,
  CheckSquare,
  Lightbulb,
  DollarSign,
  TrendingUp,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface Stats {
  totalClients: number
  activeCampaigns: number
  totalTasks: number
  completedTasks: number
  totalIdeas: number
  teamMembers: number
  totalBudget: number
  totalSpent: number
}

interface Campaign {
  id: string
  name: string
  status: string
  budget: number
  spent: number
  type: string
  client?: { name: string; companyName: string }
}

interface Task {
  id: string
  title: string
  status: string
  priority: string
  dueDate?: string
  assignee?: { id: string; name: string; avatarUrl?: string }
}

interface TeamMember {
  id: string
  name: string
  role: string
  status: string
  avatarUrl?: string
}

interface ActivityItem {
  id: string
  userName: string
  action: string
  entityType: string
  entityName: string
  details?: string
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard")
        const data = await res.json()
        setStats(data.stats)
        setCampaigns(data.campaigns)
        setTasks(data.tasks)
        setTeamMembers(data.teamMembers)
        setActivities(data.activities)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Clients",
      value: stats?.totalClients || 0,
      icon: Users,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
    {
      title: "Active Campaigns",
      value: stats?.activeCampaigns || 0,
      icon: Megaphone,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Total Tasks",
      value: stats?.totalTasks || 0,
      icon: CheckSquare,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      subtext: `${stats?.completedTasks || 0} completed`,
    },
    {
      title: "Ideas",
      value: stats?.totalIdeas || 0,
      icon: Lightbulb,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
  ]

  const budgetUsed = stats?.totalBudget ? (stats.totalSpent / stats.totalBudget) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here&apos;s your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-[#12121a] border-white/10 hover:border-pink-500/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                {stat.subtext && (
                  <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Budget Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Budget Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-sm">Total Budget</p>
                <p className="text-2xl font-bold text-white">
                  ${(stats?.totalBudget || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-white">
                  ${(stats?.totalSpent || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Budget Utilization</span>
                <span className="text-white font-medium">{budgetUsed.toFixed(1)}%</span>
              </div>
              <Progress value={budgetUsed} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="bg-[#12121a] border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-purple-400" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.slice(0, 5).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{campaign.name}</p>
                      <p className="text-gray-400 text-sm">
                        {campaign.client?.companyName || campaign.client?.name || "No client"}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={`${
                          campaign.status === "active"
                            ? "border-green-500 text-green-400"
                            : campaign.status === "paused"
                            ? "border-yellow-500 text-yellow-400"
                            : "border-gray-500 text-gray-400"
                        }`}
                      >
                        {campaign.status}
                      </Badge>
                      <p className="text-gray-400 text-sm mt-1">
                        ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {campaigns.length === 0 && (
                  <p className="text-gray-400 text-center py-8">No campaigns yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-[#12121a] border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatarUrl || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{member.name}</p>
                      <p className="text-gray-400 text-xs capitalize">{member.role}</p>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        member.status === "online"
                          ? "bg-green-400"
                          : member.status === "away"
                          ? "bg-yellow-400"
                          : "bg-gray-400"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tasks & Activities */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-[#12121a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-cyan-400" />
                Recent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-400"
                          : task.priority === "medium"
                          ? "bg-yellow-400"
                          : "bg-green-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{task.title}</p>
                      <p className="text-gray-400 text-xs capitalize">{task.status.replace("_", " ")}</p>
                    </div>
                    {task.assignee && (
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={task.assignee.avatarUrl || ""} />
                        <AvatarFallback className="bg-pink-500 text-white text-xs">
                          {task.assignee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-gray-400 text-center py-8">No tasks yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-[#12121a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs">
                      {activity.userName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-medium">{activity.userName}</span>{" "}
                        <span className="text-gray-400">{activity.action}</span>{" "}
                        <span className="text-pink-400">{activity.entityName}</span>
                      </p>
                      {activity.details && (
                        <p className="text-gray-400 text-xs mt-1">{activity.details}</p>
                      )}
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-gray-400 text-center py-8">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
