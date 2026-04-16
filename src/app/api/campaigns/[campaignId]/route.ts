import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET /api/campaigns/[campaignId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      include: {
        client: true
      }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Get campaign error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/campaigns/[campaignId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { campaignId } = await params
    const body = await request.json()

    const campaign = await db.campaign.update({
      where: { id: campaignId },
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        status: body.status,
        startDate: body.startDate,
        endDate: body.endDate,
        budget: body.budget,
        spent: body.spent,
        leadsGoal: body.leadsGoal,
        leadsActual: body.leadsActual,
        conversionsGoal: body.conversionsGoal,
        conversionsActual: body.conversionsActual,
        roi: body.roi,
        tags: body.tags?.join?.(',') || body.tags,
      },
      include: {
        client: true
      }
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Update campaign error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/campaigns/[campaignId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { campaignId } = await params
    await db.campaign.delete({
      where: { id: campaignId }
    })

    return NextResponse.json({ message: 'Campaign deleted successfully' })
  } catch (error) {
    console.error('Delete campaign error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
