import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { withAuth } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || '');
    const skip = (page - 1) * limit;

    try {
      const where = search
        ? {
            OR: [
              { email: { contains: search } },
              { name: { contains: search } }
            ]
          }
        : {};

      const [users, total] = await Promise.all([
        prisma.admin.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true
          }
        }),
        prisma.admin.count({ where })
      ]);

      return res.json({ users, total });
    } catch (error) {
      console.error('사용자 목록 조회 에러:', error);
      return res.status(500).json({ error: '서버 에러' });
    }
  }

  if (req.method === 'POST') {
    const { email, name, password, role } = req.body;

    try {
      const hashedPassword = await hash(password, 10);
      const user = await prisma.admin.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role
        }
      });

      return res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });
    } catch (error) {
      console.error('사용자 생성 에러:', error);
      return res.status(500).json({ error: '서버 에러' });
    }
  }

  return res.status(405).json({ error: '허용되지 않는 메소드' });
}

export default withAuth(handler);