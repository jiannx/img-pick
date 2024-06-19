import { create } from 'zustand';
import { File, FileGroup, FileTag } from './types';
import * as _ from 'radash';
// import { removeFile } from '@tauri-apps/api/fs';
import { invoke } from "@tauri-apps/api/tauri";
import React from 'react';

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
  /** 过滤条件 */
  filter: string | null;
  /** 重置 */
  onReset: () => void;
  /** 保存节点引用 */
  refs: {
    thumbnail?: React.Ref<HTMLDivElement>;
  },
  /** 存储节点handle */
  setRefs: (key: 'thumbnail', ref: React.Ref<any>) => void;
  /** 事件 */
  actions: {
    /** 设置标签 */
    setGroupTagChange: (fileGroup: FileGroup, tags: FileTag[]) => void;
    /** 设置选中项 */
    setSelectedGroup: (fileGroup: FileGroup | FileGroup[], keepOthers?: boolean) => void;
    /** 删除文件 */
    removeFiles: (fileGroup?: FileGroup | FileGroup[]) => Promise<any>;
    /** 全部选中 */
    selectAll: () => void;
    /** 取消全部选中 */
    unselectAll: () => void;
    /** 预览下一个 */
    preiviewNext: () => void;
    /** 预览下一个 */
    preiviewPrevious: () => void;
  }
}

const useStore = create<State>((set, get) => ({
  setState(state) {
    set(state);
  },
  filter: null,
  onReset: () => {
    set({
      workDir: undefined,
      files: [],
      fileGroups: [],
    })
  },
  refs: {
    thumbnail: null,
  },
  setRefs(key, ref) {
    set((state) => {
      return {
        ...state,
        refs: {
          ...state.refs,
          [key]: ref,
        }
      };
    });
  },
  actions: {
    setGroupTagChange(fileGroup, tags) {
      const { fileGroups } = get();
      fileGroups?.forEach(fg => {
        if (fg.pureName === fileGroup.pureName) {
          fg.tags = tags;
        }
      });
      set({ fileGroups });
    },
    setSelectedGroup: (fileGroup) => {
      if (Array.isArray(fileGroup)) {

      } else {
        set({ previewGroup: fileGroup as FileGroup });
      }
    },
    removeFiles: async (fileGroup) => {
      const { fileGroups, previewGroup } = get();
      let groups: FileGroup[] = [];

      if (fileGroup) {
        groups = Array.isArray(fileGroup) ? fileGroup : [fileGroup]
      } else {
        // 默认删除选中的文件
        if (previewGroup) {
          groups.push(previewGroup);
        }
        groups.push(...(fileGroups?.filter(g => g.isSelected) || []));
      }
      const files = _.flat(groups.map(g => g.files || []));
      for (let file of files) {
        // await removeFile(file.path);
        await invoke('move_trash', {
          path: file.path,
        });
      }
      if (groups.find(g => g.pureName === previewGroup?.pureName)) {
        set({ previewGroup: undefined });
      }
      set({
        fileGroups: fileGroups?.filter(f => !groups.find(g => g.pureName === f.pureName))
      });
    },
    selectAll: () => {
      let state = get();
      let groups = [...(state.fileGroups || [])];

      if (state.filter === FileTag.Del) {
        groups.forEach(g => {
          g.isSelected = g.tags?.includes(FileTag.Del);
        });
      } else if (state.filter === FileTag.NotDel) {
        groups.forEach(g => {
          g.isSelected = !g.tags?.includes(FileTag.Del);
        });
      } else {
        groups.forEach(g => {
          g.isSelected = true;
        });
      }
      set({ fileGroups: groups })
    },
    unselectAll: () => {
      let state = get();
      let groups = [...(state.fileGroups || [])];
      groups.forEach(g => {
        g.isSelected = false;
      });
      set({ fileGroups: groups })
    },
    /** 预览下一个 */
    preiviewNext: () => {
      get().actions.unselectAll();
      const { previewGroup, fileGroups } = get();
      if (previewGroup && fileGroups) {
        const index = fileGroups?.findIndex(f => f.pureName === previewGroup.pureName);
        if (index < (fileGroups?.length - 1)) {
          set({
            previewGroup: fileGroups[index + 1],
          })
        }
      }
    },
    /** 预览下一个 */
    preiviewPrevious: () => {
      get().actions.unselectAll();
      const { previewGroup, fileGroups } = get();
      if (previewGroup && fileGroups) {
        const index = fileGroups?.findIndex(f => f.pureName === previewGroup.pureName);
        if (index > 0) {
          set({
            previewGroup: fileGroups[index - 1],
          })
        }
      }
    }
  }
}))

export { useStore };

export * from './types';