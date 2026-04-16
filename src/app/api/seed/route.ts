import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST() {
  try {
    // Check if already seeded
    const existingClients = await db.client.count()
    if (existingClients > 0) {
      return NextResponse.json({ message: 'Database already seeded' })
    }

    // Create sample users/team members
    const teamMembers = [
      {
        id: 'admin-1',
        name: 'Sal Chavez',
        email: 'sal@vsual.co',
        password: hashPassword('demo123'),
        role: 'admin',
        department: 'Management',
        status: 'online',
        bio: 'Founder & CEO of VSUAL',
        location: 'Los Angeles, CA',
        timezone: 'America/Los_Angeles',
        isActive: true,
      },
      {
        id: 'manager-1',
        name: 'Alex Chen',
        email: 'alex@vsual.co',
        password: hashPassword('demo123'),
        role: 'manager',
        department: 'Marketing',
        status: 'online',
        bio: 'Marketing Manager with 8+ years experience',
        location: 'San Francisco, CA',
        timezone: 'America/Los_Angeles',
        isActive: true,
      },
      {
        id: 'designer-1',
        name: 'Maria Garcia',
        email: 'maria@vsual.co',
        password: hashPassword('demo123'),
        role: 'designer',
        department: 'Creative',
        status: 'away',
        bio: 'Senior Designer specializing in brand identity',
        location: 'Miami, FL',
        timezone: 'America/New_York',
        isActive: true,
      },
      {
        id: 'analyst-1',
        name: 'James Wilson',
        email: 'james@vsual.co',
        password: hashPassword('demo123'),
        role: 'analyst',
        department: 'Analytics',
        status: 'online',
        bio: 'Data Analyst & Performance Marketing Specialist',
        location: 'New York, NY',
        timezone: 'America/New_York',
        isActive: true,
      },
      {
        id: 'strategist-1',
        name: 'Emma Davis',
        email: 'emma@vsual.co',
        password: hashPassword('demo123'),
        role: 'strategist',
        department: 'Content',
        status: 'offline',
        bio: 'Content Strategist & Copywriter',
        location: 'Austin, TX',
        timezone: 'America/Chicago',
        isActive: true,
      }
    ]

    await db.user.createMany({ data: teamMembers })

    // Create sample client
    const client = await db.client.create({
      data: {
        id: 'client-1',
        name: 'John Smith',
        companyName: 'Snewroof Inc.',
        email: 'john@snewroof.com',
        phone: '(555) 123-4567',
        website: 'https://snewroof.com',
        industry: 'Roofing',
        status: 'active',
        address: '123 Main Street',
        city: 'Phoenix',
        state: 'Arizona',
        country: 'USA',
        notes: 'Premium roofing company serving the Phoenix area',
      }
    })

    // Create sample campaigns
    const campaigns = await Promise.all([
      db.campaign.create({
        data: {
          clientId: client.id,
          name: 'Snewroof Spring Sale',
          description: 'Spring promotion campaign for roofing services',
          type: 'ppc',
          status: 'active',
          startDate: '2024-03-01',
          endDate: '2024-05-31',
          budget: 15000,
          spent: 8750,
          leadsGoal: 200,
          leadsActual: 156,
          conversionsGoal: 50,
          conversionsActual: 38,
          roi: 245,
          tags: 'spring,promotion,ppc',
        }
      }),
      db.campaign.create({
        data: {
          clientId: client.id,
          name: 'Solar Awareness Q1',
          description: 'Social media campaign for solar roof installations',
          type: 'social',
          status: 'active',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          budget: 10000,
          spent: 6200,
          leadsGoal: 150,
          leadsActual: 98,
          conversionsGoal: 30,
          conversionsActual: 22,
          roi: 180,
          tags: 'solar,awareness,social',
        }
      }),
      db.campaign.create({
        data: {
          clientId: client.id,
          name: 'Local SEO Push',
          description: 'SEO optimization for local search rankings',
          type: 'seo',
          status: 'paused',
          startDate: '2024-02-01',
          endDate: '2024-06-30',
          budget: 5000,
          spent: 2100,
          leadsGoal: 100,
          leadsActual: 45,
          conversionsGoal: 20,
          conversionsActual: 12,
          roi: 120,
          tags: 'seo,local,organic',
        }
      })
    ])

    // Create sample tasks
    await Promise.all([
      db.task.create({
        data: {
          campaignId: campaigns[0].id,
          clientId: client.id,
          title: 'Review Q1 performance report',
          description: 'Analyze campaign metrics and prepare executive summary',
          status: 'in_progress',
          priority: 'high',
          assigneeId: 'analyst-1',
          dueDate: '2024-03-15',
          estimatedHours: 4,
          actualHours: 2,
          tags: 'reporting,analytics',
        }
      }),
      db.task.create({
        data: {
          campaignId: campaigns[0].id,
          clientId: client.id,
          title: 'Update landing page copy',
          description: 'Refresh headline and CTA for spring promotion',
          status: 'in_progress',
          priority: 'medium',
          assigneeId: 'strategist-1',
          dueDate: '2024-03-10',
          estimatedHours: 3,
          actualHours: 1,
          tags: 'content,landing-page',
        }
      }),
      db.task.create({
        data: {
          campaignId: campaigns[1].id,
          clientId: client.id,
          title: 'Create social media calendar',
          description: 'Plan content for Q2 social media posts',
          status: 'todo',
          priority: 'medium',
          assigneeId: 'manager-1',
          dueDate: '2024-03-20',
          estimatedHours: 6,
          actualHours: 0,
          tags: 'social,planning',
        }
      })
    ])

    // Create sample ideas
    await Promise.all([
      db.idea.create({
        data: {
          title: 'AI-Powered Chatbot for Lead Qualification',
          description: 'Implement an AI chatbot on the website to qualify leads 24/7',
          category: 'technology',
          status: 'idea',
          priority: 'high',
          submittedById: 'admin-1',
          tags: 'ai,automation,leads',
          estimatedCost: 5000,
          expectedImpact: 'Increase lead conversion by 30%',
        }
      }),
      db.idea.create({
        data: {
          title: 'Virtual Reality Roof Inspection',
          description: 'Use VR technology for remote roof inspections and presentations',
          category: 'product',
          status: 'in_development',
          priority: 'medium',
          submittedById: 'designer-1',
          tags: 'vr,innovation,presentation',
          estimatedCost: 15000,
          expectedImpact: 'Differentiate from competitors',
        }
      }),
      db.idea.create({
        data: {
          title: 'Referral Program Launch',
          description: 'Create a customer referral program with incentives',
          category: 'campaign',
          status: 'idea',
          priority: 'high',
          submittedById: 'manager-1',
          tags: 'referral,growth,customers',
          estimatedCost: 3000,
          expectedImpact: 'Generate 20% more leads through referrals',
        }
      })
    ])

    // Create sample activities
    await Promise.all([
      db.activity.create({
        data: {
          userId: 'admin-1',
          userName: 'Sal Chavez',
          action: 'created',
          entityType: 'campaign',
          entityId: campaigns[0].id,
          entityName: 'Snewroof Spring Sale',
          details: 'New PPC campaign launched',
        }
      }),
      db.activity.create({
        data: {
          userId: 'manager-1',
          userName: 'Alex Chen',
          action: 'updated',
          entityType: 'task',
          entityId: 'task-1',
          entityName: 'Review Q1 performance report',
          details: 'Status changed to in_progress',
        }
      }),
      db.activity.create({
        data: {
          userId: 'designer-1',
          userName: 'Maria Garcia',
          action: 'submitted',
          entityType: 'idea',
          entityId: 'idea-2',
          entityName: 'Virtual Reality Roof Inspection',
          details: 'New innovation idea submitted',
        }
      })
    ])

    return NextResponse.json({
      message: 'Database seeded successfully',
      data: {
        users: teamMembers.length,
        clients: 1,
        campaigns: campaigns.length,
        tasks: 3,
        ideas: 3,
        activities: 3
      }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
