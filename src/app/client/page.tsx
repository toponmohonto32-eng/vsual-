"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Megaphone,
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { WHATSAPP_LINK, CALENDLY_LINK } from "@/lib/data"

interface Campaign {
  id: string
  name: string
  status: string
  budget: number
  spent: number
  leadsGoal: number
  leadsActual: number
  conversionsGoal: number
  conversionsActual: number
  roi: number
  client?: { name: string }
}

export default function ClientDashboard() {
  const { user } = useAuthStore()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns")
      const data = await res.json()
      setCampaigns(data)
    } catch (error) {
      console.error("Failed to fetch campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  const activeCampaigns = campaigns.filter(c => c.status === "active")
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0)
  const totalSpent = campaigns.reduce((sum, c) => sum + (c.spent || 0), 0)
  const totalLeads = campaigns.reduce((sum, c) => sum + (c.leadsActual || 0), 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversionsActual || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome, {user?.name}!</h1>
          <p className="text-gray-400">Track your campaign performance</p>
        </div>

        <div className="flex gap-2">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors text-sm"
          >
            Chat with us
          </a>
          <a
            href={CALENDLY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm"
          >
            <Calendar className="w-4 h-4" />
            Schedule Call
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Active Campaigns", value: activeCampaigns.length, icon: Megaphone, color: "cyan" },
          { title: "Total Budget", value: `$${totalBudget.toLocaleString()}`, icon: DollarSign, color: "green" },
          { title: "Total Leads", value: totalLeads, icon: Users, color: "purple" },
          { title: "Conversions", value: totalConversions, icon: Target, color: "pink" },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-[#12121a] border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-cyan-400" />
              Your Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => {
                const budgetProgress = campaign.budget ? (campaign.spent / campaign.budget) * 100 : 0
                const leadsProgress = campaign.leadsGoal ? (campaign.leadsActual / campaign.leadsGoal) * 100 : 0

                return (
                  <div key={campaign.id} className="p-4 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-medium">{campaign.name}</h3>
                        <Badge
                          variant="outline"
                          className={`mt-1 ${
                            campaign.status === "active" ? "border-green-500 text-green-400" :
                            campaign.status === "paused" ? "border-yellow-500 text-yellow-400" :
                            "border-gray-500 text-gray-400"
                          }`}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      {campaign.roi > 0 && (
                        <div className="flex items-center gap-1 text-green-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-medium">{campaign.roi}% ROI</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Budget</span>
                          <span className="text-white">${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                        </div>
                        <Progress value={budgetProgress} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Leads</span>
                          <span className="text-white">{campaign.leadsActual} / {campaign.leadsGoal}</span>
                        </div>
                        <Progress value={leadsProgress} className="h-2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
                      <div className="text-center">
                        <p className="text-gray-400 text-xs">Conversions</p>
                        <p className="text-white font-medium">{campaign.conversionsActual} / {campaign.conversionsGoal}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-xs">Cost per Lead</p>
                        <p className="text-white font-medium">
                          ${campaign.leadsActual ? Math.round(campaign.spent / campaign.leadsActual) : 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-xs">Conversion Rate</p>
                        <p className="text-white font-medium">
                          {campaign.leadsActual ? Math.round((campaign.conversionsActual / campaign.leadsActual) * 100) : 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              {campaigns.length === 0 && (
                <p className="text-gray-400 text-center py-8">No campaigns found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
