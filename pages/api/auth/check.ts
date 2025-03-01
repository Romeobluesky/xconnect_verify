import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '허용되지 않는 메소드' });
  }

  if (!req.user?.email) {
    return res.status(401).json({ error: '인증되지 않은 요청' });
  }

  try {
    // 토큰의 이메일로 실제 데이터베이스의 사용자 정보를 조회
    const user = await prisma.admin.findUnique({
      where: {
        email: req.user.email
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없음' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('사용자 정보 조회 에러:', error);
    return res.status(500).json({ error: '서버 에러' });
  }
}

export default withAuth(handler);