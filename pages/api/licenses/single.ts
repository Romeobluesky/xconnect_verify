import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않는 메소드' });
  }

  const { programName, clientId, licenseKey, expiresAt } = req.body;

  try {
    const license = await prisma.license.create({
      data: {
        programName,
        clientId,
        licenseKey,
        expiresAt: new Date(expiresAt),
        isActive: true
      }
    });

    return res.status(201).json(license);
  } catch (error) {
    console.error('라이선스 생성 에러:', error);
    return res.status(500).json({ error: '서버 에러' });
  }
}