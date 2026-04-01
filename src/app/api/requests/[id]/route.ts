import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

type Options = {
  params: Promise<{ id: string }>
}

export async function GET(req: Request, props: Options) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await props.params

  try {
    const request = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        submittedBy: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
        comments: {
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!request) return new NextResponse('Not Found', { status: 404 })

    if (
      request.submittedById !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    return NextResponse.json(request)
  } catch (error) {
    console.error('Failed to get request', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: Request, props: Options) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await props.params

  try {
    const request = await prisma.serviceRequest.findUnique({
      where: { id },
    })

    if (!request) return new NextResponse('Not Found', { status: 404 })

    if (
      request.submittedById !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const body = await req.json()

    // Safety check - we shouldn't allow users to change who submitted etc
    const { id: _, ticketId, submittedById, ...updatableBody } = body

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id },
      data: updatableBody,
      include: {
        submittedBy: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
        comments: {
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error('Failed to update request', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: Request, props: Options) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await props.params

  try {
    const request = await prisma.serviceRequest.findUnique({
      where: { id },
    })

    if (!request) return new NextResponse('Not Found', { status: 404 })

    if (
      request.submittedById !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    await prisma.serviceRequest.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete request', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
