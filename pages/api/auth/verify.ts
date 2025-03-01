import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않는 메소드' });
  }

  const { licenseKey, clientId, hardwareId } = req.body;

  try {
    await prisma.$transaction(async (tx) => {
      const license = await tx.license.findFirst({
        where: {
          licenseKey,
          clientId,
          isActive: true,
          expiresAt: {
            gt: new Date()
          }
        }
      });

      if (!license) {
        throw new Error('유효하지 않은 라이선스');
      }

      // 이미 IN_USE 상태인 경우
      if (license.status === 'IN_USE') {
        await tx.authLog.create({
          data: {
            licenseId: license.id,
            status: false,
            clientIp: req.socket.remoteAddress || 'unknown',
            message: '이미 인증된 라이선스'
          }
        });
        return res.status(200).json({
          success: false,
          check: 'D',  // Duplicate 의미
          message: '이미 인증된 라이선스'
        });
      }

      // 최초 인증 성공 시
      await Promise.all([
        tx.license.update({
          where: { id: license.id },
          data: {
            hardwareId,  // 하드웨어 ID 저장
            activatedAt: new Date(),
            status: 'IN_USE'
          }
        }),
        tx.authLog.create({
          data: {
            licenseId: license.id,
            status: true,
            clientIp: req.socket.remoteAddress || 'unknown',
            message: '최초 인증 성공'
          }
        })
      ]);

      return res.status(200).json({
        success: true,
        check: 'Y',  // 최초 인증 성공
        message: '인증 성공'
      });
    });

  } catch (error: unknown) {
    console.error('라이선스 인증 에러:', error);
    if (error instanceof Error) {
      if (error.message === '유효하지 않은 라이선스') {
        return res.status(401).json({
          success: false,
          check: 'N',
          error: error.message
        });
      }
    }
    return res.status(500).json({
      success: false,
      check: 'N',
      error: '서버 에러'
    });
  }
}