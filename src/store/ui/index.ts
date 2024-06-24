import { create, StateCreator } from 'zustand';


export interface Setting {
  /** 筛选配置 */
  filter: {
    markAsDelete?: boolean
  },
  /** 合并同名文件 */
  mergeSameNameFiles?: boolean;
}
export interface UIState {
  /** 设置配置 */
  setting: Setting;
  setSetting: (setting: Partial<Setting>) => void;
  filterSet: (markkey: keyof Setting['filter'], value: any) => void;
}

export const createUI: StateCreator<
  UIState,
  [],
  [],
  UIState
> = (set, get) => ({
  setting: {
    filter: {
      markAsDelete: false,
    },
    mergeSameNameFiles: false,
  },
  setSetting: (setting: Partial<Setting>) => {
    set({
      setting: {
        ...get().setting,
        ...setting
      }
    })
  },
  filterSet: (filterkey, value) => {
    set({
      setting: {
        ...get().setting,
        filter: {
          ...get().setting.filter,
          [filterkey]: value
        }
      }
    });
  },
});
