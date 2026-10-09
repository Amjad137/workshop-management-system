import {
  ADMIN_ONLY_PATHS,
  MANAGER_OR_STAFF_ONLY_PATHS,
  ROUTES,
} from '@/constants/routes.constants';
import { USER_ROLE } from '@/constants/user.constants';
import { getSession } from '@/utils/proxy-helpers';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPortalRoute = pathname.startsWith('/portal');
  const isAuthRoute = pathname.startsWith('/auth');

  // Passthrough for non-portal and non-auth routes (e.g., marketing root '/', assets)
  if (!isPortalRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Fast-path: Check for Better-Auth session cookie presence
  // If no session cookie exists on protected routes, redirect immediately without server query
  const cookieHeader = request.headers.get('cookie') ?? '';
  const hasSessionCookie =
    cookieHeader.includes('better-auth.session_token') ||
    cookieHeader.includes('__Secure-better-auth.session_token');

  // Unauthenticated visitor attempting to access protected /portal routes -> instant redirect
  if (isPortalRoute && !hasSessionCookie) {
    return NextResponse.redirect(new URL(ROUTES.SIGN_IN, request.url));
  }

  // Unauthenticated visitor on auth route -> pass through immediately without session query
  if (isAuthRoute && !hasSessionCookie) {
    return NextResponse.next();
  }

  const session = await getSession(request);
  const user = session?.user;
  const role = user?.role as USER_ROLE | undefined;

  // Unauthenticated on /portal -> redirect to sign-in
  if (isPortalRoute && !session) {
    return NextResponse.redirect(new URL(ROUTES.SIGN_IN, request.url));
  }

  // Already authenticated on auth pages (except reset-password) -> redirect to portal
  if (isAuthRoute && session && !pathname.startsWith(ROUTES.RESET_PASSWORD)) {
    return NextResponse.redirect(new URL(ROUTES.SAAS_ROOT, request.url));
  }

  // Role-Based Access Control (RBAC) on /portal routes
  if (isPortalRoute && role) {
    const isAdmin = role === USER_ROLE.ADMIN;
    const isStaff = role === USER_ROLE.STAFF;

    // 1. Block non-ADMIN from admin-only paths (/portal/users, /portal/invitations)
    const isAdminOnlyPath = ADMIN_ONLY_PATHS.some((path) => pathname.startsWith(path));
    if (isAdminOnlyPath && !isAdmin) {
      return NextResponse.redirect(new URL(ROUTES.SAAS_ROOT, request.url));
    }

    // 2. Block ADMIN from manager/staff operational paths (/portal/workshops, /portal/registrations)
    const isManagerOrStaffPath = MANAGER_OR_STAFF_ONLY_PATHS.some((path) =>
      pathname.startsWith(path),
    );
    if (isManagerOrStaffPath && isAdmin) {
      return NextResponse.redirect(new URL(ROUTES.SAAS_ROOT, request.url));
    }

    // 3. Block STAFF from audit logs (/portal/audit-logs is strictly for Admin & Manager)
    if (pathname.startsWith(ROUTES.AUDIT_LOGS_ROOT) && isStaff) {
      return NextResponse.redirect(new URL(ROUTES.SAAS_ROOT, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
