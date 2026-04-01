// Plain const enums — safe to import in both client and server components

export const Department = {
  ENGINEERING: 'ENGINEERING',
  HumanResources: 'HumanResources',
  FINANCE: 'FINANCE',
  OPERATIONS: 'OPERATIONS',
  MARKETING: 'MARKETING',
  LEGAL: 'LEGAL',
  IT_SUPPORT: 'IT_SUPPORT',
  FACILITIES: 'FACILITIES',
} as const
export type Department = (typeof Department)[keyof typeof Department]

export const RequestType = {
  SOFTWARE_ACCESS: 'SOFTWARE_ACCESS',
  HARDWARE_REQUEST: 'HARDWARE_REQUEST',
  ONBOARDING: 'ONBOARDING',
  EXPENSE_REIMBURSEMENT: 'EXPENSE_REIMBURSEMENT',
  POLICY_CLARIFICATION: 'POLICY_CLARIFICATION',
  MAINTENANCE: 'MAINTENANCE',
  TRAINING: 'TRAINING',
  OTHER: 'OTHER',
} as const
export type RequestType = (typeof RequestType)[keyof typeof RequestType]

export const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const
export type Priority = (typeof Priority)[keyof typeof Priority]

export const RequestStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const
export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus]

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]
