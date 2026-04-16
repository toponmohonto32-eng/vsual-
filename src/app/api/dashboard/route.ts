import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get stats
    const totalClients = await db.client.count()
    const activeCampaigns = await db.campaign.count({ where: { status: 'active' } })
    const totalTasks = await db.task.count()
    const completedTasks = await db.task.count({ where: { status: 'completed' } })
    const totalIdeas = await db.idea.count()
    const totalTeam = await db.user.count()

    // Get campaigns with client data
    const campaigns = await db.campaign.findMany({
      take: 10,
      include: {
        client: true
      }
    })

    // Get team members
    const teamMembers = await db.user.findMany({
      take: 20,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        status: true,
        department: true,
      }
    })

    // Get recent tasks
    const tasks = await db.task.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        assignee: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    })

    // Get recent activities
    const activities = await db.activity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    })

    // Calculate budget stats
    const campaignsAll = await db.campaign.findMany({
      select: { budget: true, spent: true }
    })
    const totalBudget = campaignsAll.reduce((sum, c) => sum + (c.budget || 0), 0)
    const totalSpent = campaignsAll.reduce((sum, c) => sum + (c.spent || 0), 0)

    return NextResponse.json({
      stats: {
        totalClients,
        activeCampaigns,
        totalTasks,
        completedTasks,
        totalIdeas,
        teamMembers: totalTeam,
        totalBudget,
        totalSpent
      },
      campaigns,
      teamMembers,
      tasks,
      activities
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
