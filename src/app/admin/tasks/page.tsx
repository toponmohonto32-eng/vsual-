"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Plus, CheckSquare, Clock, AlertCircle, CheckCircle, Calendar } from "lucide-react"
import { toast } from "sonner"

interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  assignee?: { id: string; name: string; avatarUrl?: string }
  client?: { id: string; name: string }
  campaign?: { id: string; name: string }
}

interface TeamMember {
  id: string
  name: string
}

interface Client {
  id: string
  name: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assigneeId: "",
    clientId: "",
    dueDate: "",
    estimatedHours: 0,
  })

  useEffect(() => {
    fetchTasks()
    fetchTeamMembers()
    fetchClients()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks")
      const data = await res.json()
      setTasks(data)
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch("/api/team")
      const data = await res.json()
      setTeamMembers(data)
    } catch (error) {
      console.error("Failed to fetch team:", error)
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
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success("Task created!")
        setDialogOpen(false)
        resetForm()
        fetchTasks()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to create task")
      }
    } catch (error) {
      toast.error("Failed to create task")
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        toast.success("Task updated!")
        fetchTasks()
      }
    } catch (error) {
      toast.error("Failed to update task")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assigneeId: "",
      clientId: "",
      dueDate: "",
      estimatedHours: 0,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-400" />
      case "in_progress": return <Clock className="w-4 h-4 text-yellow-400" />
      default: return <CheckSquare className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 border-green-500/30"
      case "in_progress": return "bg-yellow-500/10 border-yellow-500/30"
      default: return "bg-gray-500/10 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400"
      case "medium": return "text-yellow-400"
      default: return "text-green-400"
    }
  }

  const todoTasks = tasks.filter(t => t.status === "todo")
  const inProgressTasks = tasks.filter(t => t.status === "in_progress")
  const completedTasks = tasks.filter(t => t.status === "completed")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="text-gray-400">Manage and track your team&apos;s tasks</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#12121a] border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>New Task</DialogTitle>
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
                  <Label className="text-gray-300">Priority</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#12121a] border-white/10">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Assignee</Label>
                  <Select value={formData.assigneeId} onValueChange={(v) => setFormData({ ...formData, assigneeId: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#12121a] border-white/10">
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Due Date</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600">
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* To Do */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-white">To Do</h3>
              <Badge variant="outline" className="border-gray-500 text-gray-400">{todoTasks.length}</Badge>
            </div>
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <TaskCard key={task.id} task={task} onUpdate={updateTaskStatus} />
              ))}
            </div>
          </div>

          {/* In Progress */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">In Progress</h3>
              <Badge variant="outline" className="border-yellow-500 text-yellow-400">{inProgressTasks.length}</Badge>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <TaskCard key={task.id} task={task} onUpdate={updateTaskStatus} />
              ))}
            </div>
          </div>

          {/* Completed */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold text-white">Completed</h3>
              <Badge variant="outline" className="border-green-500 text-green-400">{completedTasks.length}</Badge>
            </div>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} onUpdate={updateTaskStatus} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TaskCard({ task, onUpdate }: { task: Task; onUpdate: (id: string, status: string) => void }) {
  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-400"
      case "medium": return "bg-yellow-400"
      default: return "bg-green-400"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-[#12121a] border-white/10 hover:border-pink-500/30 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)} mt-2`} />
            {task.assignee && (
              <Avatar className="w-6 h-6">
                <AvatarImage src={task.assignee.avatarUrl || ""} />
                <AvatarFallback className="bg-pink-500 text-white text-xs">
                  {task.assignee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <h4 className="text-white font-medium mb-2">{task.title}</h4>
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
          <div className="flex gap-1">
            {task.status !== "in_progress" && (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-yellow-400 hover:text-yellow-300"
                onClick={() => onUpdate(task.id, "in_progress")}
              >
                Start
              </Button>
            )}
            {task.status !== "completed" && (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-green-400 hover:text-green-300"
                onClick={() => onUpdate(task.id, "completed")}
              >
                Complete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
