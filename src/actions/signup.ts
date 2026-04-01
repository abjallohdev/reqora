'use server'

// import { signIn } from '@/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const DEPARTMENTS = [
  'ENGINEERING',
  'HumanResources',
  'FINANCE',
  'OPERATIONS',
  'MARKETING',
  'LEGAL',
  'IT_SUPPORT',
  'FACILITIES',
] as const

const signupSchema = z.object({
  name: z.string().min(2).max(64),
  email: z.string().email(),
  department: z.enum(DEPARTMENTS, {
    errorMap: () => ({ message: 'Please select a valid department' }),
  }),
  password: z.string().min(8),
})

export async function signup(values: z.infer<typeof signupSchema>) {
  const parsed = signupSchema.safeParse(values)
  if (!parsed.success) return { error: 'Invalid fields' }

  const { name, email, department, password } = parsed.data

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser)
    return { error: 'An account with this email already exists' }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: { name, email, department, password: hashedPassword },
  })

  //   await signIn('credentials', { email, password, redirectTo: '/dashboard' })
  redirect('/login')
}
