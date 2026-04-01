'use client'

import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
// import { ServiceRequest } from './columns'
import { Department, RequestStatus, RequestType } from '@/lib/enums'
import { ServiceRequest } from '@/lib/types'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  session: { user: { role: string } }
  onRowClick?: (row: ServiceRequest) => void
}

const STATUS_OPTIONS = Object.values(RequestStatus)
const DEPARTMENT_OPTIONS = Object.values(Department)
const TYPE_OPTIONS = Object.values(RequestType)

export function DataTable<TData, TValue>({
  columns,
  data,
  session,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    assignedTo: session.user.role === 'ADMIN',
  })

  // ✅ Pagination state (rows per page controlled here)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination, // 👈 include pagination state
    },
    onPaginationChange: setPagination, // 👈 handle changes
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  })

  const getFilterValue = (columnId: string) =>
    (table.getColumn(columnId)?.getFilterValue() as string) ?? ''

  const setFilterValue = (columnId: string, value: string) =>
    table.getColumn(columnId)?.setFilterValue(value === 'all' ? '' : value)

  const formatLabel = (val: string) => val.replace(/_/g, ' ')

  return (
    <div>
      {/* ── Filters Bar ── */}
      <div className='flex lg:justify-between bg-white dark:bg-transparent border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3.5 mb-4 gap-3 items-center flex-wrap'>
        <Input
          placeholder='Filter by title...'
          value={getFilterValue('title')}
          onChange={(e) =>
            table.getColumn('title')?.setFilterValue(e.target.value)
          }
          className='max-w-sm'
        />

        <div className='flex flex-row space-x-3'>
          {/* Status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='px-6 text-xs font-bold text-stone-400'
              >
                {getFilterValue('status')
                  ? formatLabel(getFilterValue('status'))
                  : 'Status'}
                <ChevronDown className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setFilterValue('status', 'all')}
              >
                All
              </DropdownMenuItem>
              {STATUS_OPTIONS.map((s) => (
                <DropdownMenuItem
                  key={s}
                  onSelect={() => setFilterValue('status', s)}
                >
                  {formatLabel(s)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Department */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='px-6 text-xs font-bold text-stone-400'
              >
                {getFilterValue('department')
                  ? formatLabel(getFilterValue('department'))
                  : 'Department'}
                <ChevronDown className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setFilterValue('department', 'all')}
              >
                All
              </DropdownMenuItem>
              {DEPARTMENT_OPTIONS.map((d) => (
                <DropdownMenuItem
                  key={d}
                  onSelect={() => setFilterValue('department', d)}
                >
                  {formatLabel(d)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Type */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='px-6 text-xs font-bold text-stone-400'
              >
                {getFilterValue('type')
                  ? formatLabel(getFilterValue('type'))
                  : 'Type'}
                <ChevronDown className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setFilterValue('type', 'all')}>
                All
              </DropdownMenuItem>
              {TYPE_OPTIONS.map((t) => (
                <DropdownMenuItem
                  key={t}
                  onSelect={() => setFilterValue('type', t)}
                >
                  {formatLabel(t)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Table ── */}
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={
                    onRowClick
                      ? 'cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800'
                      : ''
                  }
                  onClick={() =>
                    onRowClick?.(row.original as unknown as ServiceRequest)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      <div className='flex items-center justify-between py-4'>
        {/* Page size selector */}
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className='border rounded px-2 py-1 text-xs text-stone-800 dark:text-stone-300 capitalize'
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>

        {/* Controls */}
        <div className='flex items-center space-x-2'>
          <span className='text-xs'>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>

          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className='border rounded px-2 py-1 text-xs text-stone-800 dark:text-stone-300 capitalize'
          >
            Previous
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className='border rounded px-2 py-1 text-xs text-stone-800 dark:text-stone-300 capitalize'
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}