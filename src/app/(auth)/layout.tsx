import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <Link href='/' className='flex items-center gap-2 font-medium'>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <rect x='1' y='1' width='6' height='6' rx='1.5' fill='#1a1a1a' />
              <rect x='9' y='1' width='6' height='6' rx='1.5' fill='#1a1a1a' />
              <rect x='1' y='9' width='6' height='6' rx='1.5' fill='#1a1a1a' />
              <rect x='9' y='9' width='6' height='6' rx='1.5' fill='#aaa' />
            </svg>
            Reqora.
          </Link>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          {children}
        </div>
      </div>
      <div className='relative hidden bg-muted lg:block m-1'>
        <Image
          src='https://images.pexels.com/photos/7979587/pexels-photo-7979587.jpeg'
          alt='Image'
          fill
          className='object-cover dark:brightness-[0.2] dark:grayscale rounded-lg'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          priority
        />
        <div className='absolute inset-0 bg-black/65 rounded-lg' />
      </div>
    </div>
  )
}
