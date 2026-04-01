'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import Container from './Container'

export const Navbar = () => {
  return (
    <nav className='fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <Container>
        <div className='flex h-16 items-center justify-between'>
          <Link href='/' className='flex items-center gap-2'>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <rect x='1' y='1' width='6' height='6' rx='1.5' fill='#1a1a1a' />
              <rect x='9' y='1' width='6' height='6' rx='1.5' fill='#1a1a1a' />
              <rect x='1' y='9' width='6' height='6' rx='1.5' fill='#1a1a1a' />
              <rect x='9' y='9' width='6' height='6' rx='1.5' fill='#aaa' />
            </svg>
            <span className='text-xl font-bold tracking-tight'>Reqora</span>
          </Link>

          <div className='hidden items-center gap-6 md:flex'>
            <Link
              href='#features'
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
            >
              Features
            </Link>
            <Link
              href='#about'
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
            >
              About
            </Link>
          </div>

          <div className='flex items-center gap-3'>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/login'>Sign In</Link>
            </Button>
            <Button size='sm' asChild>
              <Link href='/register'>Get Started</Link>
            </Button>
          </div>
        </div>
      </Container>
    </nav>
  )
}
