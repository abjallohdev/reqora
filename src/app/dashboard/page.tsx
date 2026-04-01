'use client'

import { columns, ServiceRequest } from '@/components/columns'
import Container from '@/components/Container'
import { DataTable } from '@/components/data-table'
import RequestDetail from '@/components/RequestDetail'
import StatCard from '@/components/StatCard'
import SubmitForm from '@/components/SubmitForm'
import { Button } from '@/components/ui/button'
import { RequestStatus } from '@/lib/enums'
import { MOCK_REQUESTS } from '@/lib/constant'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

const Page = () => {
  const { data: session } = useSession()
  

  const [requests, setRequests] = useState<ServiceRequest[]>(MOCK_REQUESTS)
  const [showSubmit, setShowSubmit] = useState(false)
  const [selected, setSelected] = useState<ServiceRequest | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const filteredRequests =
    session?.user.role === 'ADMIN'
      ? requests
      : requests.filter((r) => r.submittedBy.id === session?.user.id)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = (req: ServiceRequest) => {
    setRequests((r) => [req, ...r])
    setShowSubmit(false)
    showToast('Request submitted successfully!')
  }

  const handleUpdate = (updated: ServiceRequest) => {
    setRequests((r) => r.map((x) => (x.id === updated.id ? updated : x)))
    showToast('Request updated successfully!')
  }

const counts = {
  total: filteredRequests.length,
  pending: filteredRequests.filter((r) => r.status === RequestStatus.PENDING)
    .length,
  inProgress: filteredRequests.filter(
    (r) => r.status === RequestStatus.IN_PROGRESS,
  ).length,
  completed: filteredRequests.filter(
    (r) => r.status === RequestStatus.COMPLETED,
  ).length,
}

  return (
    <>
      <div className='font-[DM_Sans,sans-serif] bg-stone-100 dark:bg-stone-900 min-h-screen text-stone-900'>
        <Container className='py-6'>
          {/* ── Page Title ── */}
          <div className='flex justify-between items-end mb-7'>
            <div>
              <h1 className='m-0 text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-300'>
                Service Requests
              </h1>
              <p className='mt-1 text-sm text-stone-400'>
                {session?.user.role === 'ADMIN'
                  ? 'Manage and update all incoming requests'
                  : 'Submit and track your service requests'}
              </p>
            </div>

            {session?.user.role !== 'ADMIN' && (
              <Button
                onClick={() => setShowSubmit(true)}
                className='bg-stone-500 text-white border-none rounded px-5 py-2.5 font-[inherit] text-sm font-semibold cursor-pointer flex items-center gap-2 hover:bg-stone-700 transition-colors'
              >
                <span className='text-lg leading-none'>+</span> New Request
              </Button>
            )}
          </div>

          {/* ── Stats ── */}
          <div className='grid grid-cols-4 gap-3.5 mb-7'>
            <StatCard
              label='Total Requests'
              value={counts.total}
              sub='All time'
              accentClass='border-l-stone-900 dark:border-l-stone-300'
            />

            <StatCard
              label='Pending'
              value={counts.pending}
              sub='Awaiting action'
              accentClass='border-l-emerald-500 dark:border-l-emerald-400'
            />

            <StatCard
              label='In Progress'
              value={counts.inProgress}
              sub='Being handled'
              accentClass='border-l-amber-500 dark:border-l-amber-400'
            />

            <StatCard
              label='Completed'
              value={counts.completed}
              sub='Closed tickets'
              accentClass='border-l-blue-500 dark:border-l-blue-400'
            />
          </div>

          {/* <DataTable
            session={session!}
            columns={columns}
            data={requests}
            onRowClick={(row) => setSelected(row)}
          /> */}

          <DataTable
            session={session!}
            columns={columns}
            data={filteredRequests} // ← was: data={requests}
            onRowClick={(row) => setSelected(row)}
          />

          {/* ── Admin Banner ── */}
          {session?.user.role === 'ADMIN' && (
            <div className='mt-4 bg-stone-900 rounded-xl px-5 py-3 flex items-center gap-2.5'>
              <div className='w-1.5 h-1.5 rounded-full bg-green-400 shrink-0' />
              <span className='text-white text-sm font-medium'>
                Admin mode active
              </span>
              <span className='text-stone-500 text-sm'>
                — Click any request to update its status, reassign, or add
                notes.
              </span>
            </div>
          )}
        </Container>
      </div>

      {/* ── Modals ── */}
      {showSubmit && (
        <SubmitForm
          onSubmit={handleSubmit}
          onClose={() => setShowSubmit(false)}
        />
      )}
      {selected && (
        <RequestDetail
          req={selected}
          onClose={() => setSelected(null)}
          isAdmin={session?.user.role === 'ADMIN'}
          onUpdate={handleUpdate}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className='fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-xl text-sm font-medium z-2000 flex items-center gap-2 shadow-2xl'>
          <span className='text-green-400 text-base'>✓</span> {toast}
        </div>
      )}
    </>
  )
}

export default Page