import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const contact = await db.contact.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'new',
      }
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
