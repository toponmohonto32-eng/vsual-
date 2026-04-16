"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Megaphone, DollarSign, Users, Target } from "lucide-react"
import { toast } from "sonner"

interface Campaign {
  id: string
  name: string
  description?: string
  type: string
  status: string
  budget: number
  spent: number
  leadsGoal: number
  leadsActual: number
  conversionsGoal: number
  conversionsActual: number
  client?: { id: string; name: string; companyName?: string }
}

interface Client {
  id: string
  name: string
  companyName?: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [formData, setFormData] = useState({
    clientId: "",
    name: "",
    description: "",
    type: "social",
    status: "draft",
    budget: 0,
    leadsGoal: 0,
    conversionsGoal: 0,
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    fetchCampaigns()
    fetchClients()
  }, [search])

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

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients")
      const data = await res.json()
      setClients(data)
    } catch (error) {
      console.error("Failed to fetch clients:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCampaign ? `/api/campaigns/${editingCampaign.id}` : "/api/campaigns"
      const method = editingCampaign ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(editingCampaign ? "Campaign updated!" : "Campaign created!")
        setDialogOpen(false)
        resetForm()
        fetchCampaigns()
      } else {
        const data = await res.json()
        toast.error(data.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return

    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Campaign deleted!")
        fetchCampaigns()
      }
    } catch (error) {
      toast.error("Failed to delete campaign")
    }
  }

  const resetForm = () => {
    setFormData({
      clientId: "",
      name: "",
      description: "",
      type: "social",
      status: "draft",
      budget: 0,
      leadsGoal: 0,
      conversionsGoal: 0,
      startDate: "",
      endDate: "",
    })
    setEditingCampaign(null)
  }

  const openEditDialog = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setFormData({
      clientId: campaign.clientId || "",
      name: campaign.name,
      description: campaign.description || "",
      type: campaign.type,
      status: campaign.status,
      budget: campaign.budget,
      leadsGoal: campaign.leadsGoal,
      conversionsGoal: campaign.conversionsGoal,
      startDate: campaign.startDate || "",
      endDate: campaign.endDate || "",
    })
    setDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "border-green-500 text-green-400"
      case "paused": return "border-yellow-500 text-yellow-400"
      case "completed": return "border-cyan-500 text-cyan-400"
      default: return "border-gray-500 text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-gray-400">Track and manage your marketing campaigns</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#12121a] border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCampaign ? "Edit Campaign" : "New Campaign"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-300">Client</Label>
                <Select value={formData.clientId} onValueChange={(v) => setFormData({ ...formData, clientId: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.companyName || client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Campaign Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#12121a] border-white/10">
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="ppc">PPC</SelectItem>
                      <SelectItem value="seo">SEO</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#12121a] border-white/10">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Budget ($)</Label>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Leads Goal</Label>
                  <Input
                    type="number"
                    value={formData.leadsGoal}
                    onChange={(e) => setFormData({ ...formData, leadsGoal: parseInt(e.target.value) || 0 })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600">
                {editingCampaign ? "Update Campaign" : "Create Campaign"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign, index) => {
            const budgetUsed = campaign.budget ? (campaign.spent / campaign.budget) * 100 : 0
            const leadsProgress = campaign.leadsGoal ? (campaign.leadsActual / campaign.leadsGoal) * 100 : 0

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-[#12121a] border-white/10 hover:border-pink-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <Megaphone className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline" className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-1">{campaign.name}</h3>
                    {campaign.client && (
                      <p className="text-gray-400 text-sm mb-4">{campaign.client.companyName || campaign.client.name}</p>
                    )}

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" /> Budget
                          </span>
                          <span className="text-white">${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                        </div>
                        <Progress value={budgetUsed} className="h-1.5" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Users className="w-3 h-3" /> Leads
                          </span>
                          <span className="text-white">{campaign.leadsActual} / {campaign.leadsGoal}</span>
                        </div>
                        <Progress value={leadsProgress} className="h-1.5" />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => openEditDialog(campaign)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(campaign.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
          {campaigns.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              No campaigns found. Create your first campaign!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
