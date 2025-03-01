import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

interface ExternalActiveClient {
  client_id: string;
  hardware_id: string;
  last_checked: string;
  license_key: string;
}

interface ExternalApiResponse {
  active_clients: ExternalActiveClient[];
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '허용되지 않는 메소드' });
  }

  try {
    // 외부 API에서 실행 중인 클라이언트 정보 조회
    const externalResponse = await fetch('http://1.234.2.37:8000/get_active_clients');
    const externalData: ExternalApiResponse = await externalResponse.json();

    // 실행 중인 라이선스 키 목록
    const activeKeys = new Set(externalData.active_clients.map(client => client.license_key));

    // DB에서 IN_USE 상태인 모든 라이선스 조회
    const allInUseClients = await prisma.license.findMany({
      where: {
        isActive: true,
        status: 'IN_USE'
      },
      orderBy: {
        clientId: 'desc'
      },
      select: {
        id: true,
        programName: true,
        licenseKey: true,
        clientId: true,
        hardwareId: true,
        userName: true,
        isActive: true,
        status: true,
        activatedAt: true,
        expiresAt: true,
        lastCheckedAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // 결과 매핑
    const result = allInUseClients.map((client) => ({
      ...client,
      isRunning: activeKeys.has(client.licenseKey)
    }));

    return res.json(result);
  } catch (error) {
    console.error('활성 클라이언트 조회 에러:', error);
    return res.status(500).json({ error: '서버 에러' });
  }
}

export default withAuth(handler);