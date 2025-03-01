import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '허용되지 않는 메소드' });
  }

  try {
    const programs = await prisma.license.groupBy({
      by: ['programName'],
      orderBy: {
        programName: 'asc'
      }
    });

    return res.json(programs.map(p => p.programName));
  } catch (error) {
    console.error('프로그램 목록 조회 에러:', error);
    return res.status(500).json({ error: '서버 에러' });
  }
}

export default withAuth(handler);