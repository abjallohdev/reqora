import { Department, Priority, RequestStatus, RequestType } from './enums'

export interface ServiceRequest {
  id: string
  ticketId: string
  title: string
  department: Department
  type: RequestType
  priority: Priority
  status: RequestStatus
  submittedBy: { id: string; name: string }
  assignedTo: { id: string; name: string } | null
  createdAt: string // Adjusted format for Redux serializability
  description: string
  comments?: {
    id: string
    body: string
    isInternal: boolean
    createdAt: string
    authorId: string
    author: { name: string }
  }[]
}
