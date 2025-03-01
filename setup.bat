@echo off
rmdir /s /q node_modules\.prisma
rmdir /s /q node_modules\@prisma
npm install
npx prisma generate