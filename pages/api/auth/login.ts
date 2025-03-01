import { prisma } from '@/lib/prisma';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않는 메소드' });
  }

  try {
    const { username, password } = req.body;

    const user = await prisma.admin.findUnique({
      where: { email: username }
    });

    if (!user) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 쿠키에 토큰 저장
    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    }));

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('로그인 에러:', error);
    return res.status(500).json({ error: '서버 에러' });
  }
}