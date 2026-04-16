import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/team - List all team members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const role = searchParams.get('role')
    const department = searchParams.get('department')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (role) where.role = role
    if (department) where.department = department

    const members = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        avatarUrl: true,
        status: true,
        phone: true,
        bio: true,
        location: true,
        timezone: true,
        isActive: true,
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Get team error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
