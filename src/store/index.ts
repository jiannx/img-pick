import { create } from 'zustand';
import { invoke } from "@tauri-apps/api/tauri";
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { open } from "@tauri-apps/api/dialog"
import { readDir, BaseDirectory, readBinaryFile } from '@tauri-apps/api/fs';

export interface File {
  /** 文件地址 */
  path?: string;
  /** 文件名 */
  name?: string;
  /** 文件名，不包含后缀 */
  pureName?: string;
  /** 后缀名 */
  suffix?: string;
  /** 多种后缀 */
  suffixs?: string[];
  files?: File[];
}

export interface State {
  /** 工作目录 */
  workDir?: string;
  /** 读取到文件的原始数据 */
  files?: File[];
  /** 同名合并的数据 */
  mergedFiles?: File[];
  /** 预览中的文件 */
  previewFile?: File;
  /** 设置store */
  setState: (state: any) => void;
}

const useStore = create<State>((set) => ({
  setState(state) {
    set(state);
  },
}))

export { useStore };