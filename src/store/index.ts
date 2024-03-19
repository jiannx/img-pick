import { create } from 'zustand';
import { File, FileGroup } from './types';

export interface State {
  /** 工作目录 */
  workDir?: string;
  /** 读取到文件的原始数据 */
  files?: File[];
  /** 同名合并的数据 */
  fileGroups?: FileGroup[];
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

export * from './types';