import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET /api/tasks - List all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assigneeId = searchParams.get('assigneeId')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (priority) where.priority = priority
    if (assigneeId) where.assigneeId = assigneeId

    const tasks = await db.task.findMany({
      where,
      include: {
        assignee: {
          select: { id: true, name: true, avatarUrl: true, email: true }
        },
        client: {
          select: { id: true, name: true, companyName: true }
        },
        campaign: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Get tasks error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const task = await db.task.create({
      data: {
        campaignId: body.campaignId,
        clientId: body.clientId,
        title: body.title,
        description: body.description,
        status: body.status || 'todo',
        priority: body.priority || 'medium',
        assigneeId: body.assigneeId,
        dueDate: body.dueDate,
        estimatedHours: body.estimatedHours || 0,
        tags: body.tags?.join(',') || '',
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    })

    // Log activity
    await db.activity.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'created',
        entityType: 'task',
        entityId: task.id,
        entityName: task.title,
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
