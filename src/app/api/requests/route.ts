import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import crypto from 'crypto'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const requests = await prisma.serviceRequest.findMany({
      where:
        session.user.role === 'ADMIN' ? {} : { submittedById: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        submittedBy: {
          select: { id: true, name: true },
        },
        assignedTo: {
          select: { id: true, name: true },
        },
        comments: {
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
    return NextResponse.json(requests)
  } catch (error) {
    console.error('Failed to fetch requests', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, description, department, type, priority } = body

    if (!title || !description || !department || !type) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const ticketId = `REQ-${crypto.randomUUID().split('-')[0].toUpperCase()}`

    const request = await prisma.serviceRequest.create({
      data: {
        title,
        description,
        department,
        type,
        priority: priority || 'MEDIUM',
        status: 'PENDING',
        ticketId,
        submittedById: session.user.id,
      },
      include: {
        submittedBy: {
          select: { id: true, name: true },
        },
        assignedTo: {
          select: { id: true, name: true },
        },
        comments: {
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json(request)
  } catch (error) {
    console.error('Failed to create request', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
