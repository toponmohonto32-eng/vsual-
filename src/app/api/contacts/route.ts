import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/contacts - List all contacts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const contacts = await db.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Get contacts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
