import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// DELETE /api/ideas/[ideaId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { ideaId } = await params
    await db.idea.delete({
      where: { id: ideaId }
    })

    return NextResponse.json({ message: 'Idea deleted successfully' })
  } catch (error) {
    console.error('Delete idea error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
