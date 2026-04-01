import React from 'react'

const StatCard = ({
  label,
  value,
  sub,
  accentClass,
}: {
  label: string
  value: number
  sub?: string
  accentClass: string
}) => {
  return (
    <div
      className={`bg-white dark:bg-stone-700 border rounded px-6 py-5 border-l-4 ${accentClass}`}
    >
      <div className='text-[11px] font-semibold text-stone-400 dark:text-stone-200 uppercase tracking-widest mb-2'>
        {label}
      </div>
      <div className='text-4xl font-bold text-stone-900 dark:text-stone-300 font-mono leading-none'>
        {value}
      </div>
      {sub && <div className='text-xs text-stone-400 dark:text-stone-200 mt-1.5'>{sub}</div>}
    </div>
  )
}

export default StatCard