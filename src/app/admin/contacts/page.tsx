"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Clock, CheckCircle, Eye } from "lucide-react"
import { toast } from "sonner"

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  createdAt: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts")
      const data = await res.json()
      setContacts(data)
    } catch (error) {
      console.error("Failed to fetch contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        toast.success("Status updated!")
        fetchContacts()
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "border-pink-500 text-pink-400"
      case "read": return "border-cyan-500 text-cyan-400"
      case "replied": return "border-green-500 text-green-400"
      default: return "border-gray-500 text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
        <p className="text-gray-400">Messages from your website contact form</p>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-[#12121a] border-white/10 hover:border-pink-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{contact.name}</h3>
                          <p className="text-gray-400 text-sm">{contact.email}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(contact.status)}>
                          {contact.status}
                        </Badge>
                      </div>

                      <h4 className="text-pink-400 font-medium mb-2">{contact.subject}</h4>
                      <p className="text-gray-300 text-sm">{contact.message}</p>

                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {contact.status === "new" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                          onClick={() => updateStatus(contact.id, "read")}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      {contact.status !== "replied" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-400 hover:bg-green-500/10"
                          onClick={() => {
                            window.open(`mailto:${contact.email}?subject=Re: ${contact.subject}`)
                            updateStatus(contact.id, "replied")
                          }}
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {contacts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No contact submissions yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
