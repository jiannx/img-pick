import { create } from 'zustand';
import { File, FileGroup, FileTag } from './types';
import * as _ from 'radash';
import { removeFile } from '@tauri-apps/api/fs';

export interface State {
  /** 工作目录 */
  workDir?: string;
  /** 读取到文件的原始数据 */
  files?: File[];
  /** 同名合并的数据 */
  fileGroups?: FileGroup[];
  previewGroup?: FileGroup;
  /** 设置store */
  setState: (state: any) => void;
  /** 设置标签 */
  setGroupTagChange: (fileGroup: FileGroup, tags: FileTag[]) => void;
  /** 设置选中项 */
  setSelectedGroup: (fileGroup: FileGroup | FileGroup[], keepOthers?: boolean) => void;
  /** 删除文件 */
  removeFiles: (fileGroup?: FileGroup | FileGroup[]) => Promise<any>;
}

const useStore = create<State>((set, get) => ({
  setState(state) {
    set(state);
  },
  setGroupTagChange(fileGroup, tags) {
    const { fileGroups } = get();
    fileGroups?.forEach(fg => {
      if (fg.pureName === fileGroup.pureName) {
        fg.tags = tags;
      }
    });
    set({ fileGroups });
  },
  setSelectedGroup: (fileGroup, keepOthers) => {
    if (Array.isArray(fileGroup)) {

    } else {
      set({ previewGroup: fileGroup as FileGroup });
    }
  },
  removeFiles: async (fileGroup) => {
    if (!fileGroup) {
      return;
    }
    let groups: FileGroup[] = Array.isArray(fileGroup) ? fileGroup : [fileGroup];
    const files = _.flat(groups.map(g => g.files || []));
    for (let file of files) {
      await removeFile(file.path);
    }
    const { fileGroups, previewGroup } = get();
    if (groups.find(g => g.pureName === previewGroup?.pureName)) {
      set({ previewGroup: undefined });
    }
    set({
      fileGroups: fileGroups?.filter(f => !groups.find(g => g.pureName === f.pureName))
    });
  }
}))

export { useStore };

export * from './types';