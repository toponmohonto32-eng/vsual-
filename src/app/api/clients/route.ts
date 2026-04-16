import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET /api/clients - List all clients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { companyName: { contains: search } }
      ]
    }

    const clients = await db.client.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Get clients error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const client = await db.client.create({
      data: {
        name: body.name,
        companyName: body.companyName,
        email: body.email,
        phone: body.phone,
        website: body.website,
        industry: body.industry,
        status: body.status || 'active',
        logoUrl: body.logoUrl,
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country || 'USA',
        notes: body.notes,
      }
    })

    // Log activity
    await db.activity.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'created',
        entityType: 'client',
        entityId: client.id,
        entityName: client.name,
      }
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Create client error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
