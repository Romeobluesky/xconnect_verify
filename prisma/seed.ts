import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 기존 관리자가 있는지 확인
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@example.com' }
  });

  if (!existingAdmin) {
    // 관리자 계정 생성
    await prisma.admin.create({
      data: {
        email: 'admin@example.com',
        password: await hash('admin123', 10),  // 비밀번호 해싱
        name: '관리자',
        role: 'SUPER_ADMIN'
      }
    });
    console.log('관리자 계정이 생성되었습니다.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });