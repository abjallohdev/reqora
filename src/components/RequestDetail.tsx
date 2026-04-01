import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  labelCls,
  PRIORITY_CONFIG,
  selectCls,
  STATUS_CONFIG,
  inputCls,
} from '@/lib/constant'
import { ServiceRequest } from '@/lib/types'
import { RequestStatus } from '@/lib/enums'
import { useAppDispatch } from '@/lib/hooks'
import { addCommentRequest, deleteCommentRequest, deleteRequest, updateRequest } from '@/lib/features/request/requestSlice'


export default function RequestDetail({
  req,
  onClose,
  isAdmin,
  onUpdate,
  onDelete,
  onEdit,
  currentUserId,
}: {
  req: ServiceRequest
  onClose: () => void
  isAdmin: boolean
  onUpdate: () => void
  onDelete?: () => void
  onEdit?: (req: ServiceRequest) => void
  currentUserId?: string
}) {
  const [editStatus, setEditStatus] = useState<RequestStatus>(
    req.status as RequestStatus,
  )
  const [newComment, setNewComment] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  )
  const [errorMsg, setErrorMsg] = useState('')
  const dispatch = useAppDispatch()

  const sc =
    STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG['PENDING']
  const pc =
    PRIORITY_CONFIG[req.priority as keyof typeof PRIORITY_CONFIG] ??
    PRIORITY_CONFIG['MEDIUM']

  const handleUpdate = async () => {
    setIsUpdating(true)
    setErrorMsg('')
    try {
      await dispatch(
        updateRequest({
          id: req.id,
          status: editStatus,
        }),
      ).unwrap()

      onUpdate()
      onClose()
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMsg(err.message)
      else setErrorMsg('An unknown error occurred')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this request?')) return
    setIsDeleting(true)
    setErrorMsg('')
    try {
      await dispatch(deleteRequest(req.id)).unwrap()
      if (onDelete) onDelete()
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMsg(err.message)
      else setErrorMsg('An unknown error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setIsSubmittingComment(true)
    setErrorMsg('')
    try {
      await dispatch(
        addCommentRequest({
          id: req.id,
          body: newComment,
          isInternal: true,
        }),
      ).unwrap()
      setNewComment('')
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMsg(err.message)
      else setErrorMsg('Failed to post comment')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    setDeletingCommentId(commentId)
    setErrorMsg('')
    try {
      await dispatch(
        deleteCommentRequest({ requestId: req.id, commentId }),
      ).unwrap()
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMsg(err.message)
      else setErrorMsg('Failed to delete comment')
    } finally {
      setDeletingCommentId(null)
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center gap-3 mb-1'>
            <div className='font-mono text-xs text-stone-400 dark:text-stone-500'>
              {req.ticketId}
            </div>
          </div>
          <DialogTitle className='text-xl'>{req.title}</DialogTitle>
          <DialogDescription className='sr-only'>
            Details for service request {req.ticketId}
          </DialogDescription>
          <div className='flex gap-2 flex-wrap mt-2.5'>
            <Badge className={sc.badge}>{req.status}</Badge>
            <Badge className={pc.badge}>{req.priority}</Badge>
            <Badge>{req.department}</Badge>
          </div>
        </DialogHeader>

        {errorMsg && (
          <div className='p-3 rounded-md bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-sm mt-2'>
            {errorMsg}
          </div>
        )}

        {/* Body */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6'>
          {(
            [
              ['Submitted By', req.submittedBy.name],
              ['Date', new Date(req.createdAt).toLocaleString()],
              ['Assigned To', req.assignedTo?.name || 'Unassigned'],
              ['Request Type', req.type.replace(/_/g, ' ')],
            ] as [string, string][]
          ).map(([l, v]) => (
            <div key={l}>
              <div className='text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1'>
                {l}
              </div>
              <div className='text-sm text-stone-900 dark:text-stone-100 font-medium'>
                {v}
              </div>
            </div>
          ))}
        </div>

        <div className='mt-6'>
          <div className='text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2'>
            Description
          </div>
          <p className='m-0 text-sm text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-900 px-4 py-3 rounded-lg border border-stone-100 dark:border-stone-800'>
            {req.description || 'No description provided.'}
          </p>
        </div>

        {req.comments && req.comments.length > 0 && (
          <div className='mt-6'>
            <div className='text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2'>
              Communication Log
            </div>
            <div className='flex flex-col gap-3'>
              {req.comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3 rounded-xl border text-sm ${comment.isInternal ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50' : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800'}`}
                >
                  <div className='flex items-start justify-between gap-2 mb-1.5'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <span className='font-semibold text-stone-900 dark:text-stone-100'>
                        {comment.author?.name || 'Unknown User'}
                      </span>
                      <span className='text-xs text-stone-400'>
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                      {comment.isInternal && (
                        <Badge
                          variant='secondary'
                          className='text-[10px] uppercase font-mono h-5 bg-amber-100 text-amber-900 py-0 dark:bg-amber-900 dark:text-amber-100'
                        >
                          Internal Note
                        </Badge>
                      )}
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deletingCommentId === comment.id}
                        className='text-stone-400 hover:text-red-500 transition-colors p-1 flex-shrink-0 relative top-[-4px] right-[-4px]'
                        title='Delete Comment'
                      >
                        {deletingCommentId === comment.id ? (
                          <span className='text-[10px] uppercase font-bold text-red-400'>
                            Del...
                          </span>
                        ) : (
                          <span className='text-lg leading-none'>&times;</span>
                        )}
                      </button>
                    )}
                  </div>
                  <div className='text-stone-700 dark:text-stone-300 whitespace-pre-wrap'>
                    {comment.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-4'>
          {isAdmin && (
            <div className='bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-5 py-4'>
              <div className='text-sm font-bold text-stone-900 dark:text-stone-100 mb-3.5 flex items-center gap-1.5'>
                <span>🛠</span> Admin Actions
              </div>

              <div className='grid grid-cols-1 gap-4 mb-4'>
                <div>
                  <div className={labelCls}>Update Status</div>
                  <div className='flex flex-col sm:flex-row gap-3 mt-1'>
                    <select
                      className={`${selectCls} w-full sm:flex-1`}
                      value={editStatus}
                      onChange={(e) =>
                        setEditStatus(e.target.value as typeof editStatus)
                      }
                      disabled={isUpdating}
                    >
                      {Object.values(RequestStatus).map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleUpdate}
                      disabled={isUpdating || req.status === editStatus}
                      className='px-5 py-2 w-full sm:w-auto bg-stone-900 dark:bg-stone-100 dark:text-stone-900 text-white border-none rounded-lg cursor-pointer text-sm font-semibold font-[inherit] hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors disabled:opacity-50'
                    >
                      {isUpdating ? 'Saving...' : 'Apply Status'}
                    </button>
                  </div>
                </div>

                <div className='mt-2 pt-4 border-t border-stone-200 dark:border-stone-800'>
                  <div className={labelCls}>Add Internal Note</div>
                  <textarea
                    className={`${inputCls} min-h-[80px] w-full mt-1`}
                    placeholder='Type an admin-only comment here...'
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isSubmittingComment}
                  />
                  <div className='flex justify-end mt-2'>
                    <button
                      onClick={handleAddComment}
                      disabled={isSubmittingComment || !newComment.trim()}
                      className='px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold text-sm rounded-lg hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors disabled:opacity-50'
                    >
                      {isSubmittingComment
                        ? 'Posting...'
                        : 'Post Internal Note'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className='flex justify-between items-center'>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className='text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors font-semibold py-2 px-2 disabled:opacity-50 text-left'
            >
              {isDeleting ? 'Deleting...' : 'Delete Request'}
            </button>

            <div className='flex items-center gap-2'>
              {/* Show edit button for the request owner OR admins */}
              {onEdit && (isAdmin || currentUserId === req.submittedBy.id) && (
                <button
                  onClick={() => onEdit(req)}
                  className='px-4 py-2 text-sm font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors'
                >
                  ✏️ Edit Request
                </button>
              )}
              <button
                onClick={onClose}
                className='px-5 py-2 bg-transparent text-stone-600 dark:text-stone-300 font-semibold text-sm hover:underline'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}