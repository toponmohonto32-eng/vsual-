"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Lightbulb, ThumbsUp, Trash2, DollarSign } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth"

interface Idea {
  id: string
  title: string
  description?: string
  category: string
  status: string
  priority: string
  estimatedCost: number
  expectedImpact?: string
  votes: number
  votedBy: string[]
  submittedBy?: { id: string; name: string; avatarUrl?: string }
}

export default function IdeasPage() {
  const { user } = useAuthStore()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "campaign",
    priority: "medium",
    estimatedCost: 0,
    expectedImpact: "",
  })

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      const res = await fetch("/api/ideas")
      const data = await res.json()
      setIdeas(data)
    } catch (error) {
      console.error("Failed to fetch ideas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success("Idea submitted!")
        setDialogOpen(false)
        resetForm()
        fetchIdeas()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to submit idea")
      }
    } catch (error) {
      toast.error("Failed to submit idea")
    }
  }

  const handleVote = async (ideaId: string) => {
    try {
      const res = await fetch(`/api/ideas/${ideaId}/vote`, {
        method: "POST",
      })

      if (res.ok) {
        fetchIdeas()
      }
    } catch (error) {
      toast.error("Failed to vote")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this idea?")) return

    try {
      const res = await fetch(`/api/ideas/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Idea deleted!")
        fetchIdeas()
      }
    } catch (error) {
      toast.error("Failed to delete idea")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "campaign",
      priority: "medium",
      estimatedCost: 0,
      expectedImpact: "",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented": return "border-green-500 text-green-400"
      case "in_development": return "border-cyan-500 text-cyan-400"
      case "rejected": return "border-red-500 text-red-400"
      default: return "border-gray-500 text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Ideas Vault</h1>
          <p className="text-gray-400">Submit and vote on innovative ideas</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              New Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#12121a] border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Submit New Idea</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-300">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  <Label className="text-gray-300">Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#12121a] border-white/10">
                      <SelectItem value="campaign">Campaign</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="process">Process</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Priority</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#12121a] border-white/10">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Estimated Cost ($)</Label>
                <Input
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: parseFloat(e.target.value) || 0 })}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div>
                <Label className="text-gray-300">Expected Impact</Label>
                <Input
                  value={formData.expectedImpact}
                  onChange={(e) => setFormData({ ...formData, expectedImpact: e.target.value })}
                  className="bg-white/5 border-white/10"
                  placeholder="e.g., Increase leads by 30%"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600">
                Submit Idea
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea, index) => {
            const hasVoted = user && idea.votedBy.includes(user.id)

            return (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-[#12121a] border-white/10 hover:border-pink-500/30 transition-colors h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline" className={getStatusColor(idea.status)}>
                        {idea.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2">{idea.title}</h3>
                    {idea.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{idea.description}</p>
                    )}

                    {idea.expectedImpact && (
                      <p className="text-xs text-pink-400 mb-4">Impact: {idea.expectedImpact}</p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${hasVoted ? "text-pink-400" : "text-gray-400"} hover:text-pink-300`}
                        onClick={() => handleVote(idea.id)}
                      >
                        <ThumbsUp className={`w-4 h-4 mr-1 ${hasVoted ? "fill-current" : ""}`} />
                        {idea.votes}
                      </Button>

                      {idea.estimatedCost > 0 && (
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <DollarSign className="w-3 h-3" />
                          {idea.estimatedCost.toLocaleString()}
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(idea.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
          {ideas.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              No ideas yet. Submit your first idea!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
