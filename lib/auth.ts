import { getToken } from 'next-auth/jwt';
import type { NextApiRequest, NextApiResponse } from 'next';

// NextApiRequest 타입 확장
declare module 'next' {
  interface NextApiRequest {
    user?: {
      id: string;
      email: string;
      name: string;
      role?: 'SUPER_ADMIN' | 'ADMIN';
    };
  }
}

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void | NextApiResponse>;

export function withAuth(handler: ApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = await getToken({ req });

      if (!token) {
        return res.status(401).json({ error: '인증되지 않은 요청' });
      }

      req.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string
      };

      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: '인증 처리 중 오류 발생' });
    }
  };
}