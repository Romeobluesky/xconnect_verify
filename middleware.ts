import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // API 요청은 통과
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // 로그인하지 않은 상태에서 admin 페이지 접근 시 로그인 페이지로 리다이렉트
    if (req.nextUrl.pathname.startsWith('/admin') && !req.nextauth.token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/licenses/:path*',
    '/api/users/:path*',
    '/api/auth/check'
  ]
};