import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { File, ImagesSuffix } from '@/types';
import { readBinaryFile } from '@tauri-apps/api/fs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 文件名排序，图片优先
export function isImageFile(f: File): boolean {
  return ImagesSuffix.includes(f.suffix.toLowerCase());
}

export async function readImageToUrl(imgPath: string) {
  const binaryData = await readBinaryFile(imgPath)
  let p = new Blob([binaryData], { type: 'image/png' });
  return URL.createObjectURL(p);
}
