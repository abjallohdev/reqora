import { Department, Priority, RequestStatus, RequestType } from "./enums"

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
  createdAt: Date
  description: string
}