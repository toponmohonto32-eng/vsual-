import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// POST /api/ideas/[ideaId]/vote - Toggle vote
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { ideaId } = await params

    // Check if idea exists
    const idea = await db.idea.findUnique({
      where: { id: ideaId },
      include: { votes: true }
    })

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    // Check if user already voted
    const existingVote = idea.votes.find(v => v.userId === user.id)

    if (existingVote) {
      // Remove vote
      await db.ideaVote.delete({
        where: { id: existingVote.id }
      })
      return NextResponse.json({
        votes: idea.votes.length - 1,
        voted: false
      })
    } else {
      // Add vote
      await db.ideaVote.create({
        data: {
          ideaId,
          userId: user.id
        }
      })
      return NextResponse.json({
        votes: idea.votes.length + 1,
        voted: true
      })
    }
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
