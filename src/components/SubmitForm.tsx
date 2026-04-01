import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ServiceRequest } from '@/lib/types'
import { Department, Priority, RequestType } from '@/lib/enums'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { inputCls, labelCls } from '@/lib/constant'
import { useAppDispatch } from '@/lib/hooks'
import { createRequest, updateRequest } from '@/lib/features/request/requestSlice'

const requestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  department: z.nativeEnum(Department),
  type: z.nativeEnum(RequestType),
  priority: z.nativeEnum(Priority),
})

type RequestFormValues = z.infer<typeof requestSchema>

interface Props {
  onSuccess: () => void
  onClose: () => void
  /** Pass an existing request to switch to Edit mode */
  existingRequest?: ServiceRequest
}

const SubmitForm = ({ onSuccess, onClose, existingRequest }: Props) => {
  const isEditing = !!existingRequest
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: '',
      description: '',
      department: Department.IT_SUPPORT,
      type: RequestType.OTHER,
      priority: Priority.MEDIUM,
    },
  })

  // Populate form when editing an existing request
  useEffect(() => {
    if (existingRequest) {
      reset({
        title: existingRequest.title,
        description: existingRequest.description,
        department: existingRequest.department as Department,
        type: existingRequest.type as RequestType,
        priority: existingRequest.priority as Priority,
      })
    }
  }, [existingRequest, reset])

  const handleFormSubmit = async (data: RequestFormValues) => {
    try {
      if (isEditing) {
        await dispatch(
          updateRequest({ id: existingRequest!.id, ...data }),
        ).unwrap()
      } else {
        await dispatch(
          createRequest(data as unknown as Partial<ServiceRequest>),
        ).unwrap()
      }
      onSuccess()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Request' : 'New Service Request'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Editing ticket ${existingRequest!.ticketId}`
              : 'Fill in the details below to submit your request'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className='grid gap-4 mt-4'
        >
          <div>
            <label className={labelCls}>Request Title *</label>
            <input
              {...register('title')}
              className={inputCls}
              placeholder='Brief summary of the issue'
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.title.message}
              </p>
            )}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <div>
              <label className={labelCls}>Department</label>
              <select
                {...register('department')}
                className={inputCls}
                disabled={isSubmitting}
              >
                {Object.values(Department).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.department.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelCls}>Request Type</label>
              <select
                {...register('type')}
                className={inputCls}
                disabled={isSubmitting}
              >
                {Object.values(RequestType).map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className={labelCls}>Priority</label>
            <select
              {...register('priority')}
              className={inputCls}
              disabled={isSubmitting}
            >
              {Object.values(Priority).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.priority && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.priority.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelCls}>Description *</label>
            <textarea
              {...register('description')}
              className={`${inputCls} min-h-[100px] resize-y`}
              placeholder='Describe the issue in detail...'
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className='flex flex-col sm:flex-row gap-2.5 mt-6'>
            <button
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
              className='flex-1 py-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-500 cursor-pointer text-sm font-[inherit] hover:bg-stone-100 transition-colors disabled:opacity-50 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-700'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex-[2] py-2.5 border-none rounded-lg bg-stone-900 text-white font-semibold cursor-pointer text-sm font-[inherit] hover:bg-stone-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300'
            >
              {isSubmitting
                ? isEditing
                  ? 'Saving...'
                  : 'Submitting...'
                : isEditing
                  ? 'Save Changes'
                  : 'Submit Request'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SubmitForm
