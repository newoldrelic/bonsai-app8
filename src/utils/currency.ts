import { create } from 'zustand';

export type Currency = 'USD' | 'CAD' | 'GBP' | 'EUR';

interface CurrencyState {
  current: Currency;
  setCurrency: (currency: Currency) => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  current: 'USD',
  setCurrency: (currency) => set({ current: currency })
}));

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  CAD: '$',
  GBP: '£',
  EUR: '€'
};

export const CURRENCY_FLAGS: Record<Currency, string> = {
  USD: 'https://flagcdn.com/w20/us.png',
  CAD: 'https://flagcdn.com/w20/ca.png',
  GBP: 'https://flagcdn.com/w20/gb.png',
  EUR: 'https://flagcdn.com/w20/eu.png'
};

export const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  CAD: 1.35,
  GBP: 0.79,
  EUR: 0.92
};

export function formatPrice(price: number, currency: Currency): string {
  const convertedPrice = price * EXCHANGE_RATES[currency];
  const symbol = CURRENCY_SYMBOLS[currency];
  
  return `${symbol}${convertedPrice.toFixed(2)}`;
}