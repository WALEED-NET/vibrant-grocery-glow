
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// دوال تنسيق الأرقام بالنظام الإنجليزي
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function formatCurrency(value: number, maximumFractionDigits: number = 0): string {
  return value.toLocaleString('en-US', { maximumFractionDigits });
}

export function formatPrice(value: number, decimalPlaces: number = 2): string {
  return value.toFixed(decimalPlaces);
}
