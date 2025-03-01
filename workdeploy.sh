#!/bin/bash

# Node.js 버전 확인
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 2. 기존 빌드 파일 삭제
rm -rf .next
rm -rf node_modules
rm package-lock.json

# 3. 의존성 설치
npm install
# 4. Prisma 생성
npx prisma generate

# 5. Next.js 빌드
npm run build
npm run start:dev

echo "Deployment completed!"
