import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

interface License {
  id: number;
  programName: string;
  clientId: string;
  isActive: boolean;
  status: 'ISSUED' | 'IN_USE' | 'STOPPED';
  expiresAt: Date | null;
  createdAt: Date;
  licenseKey: string;
  activatedAt: Date | null;
  hardwareId: string | null;
  lastCheckedAt: Date | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '허용되지 않는 메소드' });
  }

  try {
    const licenses = await prisma.license.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const formattedLicenses = licenses.map((license: License) => ({
      ...license,
      expiresAt: license.expiresAt?.toISOString() || null,
      createdAt: license.createdAt.toISOString(),
      activatedAt: license.activatedAt?.toISOString() || null,
      lastCheckedAt: license.lastCheckedAt?.toISOString() || null
    }));

    return res.json({ licenses: formattedLicenses });
  } catch (error) {
    console.error('라이선스 조회 에러:', error);
    return res.status(500).json({ error: '서버 에러' });
  }
}