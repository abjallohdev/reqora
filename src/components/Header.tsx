'use client'
import { useSession } from 'next-auth/react'
import { ThemeToggle } from './ThemeToggle'
import Container from './Container'

const Header = () => {
  const { data: session } = useSession()

  return (
    <header className='dark:bg-stone-900 text-white px-8 flex items-center justify-between h-15'>
      <Container className='flex items-center justify-between w-full border-b-2 py-3 border-stone-200 dark:border-stone-700'>
        <div className='flex items-center gap-3'>
          <div className='w-7 h-7 bg-white rounded-md flex items-center justify-center'>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <rect x='1' y='1' width='6' height='6' rx='1.5' fill='#1a1a1a' />
              <rect x='9' y='1' width='6' height='6' rx='1.5' fill='#1a1a1a' />
              <rect x='1' y='9' width='6' height='6' rx='1.5' fill='#1a1a1a' />
              <rect x='9' y='9' width='6' height='6' rx='1.5' fill='#aaa' />
            </svg>
          </div>
          <span className='font-bold text-[15px] tracking-tight text-slate-800 dark:text-slate-300'>Reqora.</span>
          <span className='text-xs text-stone-500 ml-1 font-mono'>v1.0</span>
        </div>

        <nav className='flex items-center gap-1.5'>
          {['Dashboard', 'Requests', 'Analytics', 'Settings'].map((n) => (
            <button
              key={n}
              className={`px-3.5 py-1.5 rounded-md text-sm font-[inherit] cursor-pointer transition-colors ${
                n === 'Requests'
                  ? 'bg-white/10 border border-white/15 text-white font-semibold'
                  : 'bg-transparent border-none text-stone-500 hover:text-stone-300 font-normal'
              }`}
            >
              {n}
            </button>
          ))}
        </nav>

        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2 bg-white/7 border border-white/10 rounded-full py-1 pl-3 pr-1.5'>
            <span className='text-xs text-stone-400'>
              {session?.user.role === 'ADMIN' ? 'Admin' : 'User'}
            </span>
            {/* <button
              onClick={() => setIsAdmin((a) => !a)}
              className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors border-none ${session?.user.role === 'ADMIN' ? 'bg-green-500' : 'bg-stone-600'}`}
              aria-label='Toggle admin mode'
            >
              <span
                className={`block w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${session?.user.role === 'ADMIN' ? 'left-4.75' : 'left-0.5'}`}
              />
            </button> */}
          </div>
          <div className='w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-xs font-bold text-white'>
            JD
          </div>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  )
}

export default Header
