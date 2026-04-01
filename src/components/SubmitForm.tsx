import { useState } from 'react'
import { CATEGORIES, inputCls, labelCls, PRIORITIES } from '@/lib/constant'
import { ServiceRequest } from '@/lib/types'
import { Department, Priority, RequestStatus, RequestType } from '@/lib/enums'

const SubmitForm = ({
  onSubmit,
  onClose,
}: {
  onSubmit: (req: ServiceRequest) => void
  onClose: () => void
}) => {
    const [form, setForm] = useState({
    title: '',
    department: 'IT',
    priority: 'Medium',
    description: '',
    submittedBy: '',
  })
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.title || !form.submittedBy) return
    const id = `SR-${Math.floor(Math.random() * 9000 + 1000)}`

    onSubmit({
      id,
      ticketId: 'SR-010',
      title: form.title,
      department: form.department as Department,
      type: 'GENERAL' as RequestType, // or set from form if you add it
      priority: form.priority as Priority,
      status: 'PENDING' as RequestStatus,
      description: form.description,
      submittedBy: {
        id: 'user-1', // replace with real user ID if available
        name: form.submittedBy,
      },
      assignedTo: null,
      createdAt: new Date(),
    })
  }
  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h2 className='m-0 text-xl font-bold text-stone-900'>
              New Service Request
            </h2>
            <p className='mt-1 text-sm text-stone-400'>
              Fill in the details below to submit your request
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-stone-400 hover:text-stone-600 text-xl leading-none bg-transparent border-none cursor-pointer p-1 transition-colors'
          >
            ✕
          </button>
        </div>

        <div className='grid gap-4'>
          <div>
            <label className={labelCls}>Your Name *</label>
            <input
              className={inputCls}
              placeholder='Full name'
              value={form.submittedBy}
              onChange={(e) => set('submittedBy', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Request Title *</label>
            <input
              className={inputCls}
              placeholder='Brief summary of the issue'
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className={labelCls}>Category</label>
              <select
                className={inputCls}
                value={form.department}
                onChange={(e) => set('department', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select
                className={inputCls}
                value={form.priority}
                onChange={(e) => set('priority', e.target.value)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              className={`${inputCls} min-h-25 resize-y`}
              placeholder='Describe the issue in detail...'
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>
        </div>

        <div className='flex gap-2.5 mt-6'>
          <button
            onClick={onClose}
            className='flex-1 py-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-500 cursor-pointer text-sm font-[inherit] hover:bg-stone-100 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className='flex-2 py-2.5 border-none rounded-lg bg-stone-900 text-white font-semibold cursor-pointer text-sm font-[inherit] hover:bg-stone-700 transition-colors'
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmitForm
