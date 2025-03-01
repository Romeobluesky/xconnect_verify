import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않는 메소드' });
  }

  try {
    const licenses = req.body;

    const createdLicenses = await prisma.$transaction(
      licenses.map((license: { programName: string; clientId: string; expiresAt: string }) =>
        prisma.license.create({
          data: {
            programName: license.programName,
            clientId: license.clientId,
            licenseKey: uuidv4(),
            expiresAt: new Date(license.expiresAt),
            isActive: true
          }
        })
      )
    );

    return res.status(201).json(createdLicenses);
  } catch (error) {
    console.error('라이선스 가져오기 에러:', error);
    return res.status(500).json({ error: '서버 에러' });
  }
}