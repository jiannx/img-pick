import { create } from 'zustand';
import { File, Dir, ImagesSuffix, Suffix } from '@/types';
import _ from 'lodash';

export interface State {
  /** 设置 */
  setting: {
    /** 同时删除同名文件 */
    autoDeleteSameNameFile?: boolean;
    /** 删除前提示校验 */
    deleteConfirmBefore?: boolean;
  };
  /** 设置配置 */
  setSetting: (setting: Partial<State['setting']>) => void;
  /**  directory list */
  dirs: Array<Dir>;
  set: (v: Partial<State>) =>  void,
}

const useStore = create<State>((set, get) => {
  return {
    setting: {
      autoDeleteSameNameFile: false,
      deleteConfirmBefore: true,
    },
    setSetting: (setting) => {
      set({
        setting: { ...get().setting, ...setting }
      });
    },
    set: (v: Partial<State>) => {
      set(v);
    },
    dirs: [],
  };
})

export default useStore;
