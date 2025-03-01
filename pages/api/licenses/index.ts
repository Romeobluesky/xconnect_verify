import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { Prisma, LicenseStatus } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || '');
    const status = req.query.status ? String(req.query.status) : undefined;
    const dateType = String(req.query.dateType || '');
    const startDate = req.query.startDate ? new Date(String(req.query.startDate)) : null;
    const endDate = req.query.endDate ? new Date(String(req.query.endDate)) : null;
    const skip = (page - 1) * limit;

    try {
      // 기본 검색 조건
      const baseConditions: Prisma.LicenseWhereInput[] = [];

      // 텍스트 검색 조건 (프로그램명, 클라이언트ID, 라이선스키)
      if (search) {
        baseConditions.push({
          OR: [
            { programName: { contains: search } },
            { clientId: { contains: search } },
            { licenseKey: { contains: search } }
          ]
        });
      }

      // status 검색 조건 추가 (ISSUED, IN_USE, STOPPED)
      if (status) {
        baseConditions.push({
          status: status as LicenseStatus
        });
      }

      // 날짜 범위 검색 조건 추가
      if (dateType && startDate && endDate) {
        baseConditions.push({
          [dateType]: {
            gte: startDate,
            lte: new Date(endDate.setHours(23, 59, 59, 999))
          }
        });
      }

      const [licenses, total] = await Promise.all([
        prisma.license.findMany({
          where: {
            AND: baseConditions
          },
          skip,
          take: limit,
          orderBy: {
            clientId: 'desc'
          }
        }),
        prisma.license.count({
          where: {
            AND: baseConditions
          }
        })
      ]);

      return res.json({ licenses, total });
    } catch (error) {
      console.error('라이선스 목록 조회 에러:', error);
      return res.status(500).json({ error: '서버 에러' });
    }
  }

  if (req.method === 'POST') {
    const { programName, clientIdPrefix, count, expiresAt } = req.body;

    try {
      const licenses = await prisma.$transaction(
        Array(count).fill(null).map((_, index) =>
          prisma.license.create({
            data: {
              programName,
              clientId: `${clientIdPrefix}${(index + 1).toString().padStart(4, '0')}`,
              licenseKey: uuidv4(),
              expiresAt: new Date(expiresAt),
              isActive: true
            }
          })
        )
      );

      return res.status(201).json(licenses);
    } catch (error) {
      console.error('라이선스 생성 에러:', error);
      return res.status(500).json({ error: '서버 에러' });
    }
  }

  return res.status(405).json({ error: '허용되지 않는 메소드' });
}