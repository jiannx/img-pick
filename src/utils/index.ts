export const ImagesSuffix = ['png', 'jpg'];

export function imageFirst(a: string, b?: any) {
  if (ImagesSuffix.includes(a.toLowerCase())) {
    return false;
  }
  return true;
}