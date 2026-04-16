import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/contacts/[contactId] - Update contact status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  try {
    const { contactId } = await params
    const body = await request.json()

    const contact = await db.contact.update({
      where: { id: contactId },
      data: {
        status: body.status,
        thankYouSent: body.thankYouSent,
      }
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Update contact error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
