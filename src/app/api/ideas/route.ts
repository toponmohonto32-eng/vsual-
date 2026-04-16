import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET /api/ideas - List all ideas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (category) where.category = category
    if (priority) where.priority = priority

    const ideas = await db.idea.findMany({
      where,
      include: {
        submittedBy: {
          select: { id: true, name: true, avatarUrl: true }
        },
        votes: {
          select: { userId: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform to include vote count
    const transformed = ideas.map(idea => ({
      ...idea,
      votes: idea.votes.length,
      votedBy: idea.votes.map(v => v.userId),
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Get ideas error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/ideas - Create a new idea
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const idea = await db.idea.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category || 'campaign',
        status: body.status || 'idea',
        priority: body.priority || 'medium',
        submittedById: user.id,
        clientId: body.clientId,
        campaignId: body.campaignId,
        tags: body.tags?.join(',') || '',
        estimatedCost: body.estimatedCost || 0,
        expectedImpact: body.expectedImpact,
      },
      include: {
        submittedBy: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    })

    // Log activity
    await db.activity.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'submitted',
        entityType: 'idea',
        entityId: idea.id,
        entityName: idea.title,
      }
    })

    return NextResponse.json({
      ...idea,
      votes: 0,
      votedBy: [],
    })
  } catch (error) {
    console.error('Create idea error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
