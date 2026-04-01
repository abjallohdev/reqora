'use client'
import { useSession, signOut } from 'next-auth/react'
import { ThemeToggle } from './ThemeToggle'
import Container from './Container'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'

const getInitials = (name?: string | null) => {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

const Header = () => {
  const { data: session } = useSession()

  const initials = getInitials(session?.user?.name)

  return (
    <header className='bg-white dark:bg-stone-900 px-8 flex items-center justify-between h-15'>
      <Container className='flex items-center justify-between w-full border-b-2 py-3 border-stone-200 dark:border-stone-700'>
        <div className='flex items-center gap-3'>
          <div className='w-7 h-7 bg-stone-900 dark:bg-white rounded-md flex items-center justify-center'>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <rect
                x='1'
                y='1'
                width='6'
                height='6'
                rx='1.5'
                fill='#ffffff'
                className='dark:fill-[#1a1a1a]'
              />
              <rect
                x='9'
                y='1'
                width='6'
                height='6'
                rx='1.5'
                fill='#ffffff'
                className='dark:fill-[#1a1a1a]'
              />
              <rect
                x='1'
                y='9'
                width='6'
                height='6'
                rx='1.5'
                fill='#ffffff'
                className='dark:fill-[#1a1a1a]'
              />
              <rect x='9' y='9' width='6' height='6' rx='1.5' fill='#aaa' />
            </svg>
          </div>
          <span className='font-bold text-[15px] tracking-tight text-slate-800 dark:text-slate-300'>
            Reqora.
          </span>
          <span className='text-xs text-stone-500 ml-1 font-mono'>v1.0</span>
        </div>

        <nav className='flex items-center gap-1.5'>
          {['Dashboard', 'Requests', 'Analytics', 'Settings'].map((n) => (
            <button
              key={n}
              className={`px-3.5 py-1.5 rounded-md text-sm font-[inherit] cursor-pointer transition-colors ${
                n === 'Requests'
                  ? 'bg-stone-900 dark:bg-white/10 border border-stone-700 dark:border-white/15 text-white dark:text-white font-semibold'
                  : 'bg-transparent border-none text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300 font-normal'
              }`}
            >
              {n}
            </button>
          ))}
        </nav>

        <div className='flex items-center gap-3'>
          {session?.user.role === 'ADMIN' && (
            <div className='flex items-center gap-2 bg-white/7 border border-white/10 rounded-full py-1 px-2'>
              <span className='text-xs text-stone-400 font-bold'>ADMIN</span>
            </div>
          )}

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className='w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:opacity-90 transition-opacity'
                aria-label='User menu'
              >
                {initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel className='flex flex-col gap-0.5'>
                <span className='text-sm font-semibold truncate'>
                  {session?.user?.name}
                </span>
                <span className='text-xs font-normal text-muted-foreground truncate'>
                  {session?.user?.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-500/10 cursor-pointer'
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut size={14} />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Container>
    </header>
  )
}

export default Header