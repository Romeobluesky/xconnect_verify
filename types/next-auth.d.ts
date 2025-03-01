import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: 'SUPER_ADMIN' | 'ADMIN';
  }
  
  interface Session {
    user: User & {
      role?: 'SUPER_ADMIN' | 'ADMIN';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
  }
}