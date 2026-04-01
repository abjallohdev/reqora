export const STATUS_CONFIG = {
  PENDING: { badge: 'bg-amber-100 text-amber-800' }, // waiting / not started
  IN_PROGRESS: { badge: 'bg-blue-100 text-blue-700' }, // active work
  COMPLETED: { badge: 'bg-green-100 text-green-700' },
} as const

export const PRIORITY_CONFIG = {
  CRITICAL: { badge: 'bg-red-600 text-white' },
  HIGH: { badge: 'bg-red-100 text-red-700' },
  MEDIUM: { badge: 'bg-amber-100 text-amber-800' },
  LOW: { badge: 'bg-green-100 text-green-700' },
} as const

export const STATUS_ACCENT = {
  Open: 'border-l-emerald-500',
  'In Progress': 'border-l-amber-500',
  Resolved: 'border-l-blue-500',
  Closed: 'border-l-stone-400',
} as const

export const CATEGORIES = [
  'IT',
  'Facilities',
  'Software',
  'HR',
  'Finance',
  'Other',
]
export const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed']
export const PRIORITIES = ['High', 'Medium', 'Low']

export const inputCls =
  'w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 bg-stone-50 font-[inherit] outline-none focus:border-stone-400 transition-colors box-border dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 dark:focus:border-stone-500'
export const labelCls =
  'block text-[11px] font-semibold text-stone-500 uppercase tracking-widest mb-1.5 dark:text-stone-400'
export const selectCls =
  'px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 bg-stone-50 font-[inherit] outline-none cursor-pointer focus:border-stone-400 transition-colors dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300 dark:focus:border-stone-500'

export const columnHeader =
  'py-2.5 text-left text-[11px] font-bold text-stone-400 uppercase tracking-widest'

