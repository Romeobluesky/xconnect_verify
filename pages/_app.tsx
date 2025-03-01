import 'simplebar-react/dist/simplebar.min.css';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createEmotionCache } from '../src/utils/create-emotion-cache';
import { theme } from '../src/utils/theme';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import DashboardLayout from '@/src/layouts/dashboard/layout';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale';
import { CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import type { EmotionCache } from '@emotion/cache';
import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import type { NextRouter } from 'next/router';

const clientSideEmotionCache: EmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

interface AppContentProps {
  Component: AppProps['Component'];
  pageProps: Record<string, unknown>;
  router: NextRouter;
}

function AppContent({ Component, pageProps, router }: AppContentProps) {
  const { status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    // 로그인하지 않은 상태에서 admin 페이지 접근 시도
    if (status === 'unauthenticated' && router.pathname.startsWith('/admin')) {
      router.replace('/login');
      return;
    }

    // 로그인된 상태에서 로그인 페이지 접근 시도
    if (status === 'authenticated' && router.pathname === '/login') {
      router.replace('/admin/dashboard');
      return;
    }
  }, [status, router]);

  // 로딩 중이거나 리다이렉트 중일 때
  if (status === 'loading') {
    return <CircularProgress />;
  }

  // 로그인이 필요한 페이지인데 인증되지 않은 경우
  if (router.pathname.startsWith('/admin') && status === 'unauthenticated') {
    return null;
  }

  return router.pathname.startsWith('/admin') ? (
    <DashboardLayout>
      <Component {...pageProps} />
    </DashboardLayout>
  ) : (
    <Component {...pageProps} />
  );
}

export default function App({ Component, pageProps: { session, ...pageProps }, emotionCache = clientSideEmotionCache }: MyAppProps) {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
            <AppContent Component={Component} pageProps={pageProps} router={router} />
          </LocalizationProvider>
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
}