import { getSession } from '@/utils/proxy-helpers';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPortalRoute = pathname.startsWith('/portal');
  const isAuthRoute = pathname.startsWith('/auth');
  if (!isPortalRoute && !isAuthRoute) {
    return NextResponse.next();
  }
  const session = await getSession(request);
  if (isPortalRoute && !session) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }
  if (isAuthRoute && session && !pathname.startsWith('/auth/reset-password')) {
    return NextResponse.redirect(new URL('/portal', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
