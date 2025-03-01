import { platform } from 'process';
import { execSync } from 'child_process';

if (platform === 'win32') {
  execSync('del /s /q node_modules\\.prisma && prisma generate');
} else {
  execSync('rm -rf node_modules/.prisma && npx prisma generate');
}