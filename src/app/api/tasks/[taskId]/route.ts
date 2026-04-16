import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// PUT /api/tasks/[taskId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { taskId } = await params
    const body = await request.json()

    const task = await db.task.update({
      where: { id: taskId },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        assigneeId: body.assigneeId,
        dueDate: body.dueDate,
        completedAt: body.completedAt,
        estimatedHours: body.estimatedHours,
        actualHours: body.actualHours,
        tags: body.tags?.join?.(',') || body.tags,
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Update task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/tasks/[taskId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { taskId } = await params
    await db.task.delete({
      where: { id: taskId }
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
