import React from 'react'

const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`max-w-7xl mx-auto container px-4 lg:px-0 ${className}`}>{children}</div>
  )
}

export default Container