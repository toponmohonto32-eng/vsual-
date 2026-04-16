"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Building2, Mail, Phone, Globe } from "lucide-react"
import { toast } from "sonner"

interface Client {
  id: string
  name: string
  companyName?: string
  email?: string
  phone?: string
  website?: string
  industry?: string
  status: string
  city?: string
  state?: string
  country: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    status: "active",
    address: "",
    city: "",
    state: "",
    country: "USA",
    notes: "",
  })

  useEffect(() => {
    fetchClients()
  }, [search])

  const fetchClients = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      const res = await fetch(`/api/clients?${params}`)
      const data = await res.json()
      setClients(data)
    } catch (error) {
      console.error("Failed to fetch clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingClient ? `/api/clients/${editingClient.id}` : "/api/clients"
      const method = editingClient ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(editingClient ? "Client updated!" : "Client created!")
        setDialogOpen(false)
        resetForm()
        fetchClients()
      } else {
        const data = await res.json()
        toast.error(data.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Operation failed")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Client deleted!")
        fetchClients()
      }
    } catch (error) {
      toast.error("Failed to delete client")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      companyName: "",
      email: "",
      phone: "",
      website: "",
      industry: "",
      status: "active",
      address: "",
      city: "",
      state: "",
      country: "USA",
      notes: "",
    })
    setEditingClient(null)
  }

  const openEditDialog = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      companyName: client.companyName || "",
      email: client.email || "",
      phone: client.phone || "",
      website: client.website || "",
      industry: client.industry || "",
      status: client.status,
      address: "",
      city: client.city || "",
      state: client.state || "",
      country: client.country,
      notes: "",
    })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-gray-400">Manage your client relationships</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#12121a] border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-300">Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-300">Company Name</Label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Website</Label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div>
                <Label className="text-gray-300">Industry</Label>
                <Input
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600">
                {editingClient ? "Update Client" : "Create Client"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white/5 border-white/10"
        />
      </div>

      {/* Clients Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-[#12121a] border-white/10 hover:border-pink-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        client.status === "active"
                          ? "border-green-500 text-green-400"
                          : "border-gray-500 text-gray-400"
                      }`}
                    >
                      {client.status}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1">{client.name}</h3>
                  {client.companyName && (
                    <p className="text-gray-400 text-sm mb-4">{client.companyName}</p>
                  )}

                  <div className="space-y-2 text-sm">
                    {client.email && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.website && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Globe className="w-4 h-4" />
                        <a href={client.website} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 truncate">
                          {client.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                      onClick={() => openEditDialog(client)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(client.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {clients.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              No clients found. Add your first client!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
