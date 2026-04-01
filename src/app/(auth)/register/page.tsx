'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye, EyeOff } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signup } from '@/actions/signup'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'

const DEPARTMENTS = [
  { value: 'ENGINEERING', label: 'Engineering' },
  { value: 'HumanResources', label: 'Human Resources' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'OPERATIONS', label: 'Operations' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'LEGAL', label: 'Legal' },
  { value: 'IT_SUPPORT', label: 'IT Support' },
  { value: 'FACILITIES', label: 'Facilities' },
] as const

type DepartmentValue = (typeof DEPARTMENTS)[number]['value']

const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(64, 'Name must be at most 64 characters')
      .refine(
        (name) => /^[a-zA-Z\s'-]+$/.test(name),
        'Name can only contain letters, spaces, hyphens, and apostrophes',
      ),
    email: z
      .string()
      .min(1, 'Email is required')
      .toLowerCase()
      .email('Please enter a valid email address')
      .refine(
        (email) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
        'Please enter a valid email address',
      ),
    department: z.enum(
      DEPARTMENTS.map((d) => d.value) as [
        DepartmentValue,
        ...DepartmentValue[],
      ],
      { errorMap: () => ({ message: 'Please select a department' }) },
    ),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .refine(
        (pw) => /[A-Z]/.test(pw),
        'Must contain at least one uppercase letter',
      )
      .refine(
        (pw) => /[a-z]/.test(pw),
        'Must contain at least one lowercase letter',
      )
      .refine((pw) => /[0-9]/.test(pw), 'Must contain at least one number')
      .refine(
        (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw),
        'Must contain at least one special character',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupFormValues = z.infer<typeof signupSchema>

const Page = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      department: undefined,
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignupFormValues) => {
    const result = await signup({
      name: data.name,
      email: data.email,
      department: data.department,
      password: data.password,
    })

    if (result?.error) {
      setError('email', { message: result.error })
    }
  }

  return (
    <div className='w-full max-w-xs'>
      <form
        className={cn('flex flex-col gap-6')}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <FieldGroup>
          <div className='flex flex-col items-center gap-1 text-center'>
            <h1 className='text-2xl font-bold'>Create your account</h1>
            <p className='text-sm text-balance text-muted-foreground'>
              Fill in the form below to create your account
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor='name'>Full Name</FieldLabel>
            <Input
              id='name'
              type='text'
              placeholder='John Doe'
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className='text-sm text-destructive'>{errors.name.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor='email'>Email</FieldLabel>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email ? (
              <p className='text-sm text-destructive'>{errors.email.message}</p>
            ) : (
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor='department'>Department</FieldLabel>
            <Controller
              name='department'
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    id='department'
                    aria-invalid={!!errors.department}
                    className={cn(errors.department && 'border-destructive')}
                  >
                    <SelectValue placeholder='Select a department' />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.department && (
              <p className='text-sm text-destructive'>
                {errors.department.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor='password'>Password</FieldLabel>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                className='pr-10'
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password ? (
              <p className='text-sm text-destructive'>
                {errors.password.message}
              </p>
            ) : (
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor='confirm-password'>Confirm Password</FieldLabel>
            <div className='relative'>
              <Input
                id='confirm-password'
                type={showConfirmPassword ? 'text' : 'password'}
                className='pr-10'
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className='absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors'
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword ? (
              <p className='text-sm text-destructive'>
                {errors.confirmPassword.message}
              </p>
            ) : (
              <FieldDescription>Please confirm your password.</FieldDescription>
            )}
          </Field>

          <Field>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting && <Spinner className='mr-2' />}
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </Button>
          </Field>

          <FieldSeparator>Or continue with</FieldSeparator>

          <Field>
            <Button variant='outline' type='button'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path
                  d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                  fill='currentColor'
                />
              </svg>
              Sign up with Google
            </Button>
            <FieldDescription className='px-6 text-center'>
              Already have an account?{' '}
              <Link href='/login' className='underline underline-offset-4'>
                Login
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}

export default Page
