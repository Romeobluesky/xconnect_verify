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

echo Deployment completed!
pause