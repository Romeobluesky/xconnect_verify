import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name, role } = req.body;

    const exists = await prisma.admin.findUnique({
      where: { email }
    });

    if (exists) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'ADMIN'
      }
    });

    const adminData = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };
    return res.status(201).json(adminData);
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ message: '관리자 생성 중 오류가 발생했습니다.' });
  }
}