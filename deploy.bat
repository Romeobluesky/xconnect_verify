@echo off

:: 1. Git pull
git pull origin main

:: 2. Install dependencies
call npm install

:: 3. Clean Prisma
rmdir /s /q node_modules\.prisma
rmdir /s /q node_modules\@prisma

:: 4. Generate Prisma Client
call npx prisma generate

:: 5. Build Next.js
call npm run build

:: 6. PM2 재시작 (ecosystem.config.js 사용)
pm2 reload ecosystem.config.js --update-env

echo Deployment completed!
pause