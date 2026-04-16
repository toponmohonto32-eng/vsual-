import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GoHighLevel Webhook URL - Replace with your actual webhook URL from GHL
const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL || 'https://services.leadconnectorhq.com/hooks/IyCwmMmPLSwJx4Q9Fq0d/webhook-trigger/5ebf7ebe-8c87-4fb9-b3e3-9965c5d49a3a'

// POST /api/contact - Submit contact form and push to GoHighLevel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, phone, source } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Save to local database
    const contact = await db.contact.create({
      data: {
        name,
        email,
        subject,
        message,
        phone: phone || null,
        status: 'new',
      }
    })

    // Push to GoHighLevel via Webhook
    try {
      const ghlPayload = {
        name,
        email,
        phone: phone || '',
        subject,
        message,
        source: source || 'Website Contact Form',
        website: 'vsualdigitalmedia.com',
        tags: ['Website Lead', 'Contact Form'],
        customData: {
          inquiry_subject: subject,
          submitted_at: new Date().toISOString(),
        }
      }

      const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ghlPayload),
      })

      if (ghlResponse.ok) {
        console.log('Lead successfully pushed to GoHighLevel')
      } else {
        console.error('GoHighLevel webhook failed:', await ghlResponse.text())
      }
    } catch (ghlError) {
      // Don't fail the request if GHL webhook fails
      console.error('GoHighLevel webhook error:', ghlError)
    }

    return NextResponse.json({
      success: true,
      contact,
      message: 'Message sent successfully!'
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
