import { create, StateCreator } from 'zustand';
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { open } from "@tauri-apps/api/dialog"
import { readDir } from '@tauri-apps/api/fs';
import { useStore, File, FileGroup } from '@/store';
import _ from 'lodash';
import { Dir, ImagesSuffix, Suffix } from '../types';
import { invoke } from "@tauri-apps/api/tauri";

export interface DirState {
  /**  directory list */
  dirs: Array<Dir>;
  /** add new directory */
  dirAdd: () => void;
  /** remove directory */
  dirRemove: (dir: Dir) => void;
  /** select directory */
  dirSelect: (dir: Dir) => void;
  fileSelect: (dir?: Dir, file?: File | File[], isClearOthers?: boolean) => void;
  fileSelectAll: () => void;
  fileSelectPrevious: () => void;
  fileSelectNext: () => void;
  fileSelectDelete: (dir: Dir, file: File[]) => Promise<void>;
  /** set tags */
  fileMarkSet: (file: File | undefined, markkey: 'delete' | 'color' | 'star', markValue: any) => void;
  dirFilterSet: (die: Dir | undefined, markkey: string, value: any) => void;
}

export const createDir: StateCreator<
  DirState,
  [],
  [],
  DirState
> = (set, get) => ({
  dirs: [],
  fileFilterConfig: {

  },
  async dirAdd() {
    let workDir = await open({ multiple: false, directory: true });
    const path = workDir as string;

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
    files = _.sortBy(files, ['name'])

    const dir: Dir = {
      id: workDir as string,
      path: workDir as string,
      name: _.last((workDir as string).split('/')) || '',
      files: files,
      selected: false,
      filter: {
        markAsDelete: false,
        suffixes: _.uniq(files.map(f => f.suffix)),
      }
    };

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
    const ids = files.map(f => f.id);
    dir.files = dir.files.filter(f => !ids.includes(f.id));
    set((state) => ({
      dirs: [...state.dirs],
    }));
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
});