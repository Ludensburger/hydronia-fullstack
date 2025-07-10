import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function twMerge(...inputs: ClassValue[]) {
  return clsx(inputs);
}
