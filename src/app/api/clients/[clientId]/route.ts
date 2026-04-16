import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET /api/clients/[clientId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params
    const client = await db.client.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error('Get client error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/clients/[clientId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { clientId } = await params
    const body = await request.json()

    const client = await db.client.update({
      where: { id: clientId },
      data: {
        name: body.name,
        companyName: body.companyName,
        email: body.email,
        phone: body.phone,
        website: body.website,
        industry: body.industry,
        status: body.status,
        logoUrl: body.logoUrl,
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country,
        notes: body.notes,
      }
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Update client error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/clients/[clientId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { clientId } = await params
    await db.client.delete({
      where: { id: clientId }
    })

    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error) {
    console.error('Delete client error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
