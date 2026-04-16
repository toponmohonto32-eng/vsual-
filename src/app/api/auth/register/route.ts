import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role = 'strategist' } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Create user
    const hashedPassword = hashPassword(password)
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        department: 'Marketing',
        status: 'online',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        status: true,
        department: true,
      }
    })

    // Create token and set cookie
    const token = createToken(user.id, user.email)
    await setAuthCookie(token)

    return NextResponse.json({
      access_token: token,
      token_type: 'bearer',
      user
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
