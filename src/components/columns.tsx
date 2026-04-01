'use client'

import { ColumnDef, Row } from '@tanstack/react-table'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { columnHeader, PRIORITY_CONFIG, STATUS_CONFIG } from '@/lib/constant'
import { useSession } from 'next-auth/react'

import { ServiceRequest } from '@/lib/types'

function RequestCell({ row }: { row: Row<ServiceRequest> }) {
  const data = row.original
  const { data: session } = useSession()
  const showSubmittedBy = session?.user?.role !== 'user'

  return (
    <div className='flex flex-col'>
      <div className='font-semibold text-sm text-stone-900 dark:text-stone-300 mb-0.5'>
        {data.title}
      </div>
      <div className='text-xs text-stone-400'>
        {data.department}
        {showSubmittedBy && (
          <>
            {' • '}
            <span className='font-semibold'>{data.submittedBy.name}</span>
          </>
        )}
      </div>
    </div>
  )
}

export const columns: ColumnDef<ServiceRequest>[] = [
  {
    accessorKey: 'ticketId',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className={`px-4 ${columnHeader}`}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Ticket ID
      </Button>
    ),
    cell: ({ getValue }) => (
      <span className='px-4 py-3.5 font-mono text-xs text-stone-400'>
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className={`px-0 ${columnHeader}`}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Request
      </Button>
    ),
    cell: ({ row }) => <RequestCell row={row} />,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className={`px-0 ${columnHeader}`}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Type
      </Button>
    ),
    cell: ({ getValue }) => (
      <span className='text-xs text-stone-500 font-mono'>
        {getValue<string>().replace(/_/g, ' ')}
      </span>
    ),
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className={`px-0 ${columnHeader}`}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Priority
      </Button>
    ),
    cell: ({ getValue }) => {
      const value = getValue<string>()
      const config = PRIORITY_CONFIG[value as keyof typeof PRIORITY_CONFIG]
      return (
        <Badge
          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide font-mono whitespace-nowrap ${config?.badge}`}
        >
          {value}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className={`px-0 ${columnHeader}`}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
      </Button>
    ),
    cell: ({ getValue }) => {
      const value = getValue<string>()
      const config = STATUS_CONFIG[value as keyof typeof STATUS_CONFIG]
      return (
        <Badge
          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide font-mono whitespace-nowrap ${config?.badge}`}
        >
          {value.replace(/_/g, ' ')}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'assignedTo',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className={`px-0 ${columnHeader}`}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Assigned To
      </Button>
    ),
    cell: ({ getValue }) => {
      const value = getValue<{ name: string } | null>()
      return (
        <span className='text-xs text-stone-500'>
          {value?.name ?? (
            <span className='italic text-stone-300'>Unassigned</span>
          )}
        </span>
      )
    },
    sortingFn: (a, b) => {
      const nameA = a.original.assignedTo?.name ?? ''
      const nameB = b.original.assignedTo?.name ?? ''
      return nameA.localeCompare(nameB)
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className={`px-0 ${columnHeader}`}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
      </Button>
    ),
    cell: ({ getValue }) => (
      <span className='font-mono text-xs text-stone-400'>
        {new Date(getValue<string>()).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </span>
    ),
  },
  {
    accessorKey: 'department',
    enableHiding: true,
    header: () => null,
    cell: () => null,
    filterFn: (row, columnId, filterValue) =>
      row.getValue(columnId) === filterValue,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
