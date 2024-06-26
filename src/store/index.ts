import { create } from 'zustand';
import { File, Dir, ImagesSuffix, Suffix } from './types';
import _ from 'lodash';
// import { removeFile } from '@tauri-apps/api/fs';
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog"
import { readDir } from '@tauri-apps/api/fs';
import { convertFileSrc } from '@tauri-apps/api/tauri'

export interface State {
  /** 设置配置 */
  setting: {
    /** 同时删除同名文件 */
    autoDeleteSameNameFile?: boolean;
    /** 删除前提示校验 */
    deleteConfirmBefore?: boolean;
  };
  setSetting: (setting: Partial<State['setting']>) => void;
  /**  directory list */
  dirs: Array<Dir>;
  /** add new directory */
  dirRead: (path: string) => Promise<Dir>;
  dirAdd: () => void;
  /** remove directory */
  dirRemove: (dir: Dir) => void;
  /** select directory */
  dirSelect: (dir: Dir) => void;
  dirRefresh: (dir: Dir) => void;
  fileSelect: (dir?: Dir, file?: File | File[], isClearOthers?: boolean) => void;
  fileSelectAll: () => void;
  fileSelectPrevious: () => void;
  fileSelectNext: () => void;
  fileSelectDelete: (dir: Dir, file: File[]) => Promise<void>;
  /** set tags */
  fileMarkSet: (file: File | undefined, markkey: 'delete' | 'color' | 'star', markValue: any) => void;
  dirFilterSet: (die: Dir | undefined, markkey: string, value: any) => void;
}

const useStore = create<State>((set, get) => {

  return {
    setting: {
      autoDeleteSameNameFile: false,
      deleteConfirmBefore: true,
    },
    setSetting: (setting) => {
      set({
        setting: {
          ...get().setting,
          ...setting
        }
      })
    },
    dirs: [],
    async dirRead(path: string) {
      let files: File[] = (await readDir(path, { recursive: true })).map(f => {
        const nameSplit = f.name?.split('.') || [];
        const suffix = (nameSplit.pop() || '').toUpperCase() as Suffix;
        return {
          id: f.path,
          dir: path,
          path: f.path,
          name: f.name || '',
          url: convertFileSrc(f.path) || '',
          pureName: nameSplit.join('.'),
          suffix,
        }
      }).filter(f => ImagesSuffix.includes(f.suffix));
      files = _.sortBy(files, ['name']);
      const dir: Dir = {
        id: path as string,
        path: path as string,
        name: _.last((path as string).split('/')) || '',
        files: files,
        selected: false,
        filter: {
          markAsDelete: false,
          suffixes: _.uniq(files.map(f => f.suffix)),
        }
      };
      return dir;
    },
    async dirAdd() {
      let workDir = await open({ multiple: false, directory: true });
      const path = workDir as string;
      const dir = await get().dirRead(path);

      const state = get();
      if (state.dirs.length === 0) {
        dir.selected = true;
      }

      set(state => ({
        dirs: _.uniqBy([...state.dirs, dir], 'path'),
      }));
    },
    async dirRemove(dir: Dir) {
      set((state) => ({
        dirs: state.dirs.filter(d => d.path !== dir.path)
      }))
    },
    dirSelect(dir: Dir) {
      set((state) => ({
        dirs: state.dirs.map(d => ({
          ...d, selected: dir.path === d.path,
        })),
      }))
    },
    async dirRefresh(dir: Dir) {
      const newdir = await get().dirRead(dir.path);
      const oldDir = get().dirs.find(d => d.id === dir.id);
      newdir.selected = oldDir?.selected as boolean;
      Object.assign(oldDir!, newdir)
      set(state => ({
        dirs: [...state.dirs],
      }));
    },
    fileSelect(dir?: Dir, file?: File | File[], isClearOthers = true) {
      const fileIds = _.isArray(file) ? file.map(f => f?.id) : [file?.id]
      dir?.files?.forEach(f => {
        if (fileIds.includes(f.id)) {
          f.selected = true;
        } else if (isClearOthers) {
          f.selected = false;
        }
      });
      set((state) => ({
        dirs: [...state.dirs],
      }))
    },
    fileSelectAll() {
      const dir = get().dirs.find(d => d.selected);
      dir?.files?.forEach(f => {
        f.selected = true;
      });
      set((state) => ({
        dirs: [...state.dirs],
      }));
    },
    fileSelectPrevious: () => {
      const dir = get().dirs.find(d => d.selected);
      const files = (dir?.files || []).filter(f => dir?.filter.suffixes?.includes(f.suffix));
      if (files.length === 0) {
        return;
      }
      const index = files.findIndex(f => f.selected);
      if (index === -1) {
        files[files.length - 1].selected = true;
      } else if (index > 0) {
        files[index].selected = false;
        files[index - 1].selected = true;
      }
      set((state) => ({
        dirs: [...state.dirs],
      }));
    },
    fileSelectNext: () => {
      const dir = get().dirs.find(d => d.selected);
      const files = (dir?.files || []).filter(f => dir?.filter.suffixes?.includes(f.suffix));
      if (files.length === 0) {
        return;
      }
      const index = files.findIndex(f => f.selected) || 0;
      if (index === -1) {
        files[0].selected = true;
      } else if (index < files.length - 1) {
        files[index].selected = false;
        files[index + 1].selected = true;
      }
      set((state) => ({
        dirs: [...state.dirs],
      }));
    },
    fileSelectDelete: async (dir: Dir, files: File[]) => {
      for (let file of files) {
        // await removeFile(file.path);
        await invoke('move_trash', {
          path: file.path,
        });
      }
      // set((state) => ({
      //   dirs: [...state.dirs],
      // }));
      get().dirRefresh(dir);
    },
    fileMarkSet: (file, markkey, markValue) => {
      if (!file) {
        return;
      }
      _.set(file, ['mark', markkey], markValue);
      set((state) => ({
        dirs: [...state.dirs],
      }));
    },
    dirFilterSet: (dir, key, value) => {
      set((state) => ({
        dirs: state.dirs.map(d => ({
          ...d,
          filter: d.id === dir?.id ? {
            ...d.filter,
            [key]: value
          } : d.filter
        })),
      }))
    }
  };
})

export { useStore };

export * from './types';