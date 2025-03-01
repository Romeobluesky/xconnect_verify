import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('이메일과 비밀번호를 입력해주세요.');
        }

        const user = await prisma.admin.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true
          }
        });

        if (!user) {
          throw new Error('등록되지 않은 사용자입니다.');
        }

        const isValid = await bcryptjs.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('비밀번호가 일치하지 않습니다.');
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.name = user.name as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user && token.email && token.name) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/admin/dashboard`;
    }
  },
  session: {
    strategy: 'jwt'
  },
  events: {
    async signIn() {
      // 로그인 성공 시 실행
    }
  }
});