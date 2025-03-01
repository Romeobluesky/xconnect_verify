import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: '허용되지 않는 메소드' });
  }

  try {
    const { programName, status } = req.body;

    const where: Prisma.LicenseWhereInput = {};
    if (programName) where.programName = programName;
    if (status) where.status = status;

    const result = await prisma.license.deleteMany({
      where
    });

    return res.json({
      success: true,
      deletedCount: result.count
    });
  } catch (error) {
    console.error('라이선스 일괄 삭제 에러:', error);
    return res.status(500).json({ error: '서버 에러' });
  }
}

export default withAuth(handler);