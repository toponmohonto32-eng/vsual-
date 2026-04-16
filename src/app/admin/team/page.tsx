"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department?: string
  avatarUrl?: string
  status: string
  bio?: string
  location?: string
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/team")
      const data = await res.json()
      setMembers(data)
    } catch (error) {
      console.error("Failed to fetch team:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "border-pink-500 text-pink-400"
      case "manager": return "border-purple-500 text-purple-400"
      case "designer": return "border-cyan-500 text-cyan-400"
      case "analyst": return "border-amber-500 text-amber-400"
      default: return "border-gray-500 text-gray-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-400"
      case "away": return "bg-yellow-400"
      default: return "bg-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Team</h1>
        <p className="text-gray-400">Your amazing team members</p>
      </div>

      {/* Team Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-[#12121a] border-white/10 hover:border-pink-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={member.avatarUrl || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xl">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#12121a] ${getStatusColor(member.status)}`} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                      <p className="text-gray-400 text-sm">{member.email}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                        {member.department && (
                          <Badge variant="outline" className="border-white/20 text-gray-400">
                            {member.department}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {member.bio && (
                    <p className="text-gray-400 text-sm mt-4 line-clamp-2">{member.bio}</p>
                  )}

                  {member.location && (
                    <p className="text-gray-500 text-xs mt-2">{member.location}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {members.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              No team members found.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
