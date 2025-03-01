import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = Number(req.query.page) || 1;
  const filter = String(req.query.filter);
  const pageSize = 10;

  try {
    const where = filter === 'all'
      ? {}
      : { status: filter === 'success' };

    const [logs, total] = await Promise.all([
      prisma.authLog.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          license: {
            select: {
              programName: true,
              clientId: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.authLog.count({ where }),
    ]);

    return res.json({
      logs,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('로그 조회 에러:', error);
    return res.status(500).json({ error: '서버 에러' });
  }
}