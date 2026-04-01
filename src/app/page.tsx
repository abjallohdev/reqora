import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle, Clock, Shield, Users } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import Container from '@/components/Container'

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col bg-background text-foreground'>
      <Navbar />

      <main className='flex-1'>
        {/* Hero Section */}
        <section className='relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32'>
          <div className='absolute top-0 right-0 h-125 w-125 rounded-full bg-primary/5 blur-[100px]' />
          <div className='absolute bottom-0 left-0 h-100 w-100 rounded-full bg-primary/5 blur-[100px]' />

          <Container>
            <div className='grid items-center gap-12 lg:grid-cols-2'>
              <div className='flex flex-col items-center text-center lg:items-start lg:text-left'>
                <Badge
                  variant='outline'
                  className='mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500'
                >
                  Professional Service Request Management
                </Badge>
                <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
                  Streamline Your <br />
                  <span className='bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
                    Service Desk
                  </span>
                </h1>
                <p className='mt-6 max-w-135 text-lg text-muted-foreground sm:text-xl animate-in fade-in slide-in-from-bottom-6 duration-1000'>
                  Manage, track, and resolve service requests efficiently. From
                  IT support to facilities management, Reqora empowers your team
                  to deliver excellence.
                </p>
                <div className='mt-10 flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
                  <Button size='lg' asChild>
                    <Link href='/register'>Start Free Trial</Link>
                  </Button>
                  <Button size='lg' variant='outline' asChild>
                    <Link href='/login'>Access Dashboard</Link>
                  </Button>
                </div>
              </div>

              <div className='relative animate-in zoom-in duration-1000'>
                <div className='relative overflow-hidden rounded-2xl border border-border shadow-2xl'>
                  <Image
                    src='/screenshot.png'
                    alt='Reqora Dashboard Mockup'
                    width={1024}
                    height={768}
                    className='object-cover'
                    priority
                  />
                  <div className='absolute inset-0 bg-linear-to-t from-background/20 to-transparent' />
                </div>
                {/* Decorative Elements */}
                <div className='absolute -top-6 -right-6 h-12 w-12 rounded-full bg-primary/10 blur-xl' />
                <div className='absolute -bottom-6 -left-6 h-12 w-12 rounded-full bg-primary/10 blur-xl' />
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section id='features' className='py-24 bg-muted/30'>
          <Container>
            <div className='mb-16 text-center'>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
                Why Choose Reqora?
              </h2>
              <p className='mt-4 text-muted-foreground sm:text-lg'>
                Everything you need to manage your service department
                efficiently.
              </p>
            </div>

            <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
              <Card className='border-none bg-background/60 shadow-sm backdrop-blur transition-all hover:scale-105'>
                <CardHeader>
                  <div className='mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <CheckCircle className='h-5 w-5' />
                  </div>
                  <CardTitle className='text-lg'>Intelligent Routing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-sm leading-relaxed'>
                    Automatically route requests to the right department and
                    team members, reducing response times.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className='border-none bg-background/60 shadow-sm backdrop-blur transition-all hover:scale-105'>
                <CardHeader>
                  <div className='mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <Clock className='h-5 w-5' />
                  </div>
                  <CardTitle className='text-lg'>SLA Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-sm leading-relaxed'>
                    Keep your promises with built-in SLA tracking. Get notified
                    before deadlines are missed.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className='border-none bg-background/60 shadow-sm backdrop-blur transition-all hover:scale-105'>
                <CardHeader>
                  <div className='mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <Users className='h-5 w-5' />
                  </div>
                  <CardTitle className='text-lg'>Team Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-sm leading-relaxed'>
                    Empower your team with internal notes and seamless
                    communication tools for every request.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className='border-none bg-background/60 shadow-sm backdrop-blur transition-all hover:scale-105'>
                <CardHeader>
                  <div className='mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <Shield className='h-5 w-5' />
                  </div>
                  <CardTitle className='text-lg'>Enterprise Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-sm leading-relaxed'>
                    Keep your data safe with role-based access control and
                    state-of-the-art security practices.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className='py-24'>
          <Container>
            <div className='relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground md:px-16 md:py-24'>
              <div className='absolute top-0 right-0 -mr-24 -mt-24 h-64 w-64 rounded-full bg-white/10 blur-3xl' />
              <div className='absolute bottom-0 left-0 -ml-24 -mb-24 h-64 w-64 rounded-full bg-white/10 blur-3xl' />

              <div className='relative z-10 mx-auto max-w-2xl'>
                <h2 className='text-3xl font-bold tracking-tight sm:text-5xl'>
                  Ready to Transform Your Service Operations?
                </h2>
                <p className='mt-6 text-lg opacity-90'>
                  Join hundreds of organizations that trust Reqora to manage
                  their service requests and deliver exceptional support.
                </p>
                <div className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'>
                  <Button
                    size='lg'
                    variant='secondary'
                    className='w-full sm:w-auto font-bold'
                    asChild
                  >
                    <Link href='/register'>Create Your Account</Link>
                  </Button>
                  <Button
                    size='lg'
                    variant='outline'
                    className='w-full sm:w-auto bg-transparent border-white hover:bg-white/10 text-white dark:text-stone-900'
                    asChild
                  >
                    <Link href='/login'>Sign In</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <footer className='border-t py-12'>
        <Container>
          <div className='flex flex-col items-center justify-between gap-6 md:flex-row'>
            <Link href='/' className='flex items-center gap-2'>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <rect
                  x='1'
                  y='1'
                  width='6'
                  height='6'
                  rx='1.5'
                  fill='#1a1a1a'
                />
                <rect
                  x='9'
                  y='1'
                  width='6'
                  height='6'
                  rx='1.5'
                  fill='#1a1a1a'
                />
                <rect
                  x='1'
                  y='9'
                  width='6'
                  height='6'
                  rx='1.5'
                  fill='#1a1a1a'
                />
                <rect x='9' y='9' width='6' height='6' rx='1.5' fill='#aaa' />
              </svg>
              <span className='font-bold tracking-tight'>Reqora</span>
            </Link>
            <p className='text-sm text-muted-foreground'>
              © {new Date().getFullYear()} Reqora Inc. All rights reserved.
            </p>
            <div className='flex gap-6'>
              <Link
                href='#'
                className='text-xs text-muted-foreground hover:text-foreground'
              >
                Privacy Policy
              </Link>
              <Link
                href='#'
                className='text-xs text-muted-foreground hover:text-foreground'
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
