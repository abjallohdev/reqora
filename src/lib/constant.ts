import { Department, Priority, RequestStatus, RequestType } from '@/lib/enums'
import { ServiceRequest } from './types'

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
  'w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 bg-stone-50 font-[inherit] outline-none focus:border-stone-400 transition-colors box-border'
export const labelCls =
  'block text-[11px] font-semibold text-stone-500 uppercase tracking-widest mb-1.5'
export const selectCls =
  'px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 bg-stone-50 font-[inherit] outline-none cursor-pointer focus:border-stone-400 transition-colors'

export const columnHeader =
  'py-2.5 text-left text-[11px] font-bold text-stone-400 uppercase tracking-widest'


export const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: 'cm001',
    ticketId: 'SR-001',
    title: 'Laptop replacement needed',
    department: Department.IT_SUPPORT,
    type: RequestType.HARDWARE_REQUEST,
    priority: Priority.HIGH,
    status: RequestStatus.IN_PROGRESS,
    submittedBy: { id: 'usr-001', name: 'Alex Chen' },
    assignedTo: { id: 'usr-010', name: 'IT Team' },
    createdAt: new Date('2025-03-28'),
    description: 'My laptop is crashing frequently and affecting productivity.',
  },
  {
    id: 'cm002',
    ticketId: 'SR-002',
    title: 'AC not working in Room 204',
    department: Department.FACILITIES,
    type: RequestType.MAINTENANCE,
    priority: Priority.MEDIUM,
    status: RequestStatus.PENDING,
    submittedBy: { id: 'usr-002', name: 'Maria Santos' },
    assignedTo: null,
    createdAt: new Date('2025-03-29'),
    description:
      'The air conditioning unit in meeting room 204 stopped working.',
  },
  {
    id: 'cm003',
    ticketId: 'SR-003',
    title: 'Access to design software',
    department: Department.ENGINEERING,
    type: RequestType.SOFTWARE_ACCESS,
    priority: Priority.MEDIUM,
    status: RequestStatus.COMPLETED,
    submittedBy: { id: 'usr-003', name: 'James Okafor' },
    assignedTo: { id: 'usr-011', name: 'Procurement' },
    createdAt: new Date('2025-03-25'),
    description: 'Need Adobe Creative Cloud license for design work.',
  },
  {
    id: 'cm004',
    ticketId: 'SR-004',
    title: 'New employee onboarding setup',
    department: Department.HumanResources,
    type: RequestType.ONBOARDING,
    priority: Priority.HIGH,
    status: RequestStatus.PENDING,
    submittedBy: { id: 'usr-004', name: 'Priya Nair' },
    assignedTo: null,
    createdAt: new Date('2025-03-30'),
    description:
      'Need accounts and hardware setup for new hire starting Monday.',
  },
  {
    id: 'cm005',
    ticketId: 'SR-005',
    title: 'VPN connectivity issues',
    department: Department.IT_SUPPORT,
    type: RequestType.OTHER,
    priority: Priority.LOW,
    status: RequestStatus.COMPLETED,
    submittedBy: { id: 'usr-005', name: 'Tom Breslin' },
    assignedTo: { id: 'usr-012', name: 'Network Team' },
    createdAt: new Date('2025-03-22'),
    description: 'Intermittent VPN drops when working remotely.',
  },
  {
    id: 'cm006',
    ticketId: 'SR-006',
    title: 'Broken office chair',
    department: Department.FACILITIES,
    type: RequestType.MAINTENANCE,
    priority: Priority.LOW,
    status: RequestStatus.IN_PROGRESS,
    submittedBy: { id: 'usr-006', name: 'Yuki Tanaka' },
    assignedTo: { id: 'usr-013', name: 'Facilities Team' },
    createdAt: new Date('2025-03-27'),
    description: 'Office chair armrest is broken and needs replacement.',
  },
  {
    id: 'cm007',
    ticketId: 'SR-007',
    title: 'Expense reimbursement for client dinner',
    department: Department.FINANCE,
    type: RequestType.EXPENSE_REIMBURSEMENT,
    priority: Priority.LOW,
    status: RequestStatus.PENDING,
    submittedBy: { id: 'usr-007', name: 'Sophie Müller' },
    assignedTo: null,
    createdAt: new Date('2025-03-31'),
    description: 'Requesting reimbursement for client dinner on March 28th.',
  },
  {
    id: 'cm008',
    ticketId: 'SR-008',
    title: 'Security compliance training enrollment',
    department: Department.LEGAL,
    type: RequestType.TRAINING,
    priority: Priority.CRITICAL,
    status: RequestStatus.PENDING,
    submittedBy: { id: 'usr-008', name: 'David Osei' },
    assignedTo: null,
    createdAt: new Date('2025-04-01'),
    description:
      'Whole team needs to complete mandatory security compliance training by EOQ.',
  },
  {
    id: 'cm009',
    ticketId: 'SR-009',
    title: 'Clarification on remote work policy',
    department: Department.HumanResources,
    type: RequestType.POLICY_CLARIFICATION,
    priority: Priority.MEDIUM,
    status: RequestStatus.IN_PROGRESS,
    submittedBy: { id: 'usr-009', name: 'Lena Fischer' },
    assignedTo: { id: 'usr-014', name: 'HR Team' },
    createdAt: new Date('2025-03-26'),
    description:
      'Need clarification on the updated hybrid work policy effective Q2.',
  },
]
