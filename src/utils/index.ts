import { File, ImagesSuffix } from '@/store';
import { readDir, BaseDirectory, readBinaryFile } from '@tauri-apps/api/fs';
import { convertFileSrc } from '@tauri-apps/api/tauri';

// 文件名排序，图片优先
export function isImageFile(f: File): boolean {
  return ImagesSuffix.includes(f.suffix.toLowerCase());
}

export async function readImageToUrl(imgPath: string) {
  const binaryData = await readBinaryFile(imgPath)
  let p = new Blob([binaryData], { type: 'image/png' });
  return URL.createObjectURL(p);
}
