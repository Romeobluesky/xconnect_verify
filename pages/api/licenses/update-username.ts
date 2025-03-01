import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: '허용되지 않는 메소드' });
  }

  const { id, userName } = req.body;

  try {
    const updatedLicense = await prisma.license.update({
      where: { id },
      data: { userName }
    });

    return res.json(updatedLicense);
  } catch (error) {
    console.error('사용자명 업데이트 에러:', error);
    return res.status(500).json({ error: '서버 에러' });
  }
}

export default withAuth(handler); 