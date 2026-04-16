import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { db } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'vsual-digital-media-secret-key-2024'
const JWT_EXPIRATION_HOURS = 24

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, hashed: string): boolean {
  return bcrypt.compareSync(password, hashed)
}

export function createToken(userId: string, email: string): string {
  const payload = {
    sub: userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (JWT_EXPIRATION_HOURS * 60 * 60)
  }
  return jwt.sign(payload, JWT_SECRET)
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; email: string }
    return { userId: decoded.sub, email: decoded.email }
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  
  if (!token) return null
  
  const decoded = verifyToken(token)
  if (!decoded) return null
  
  const user = await db.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      status: true,
      department: true,
      phone: true,
      bio: true,
      location: true,
      timezone: true,
      isActive: true,
    }
  })
  
  return user
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: JWT_EXPIRATION_HOURS * 60 * 60
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}
