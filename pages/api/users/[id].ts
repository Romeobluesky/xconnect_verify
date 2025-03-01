import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';

interface UpdateData {
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  password?: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = Number(req.query.id);

  if (req.method === 'PATCH') {
    const { name, role, password } = req.body;
    try {
      const updateData: UpdateData = { name, role };
      
      if (password) {
        updateData.password = await hash(password, 10);
      }

      const updatedUser = await prisma.admin.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return res.json(updatedUser);
    } catch (error) {
      console.error('사용자 수정 에러:', error);
      return res.status(500).json({ error: '서버 에러' });
    }
  } else if (req.method === 'DELETE') {
    if (!req.user || req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: '권한이 없습니다' });
    }

    try {
      await prisma.admin.delete({
        where: { id: userId }
      });

      return res.json({ success: true });
    } catch (error) {
      console.error('사용자 삭제 에러:', error);
      return res.status(500).json({ error: '서버 에러' });
    }
  } else {
    return res.status(405).json({ error: '허용되지 않는 메소드' });
  }
}

export default withAuth(handler); 