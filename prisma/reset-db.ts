import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
    await prisma.$executeRaw`TRUNCATE TABLE AuthLog;`;
    await prisma.$executeRaw`TRUNCATE TABLE License;`;
    await prisma.$executeRaw`TRUNCATE TABLE Admin;`;
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    console.log('모든 테이블 초기화 완료');
  } catch (error) {
    console.error('초기화 중 오류:', error);
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase().catch(console.error);