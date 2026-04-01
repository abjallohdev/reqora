import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

type Options = {
  params: Promise<{ id: string }>
}

export async function POST(req: Request, props: Options) {
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

    // Non-admins can't add internal comments or maybe we want to allow users to add standard comments
    // For now the prompt says "admins can add internal comment to requests"
    if (session.user.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const body = await req.json()
    const { body: commentBody, isInternal } = body

    if (!commentBody) {
      return new NextResponse('Missing comment body', { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        body: commentBody,
        isInternal: isInternal ?? true,
        requestId: id,
        authorId: session.user.id,
      },
      include: {
        author: { select: { name: true } },
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Failed to create comment', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
