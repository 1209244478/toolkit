'use client';

import { useI18n } from '@/app/lib/i18n';

export function useToolI18n(slug: string) {
  const { t, locale } = useI18n();
  const toolT = t.tools[slug] as Record<string, string> | undefined;
  const tc = (key: string, fallback: string) => toolT?.[key] ?? fallback;
  return { t, tc, locale };
}
