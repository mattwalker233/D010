import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('d010_auth')?.value === 'authenticated'
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isAuthApi = request.nextUrl.pathname === '/api/auth'
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')

  // Allow auth API and login page through
  if (isAuthApi || isLoginPage) {
    return NextResponse.next()
  }

  // Allow other API routes through if authenticated
  if (isApiRoute && !isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
