import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

type Options = {
  params: Promise<{ id: string; commentId: string }>
}

export async function DELETE(req: Request, props: Options) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id, commentId } = await props.params

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) return new NextResponse('Not Found', { status: 404 })

    if (session.user.role !== 'ADMIN' && comment.authorId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    await prisma.comment.delete({
      where: { id: commentId },
    })

    // Return the deleted ID for Redux to mutate state
    return NextResponse.json({ deletedCommentId: commentId })
  } catch (error) {
    console.error('Failed to delete comment', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
