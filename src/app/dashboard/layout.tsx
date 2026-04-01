import React from 'react'
import AuthGuard from '@/components/auth/auth-guard'
import Header from '@/components/Header'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGuard>
      <div className='h-screen w-screen flex flex-col overflow-hidden'>
        <Header />
        <div className='flex-1 overflow-y-auto overflow-x-hidden'>
          {children}
        </div>
      </div>
    </AuthGuard>
  )
}
