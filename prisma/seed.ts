// prisma/seed.ts
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import {
  Department,
  Priority,
  PrismaClient,
  RequestStatus,
  RequestType,
  UserRole,
} from '@/generated/prisma/client'

import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL as string })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

// ─── Helpers ─────────────────────────────────────────────────────────────────

const hash = (password: string) => bcrypt.hashSync(password, 10)

let ticketCounter = 1
const nextTicketId = () => `SR-${String(ticketCounter++).padStart(3, '0')}`

const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000)

// ─── Data ─────────────────────────────────────────────────────────────────────

const USER_SEED_DATA = [
  // Admins
  {
    email: 'admin@company.com',
    name: 'Alice Mercer',
    department: Department.IT_SUPPORT,
    role: UserRole.ADMIN,
    avatarUrl: 'https://i.pravatar.cc/150?u=alice',
    password: 'admin1234',
  },
  {
    email: 'ops.admin@company.com',
    name: 'Brian Cole',
    department: Department.OPERATIONS,
    role: UserRole.ADMIN,
    avatarUrl: 'https://i.pravatar.cc/150?u=brian',
    password: 'admin1234',
  },
  // Regular users
  {
    email: 'jane.doe@company.com',
    name: 'Jane Doe',
    department: Department.ENGINEERING,
    role: UserRole.USER,
    avatarUrl: 'https://i.pravatar.cc/150?u=jane',
    password: 'password123',
  },
  {
    email: 'mark.lane@company.com',
    name: 'Mark Lane',
    department: Department.HumanResources,
    role: UserRole.USER,
    avatarUrl: 'https://i.pravatar.cc/150?u=mark',
    password: 'password123',
  },
  {
    email: 'sara.kim@company.com',
    name: 'Sara Kim',
    department: Department.FINANCE,
    role: UserRole.USER,
    avatarUrl: 'https://i.pravatar.cc/150?u=sara',
    password: 'password123',
  },
  {
    email: 'tom.brooks@company.com',
    name: 'Tom Brooks',
    department: Department.MARKETING,
    role: UserRole.USER,
    avatarUrl: 'https://i.pravatar.cc/150?u=tom',
    password: 'password123',
  },
  {
    email: 'nina.patel@company.com',
    name: 'Nina Patel',
    department: Department.LEGAL,
    role: UserRole.USER,
    avatarUrl: 'https://i.pravatar.cc/150?u=nina',
    password: 'password123',
  },
  {
    email: 'carlos.reyes@company.com',
    name: 'Carlos Reyes',
    department: Department.FACILITIES,
    role: UserRole.USER,
    avatarUrl: 'https://i.pravatar.cc/150?u=carlos',
    password: 'password123',
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱  Seeding database...\n')

  // ── 1. Users ──────────────────────────────────────────────────────────────
  console.log('  Creating users...')

  const users = await Promise.all(
    USER_SEED_DATA.map(({ password, ...data }) =>
      prisma.user.upsert({
        where: { email: data.email },
        update: {},
        create: {
          ...data,
          password: hash(password),
          // Seed a credentials Account row for each user
          accounts: {
            create: {
              provider: 'credentials',
              providerAccountId: data.email,
            },
          },
        },
      }),
    ),
  )

  const [alice, brian, jane, mark, sara, tom, nina, carlos] = users
  const admins = [alice, brian]
  const regularUsers = [jane, mark, sara, tom, nina, carlos]

  console.log(`  ✓ ${users.length} users created\n`)

  // ── 2. Sessions (one active session per admin) ────────────────────────────
  console.log('  Creating sessions...')

  await Promise.all(
    admins.map((admin) =>
      prisma.session.create({
        data: {
          sessionToken: randomBytes(32).toString('hex'),
          userId: admin.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      }),
    ),
  )

  console.log(`  ✓ ${admins.length} sessions created\n`)

  // ── 3. Service Requests ───────────────────────────────────────────────────
  console.log('  Creating service requests...')

  const requestDefs: Array<{
    title: string
    description: string
    type: RequestType
    priority: Priority
    status: RequestStatus
    submittedBy: (typeof users)[0]
    assignedTo?: (typeof users)[0]
    createdAt: Date
    resolvedAt?: Date
  }> = [
    {
      title: 'Request access to Figma',
      description:
        'I need a Figma seat to collaborate with the design team on the upcoming rebrand project. Please assign a Professional plan licence.',
      type: RequestType.SOFTWARE_ACCESS,
      priority: Priority.MEDIUM,
      status: RequestStatus.COMPLETED,
      submittedBy: tom,
      assignedTo: alice,
      createdAt: daysAgo(14),
      resolvedAt: daysAgo(11),
    },
    {
      title: 'Laptop keyboard replacement',
      description:
        'Three keys on my MacBook Pro keyboard are stuck and unresponsive (specifically E, R, and T). This is significantly slowing down my work.',
      type: RequestType.HARDWARE_REQUEST,
      priority: Priority.HIGH,
      status: RequestStatus.IN_PROGRESS,
      submittedBy: jane,
      assignedTo: alice,
      createdAt: daysAgo(5),
    },
    {
      title: 'Onboarding setup for new hire',
      description:
        'We have a new engineer starting on Monday. Please provision email, Slack, GitHub org access, and a laptop from the spare pool.',
      type: RequestType.ONBOARDING,
      priority: Priority.CRITICAL,
      status: RequestStatus.IN_PROGRESS,
      submittedBy: mark,
      assignedTo: brian,
      createdAt: daysAgo(3),
    },
    {
      title: 'Expense reimbursement — team lunch',
      description:
        'Requesting reimbursement of $185.40 for a team lunch on 2024-03-10. Receipt is attached. This was pre-approved by my manager.',
      type: RequestType.EXPENSE_REIMBURSEMENT,
      priority: Priority.LOW,
      status: RequestStatus.PENDING,
      submittedBy: sara,
      createdAt: daysAgo(2),
    },
    {
      title: 'Clarification on remote work policy',
      description:
        'The updated remote work policy document on the intranet seems to contradict the version emailed last month. Can HR/Legal provide the authoritative version?',
      type: RequestType.POLICY_CLARIFICATION,
      priority: Priority.LOW,
      status: RequestStatus.PENDING,
      submittedBy: nina,
      createdAt: daysAgo(1),
    },
    {
      title: 'Office AC unit not working — Floor 3',
      description:
        'The air conditioning unit on the third floor has been non-functional since Monday. Temperatures in the open-plan area are reaching uncomfortable levels.',
      type: RequestType.MAINTENANCE,
      priority: Priority.HIGH,
      status: RequestStatus.IN_PROGRESS,
      submittedBy: carlos,
      assignedTo: brian,
      createdAt: daysAgo(4),
    },
    {
      title: 'Security awareness training enrolment',
      description:
        "I'd like to enrol in the Q2 security awareness training programme. Please confirm available dates and add me to the next cohort.",
      type: RequestType.TRAINING,
      priority: Priority.MEDIUM,
      status: RequestStatus.COMPLETED,
      submittedBy: jane,
      assignedTo: alice,
      createdAt: daysAgo(20),
      resolvedAt: daysAgo(15),
    },
    {
      title: 'VPN access for contractor',
      description:
        'Our external contractor (David Walsh, david@contractor.io) needs temporary VPN access for the next 30 days to complete the API integration work.',
      type: RequestType.SOFTWARE_ACCESS,
      priority: Priority.MEDIUM,
      status: RequestStatus.PENDING,
      submittedBy: jane,
      createdAt: daysAgo(1),
    },
    {
      title: 'Standing desk request',
      description:
        "Following doctor's advice for back pain, I'd like to request a sit/stand desk converter for my workstation. Happy to provide a medical note if required.",
      type: RequestType.HARDWARE_REQUEST,
      priority: Priority.MEDIUM,
      status: RequestStatus.PENDING,
      submittedBy: tom,
      createdAt: daysAgo(1),
    },
    {
      title: 'Offboarding — James Whitfield',
      description:
        'James Whitfield (Engineering) is leaving on Friday. Please revoke all system access, recover his equipment, and archive his accounts per the offboarding checklist.',
      type: RequestType.OTHER,
      priority: Priority.CRITICAL,
      status: RequestStatus.IN_PROGRESS,
      submittedBy: mark,
      assignedTo: alice,
      createdAt: daysAgo(2),
    },
  ]

  const createdRequests = []

  for (const def of requestDefs) {
    const request = await prisma.serviceRequest.create({
      data: {
        ticketId: nextTicketId(),
        title: def.title,
        description: def.description,
        department: def.submittedBy.department,
        type: def.type,
        priority: def.priority,
        status: def.status,
        submittedById: def.submittedBy.id,
        assignedToId: def.assignedTo?.id ?? null,
        resolvedAt: def.resolvedAt ?? null,
        createdAt: def.createdAt,
      },
    })
    createdRequests.push({ ...request, _def: def })
  }

  console.log(`  ✓ ${createdRequests.length} service requests created\n`)

  // ── 4. Status Logs ────────────────────────────────────────────────────────
  console.log('  Creating status logs...')

  for (const req of createdRequests) {
    const admin = req._def.assignedTo ?? randomItem(admins)

    // Every request gets an initial PENDING creation log
    await prisma.statusLog.create({
      data: {
        requestId: req.id,
        fromStatus: null,
        toStatus: RequestStatus.PENDING,
        note: 'Request submitted.',
        changedById: req._def.submittedBy.id,
        createdAt: req.createdAt,
      },
    })

    if (
      req.status === RequestStatus.IN_PROGRESS ||
      req.status === RequestStatus.COMPLETED
    ) {
      await prisma.statusLog.create({
        data: {
          requestId: req.id,
          fromStatus: RequestStatus.PENDING,
          toStatus: RequestStatus.IN_PROGRESS,
          note: 'Picked up and assigned to an admin for review.',
          changedById: admin.id,
          createdAt: new Date(req.createdAt.getTime() + 2 * 60 * 60 * 1000), // +2 hrs
        },
      })
    }

    if (req.status === RequestStatus.COMPLETED) {
      await prisma.statusLog.create({
        data: {
          requestId: req.id,
          fromStatus: RequestStatus.IN_PROGRESS,
          toStatus: RequestStatus.COMPLETED,
          note: 'Request fulfilled. Marked as resolved.',
          changedById: admin.id,
          createdAt: req._def.resolvedAt ?? daysAgo(0),
        },
      })
    }
  }

  console.log('  ✓ Status logs created\n')

  // ── 5. Comments ───────────────────────────────────────────────────────────
  console.log('  Creating comments...')

  // Public reply on the Figma request (completed)
  const figmaReq = createdRequests[0]
  await prisma.comment.createMany({
    data: [
      {
        requestId: figmaReq.id,
        authorId: alice.id,
        body: "Hi Tom, I've located a spare Figma seat. Sending the invite to your work email now — please accept within 48 hours.",
        isInternal: false,
        createdAt: daysAgo(13),
      },
      {
        requestId: figmaReq.id,
        authorId: alice.id,
        body: 'Internal note: used the licence from the suspended contractor account (ID: FG-0042). Update the licence tracker spreadsheet.',
        isInternal: true,
        createdAt: daysAgo(13),
      },
      {
        requestId: figmaReq.id,
        authorId: tom.id,
        body: "Got it, thank you! Invite accepted and I'm all set.",
        isInternal: false,
        createdAt: daysAgo(11),
      },
    ],
  })

  // Comments on the keyboard request (in progress)
  const keyboardReq = createdRequests[1]
  await prisma.comment.createMany({
    data: [
      {
        requestId: keyboardReq.id,
        authorId: alice.id,
        body: "Hi Jane, we've raised a warranty claim with Apple. Estimated turnaround is 3–5 business days. We'll arrange a loaner keyboard in the meantime.",
        isInternal: false,
        createdAt: daysAgo(4),
      },
      {
        requestId: keyboardReq.id,
        authorId: jane.id,
        body: 'A loaner keyboard would be great, thank you!',
        isInternal: false,
        createdAt: daysAgo(4),
      },
    ],
  })

  // Internal note on the onboarding request
  const onboardingReq = createdRequests[2]
  await prisma.comment.create({
    data: {
      requestId: onboardingReq.id,
      authorId: brian.id,
      body: 'Laptop provisioned from spare pool (Asset #LT-029). Still waiting on GitHub org invite confirmation from the Engineering lead.',
      isInternal: true,
      createdAt: daysAgo(2),
    },
  })

  // Comment on the AC maintenance request
  const acReq = createdRequests[5]
  await prisma.comment.createMany({
    data: [
      {
        requestId: acReq.id,
        authorId: brian.id,
        body: "Hi Carlos, I've contacted our HVAC contractor. They have a slot tomorrow morning between 9–11am. Please ensure access to the plant room is available.",
        isInternal: false,
        createdAt: daysAgo(3),
      },
      {
        requestId: acReq.id,
        authorId: brian.id,
        body: 'Contractor visit confirmed for tomorrow. Booking ref: HVAC-2024-88.',
        isInternal: true,
        createdAt: daysAgo(3),
      },
    ],
  })

  console.log('  ✓ Comments created\n')

  console.log('✅  Seed complete!\n')
  console.log('─────────────────────────────────────')
  console.log('  Test credentials:')
  console.log('  Admin  → admin@company.com  / admin1234')
  console.log('  User   → jane.doe@company.com / password123')
  console.log('─────────────────────────────────────\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
