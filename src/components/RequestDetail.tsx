import { labelCls, PRIORITY_CONFIG, selectCls, STATUS_CONFIG, STATUSES } from '@/lib/constant'
import { ServiceRequest } from '@/lib/types'
import { useState } from 'react'
import { Badge } from './ui/badge'

const RequestDetail = ({
  req,
  onClose,
  isAdmin,
  onUpdate,
}: {
  req: ServiceRequest
  onClose: () => void
  isAdmin: boolean
  onUpdate: (req: ServiceRequest) => void
}) => {
    const [editStatus, setEditStatus] = useState(req.status)
      // const [editAssigned, setEditAssigned] = useState(req.assignedTo)
      const [editAssigned, setEditAssigned] = useState<string>(
        req.assignedTo?.name ?? '',
      )

      const [note, setNote] = useState('')
      const sc =
        STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG] ??
        STATUS_CONFIG['PENDING']
      const pc =
        PRIORITY_CONFIG[req.priority as keyof typeof PRIORITY_CONFIG] ??
        PRIORITY_CONFIG['MEDIUM']
        
        
  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='px-7 py-6 border-b border-stone-100'>
          <div className='flex justify-between items-start'>
            <div>
              <div className='font-mono text-[11px] text-stone-400 mb-1'>
                {req.id}
              </div>
              <h2 className='m-0 text-lg font-bold text-stone-900'>
                {req.title}
              </h2>
              <div className='flex gap-2 flex-wrap mt-2.5'>
                <Badge className={sc.badge}>{req.status}</Badge>
                <Badge className={pc.badge}>{req.priority}</Badge>
                <Badge>{req.department}</Badge>
              </div>
            </div>
            <button
              onClick={onClose}
              className='text-stone-400 hover:text-stone-600 text-xl leading-none bg-transparent border-none cursor-pointer transition-colors'
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className='px-7 py-5'>
          <div className='grid grid-cols-2 gap-4 mb-5'>
            {(
              [
                ['Submitted By', req.submittedBy.name],
                ['Date', req.createdAt.toLocaleString()],
                ['Assigned To', req.assignedTo],
                ['Department', req.department],
              ] as [string, string][]
            ).map(([l, v]) => (
              <div key={l}>
                <div className='text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-1'>
                  {l}
                </div>
                <div className='text-sm text-stone-900 font-medium'>{v}</div>
              </div>
            ))}
          </div>

          <div className='mb-5'>
            <div className='text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-2'>
              Description
            </div>
            <p className='m-0 text-sm text-stone-500 leading-relaxed bg-stone-50 px-4 py-3 rounded-lg border border-stone-100'>
              {req.description || 'No description provided.'}
            </p>
          </div>

          {isAdmin && (
            <div className='bg-stone-50 border border-stone-200 rounded-xl px-5 py-4'>
              <div className='text-sm font-bold text-stone-900 mb-3.5 flex items-center gap-1.5'>
                <span>🛠</span> Admin Actions
              </div>
              <div className='grid grid-cols-2 gap-3 mb-3'>
                <div>
                  <div className={labelCls}>Status</div>
                  <select
                    className={selectCls}
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(e.target.value as typeof editStatus)
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className={labelCls}>Assign To</div>
                  {/* <input
                    className={selectCls}
                    value={editAssigned}
                    onChange={(e) => setEditAssigned(e.target.value)}
                    placeholder='Team or person'
                  /> */}
                  <input
                    className={selectCls}
                    value={editAssigned}
                    onChange={(e) => setEditAssigned(e.target.value)}
                    placeholder='Team or person'
                  />
                </div>
              </div>
              <div className='mb-3'>
                <div className={labelCls}>Internal Note</div>
                <textarea
                  className={`${selectCls} w-full min-h-17.5 resize-none box-border`}
                  placeholder='Add a note…'
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <button
                onClick={() => {
                  // onUpdate({
                  //   ...req,
                  //   status: editStatus,
                  //   assignedTo: editAssigned,
                  // })
                  onClose()
                }}
                className='px-5 py-2 bg-stone-900 text-white border-none rounded-lg cursor-pointer text-sm font-semibold font-[inherit] hover:bg-stone-700 transition-colors'
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequestDetail