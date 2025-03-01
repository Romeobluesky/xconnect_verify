import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: '허용되지 않는 메소드' });
  }

  const { id, isActive } = req.body;

  try {
    const license = await prisma.license.update({
      where: { id },
      data: { isActive }
    });

    return res.json(license);
  } catch (error) {
    console.error('라이선스 상태 변경 에러:', error);
    return res.status(500).json({ error: '서버 에러' });
  }
}