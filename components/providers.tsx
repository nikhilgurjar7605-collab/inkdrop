"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const { telegramLogin } = useAuthStore();

  useEffect(() => {
    // Initialize Telegram Mini App if we are running inside Telegram
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Setup Telegram theme colors
      tg.setHeaderColor('#000000'); // Match INKDROP dark theme
      
      // Auto-login if Telegram user data is available
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        telegramLogin({
          id: tgUser.id.toString(),
          email: `${tgUser.id}@telegram.local`,
          name: tgUser.first_name + (tgUser.last_name ? ` ${tgUser.last_name}` : ''),
          avatar: tgUser.first_name.substring(0, 2).toUpperCase()
        });
      }
    }
  }, [telegramLogin]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
