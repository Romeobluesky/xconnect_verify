#!/bin/bash

# Node.js 버전 확인
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 1. Git pull
git pull origin main

# 2. 기존 빌드 파일 삭제
rm -rf .next
rm -rf node_modules
rm package-lock.json

# 3. 의존성 설치
npm install
npm install sharp

# 4. Prisma 생성
npx prisma generate

# 5. Next.js 빌드
NODE_ENV=production npm run build

# 6. PM2 재시작
pm2 delete xconnect-verify
pm2 start ecosystem.config.js

echo "Deployment completed!"
