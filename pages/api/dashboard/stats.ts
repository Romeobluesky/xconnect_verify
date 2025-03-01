import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

interface MonthlyStats {
  month: string;
  total: bigint;
  inUse: bigint;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [
      totalLicenses,
      activeLicenses,
      inUseLicenses,
      monthlyStats
    ] = await Promise.all([
      // 총 라이선스 수
      prisma.license.count(),

      // 활성 라이선스 수
      prisma.license.count({
        where: { isActive: true }
      }),

      // 사용중인 라이선스 수
      prisma.license.count({
        where: {
          status: 'IN_USE',
          isActive: true
        }
      }),

      // 월별 라이선스 통계
      prisma.$queryRaw`
        SELECT
          DATE_FORMAT(createdAt, '%Y-%m') as month,
          CAST(COUNT(*) AS SIGNED) as total,
          CAST(SUM(CASE WHEN status = 'IN_USE' THEN 1 ELSE 0 END) AS SIGNED) as inUse
        FROM License
        WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
        ORDER BY month ASC
      `
    ]);

    return res.json({
      stats: {
        totalLicenses: Number(totalLicenses),
        activeLicenses: Number(activeLicenses),
        inUseLicenses: Number(inUseLicenses),
        utilizationRate: activeLicenses ? Math.round((Number(inUseLicenses) / Number(activeLicenses)) * 100) : 0
      },
      monthlyStats: (monthlyStats as MonthlyStats[]).map(stat => ({
        month: stat.month,
        total: Number(stat.total),
        inUse: Number(stat.inUse)
      }))
    });
  } catch (error) {
    console.error('대시보드 통계 조회 에러:', error);
    return res.status(500).json({ error: '서버 에러' });
  }
}