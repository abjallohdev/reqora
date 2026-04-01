import NextAuth from 'next-auth'
import prisma from './lib/prisma'
import Credentials from 'next-auth/providers/credentials'
import z from 'zod'
import bcrypt from 'bcryptjs'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user?.password) return null

        const passwordMatch = await bcrypt.compare(
          parsed.data.password,
          user.password,
        )
        if (!passwordMatch) return null

        return user
      },
    }),
  ],
})
