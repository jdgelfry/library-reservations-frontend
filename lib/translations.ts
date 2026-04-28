import es from '@/messages/es.json';
import en from '@/messages/en.json';

type Language = 'es' | 'en';

const translations: Record<Language, typeof es> = {
  es,
  en,
};

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    value = value?.[k];
  }

  return value ?? key;
}
