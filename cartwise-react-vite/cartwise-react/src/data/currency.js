import { exchangeRates, currencySymbols } from './products';

export function convertCurrency(amountVnd, toCurrency = 'VND') {
  const value = amountVnd * (exchangeRates[toCurrency] || 1);
  return value;
}

export function formatCurrency(amountVnd, currency = 'VND') {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amountVnd);
  }
  const converted = convertCurrency(amountVnd, currency);
  const digits = currency === 'JPY' || currency === 'KRW' ? 0 : 2;
  return `${currencySymbols[currency] || ''}${converted.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits })}`;
}
