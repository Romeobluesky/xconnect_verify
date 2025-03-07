import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { LicenseStatus } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않는 메소드' });
  }

  try {
    const licenses = req.body;

    if (!Array.isArray(licenses) || licenses.length === 0) {
      return res.status(400).json({ error: '유효하지 않은 데이터 형식' });
    }

    const createdLicenses = await prisma.$transaction(
      licenses.map((license: { 
        programName: string; 
        clientId: string; 
        licenseKey: string; 
        expiresAt: string;
        createdAt: string;
      }) => {
        // 날짜 형식 변환
        const expiresAt = new Date(license.expiresAt);
        const createdAt = new Date(license.createdAt);

        return prisma.license.create({
          data: {
            programName: license.programName,
            clientId: license.clientId,
            licenseKey: license.licenseKey,
            expiresAt,
            createdAt,
            isActive: true,
            status: 'ISSUED' as LicenseStatus
          }
        });
      })
    );

    return res.status(201).json(createdLicenses);
  } catch (error) {
    console.error('라이선스 일괄 추가 에러:', error);
    return res.status(500).json({ error: '서버 에러' });
  }
} 