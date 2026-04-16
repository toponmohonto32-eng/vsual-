import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET /api/campaigns - List all campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')
    const type = searchParams.get('type')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (clientId) where.clientId = clientId
    if (type) where.type = type

    const campaigns = await db.campaign.findMany({
      where,
      include: {
        client: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Get campaigns error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/campaigns - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const campaign = await db.campaign.create({
      data: {
        clientId: body.clientId,
        name: body.name,
        description: body.description,
        type: body.type || 'social',
        status: body.status || 'draft',
        startDate: body.startDate,
        endDate: body.endDate,
        budget: body.budget || 0,
        leadsGoal: body.leadsGoal || 0,
        conversionsGoal: body.conversionsGoal || 0,
        tags: body.tags?.join(',') || '',
      },
      include: {
        client: true
      }
    })

    // Log activity
    await db.activity.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'created',
        entityType: 'campaign',
        entityId: campaign.id,
        entityName: campaign.name,
      }
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Create campaign error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
