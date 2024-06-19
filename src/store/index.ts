import { create } from 'zustand';
import { File, FileGroup, FileTag } from './types';
import * as _ from 'radash';
// import { removeFile } from '@tauri-apps/api/fs';
import { invoke } from "@tauri-apps/api/tauri";
import React from 'react';
import { createDir, DirState } from './dir';
import { createUI, UIState } from './ui';

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

const useStore = create<DirState & UIState>((...a) => ({
  ...createDir(...a),
  ...createUI(...a),
}))

export { useStore };

export * from './types';