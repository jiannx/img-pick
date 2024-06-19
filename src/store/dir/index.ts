import { create, StateCreator } from 'zustand';
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { open } from "@tauri-apps/api/dialog"
import { readDir } from '@tauri-apps/api/fs';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, Stack, Tag, VStack } from '@chakra-ui/react';
import { useStore, File, FileGroup } from '@/store';
import { isImageFile } from "@/utils";
import _ from 'lodash';
import { Dir, ImagesSuffix } from '../types';


export interface DirState {
  /**  directory list */
  dirs: Array<Dir>;
  /** add new directory */
  dirAdd: () => void;
  /** remove directory */
  dirRemove: (dir: Dir) => void;
  /** select directory */
  dirSelect: (dir: Dir) => void;
}

export const createDir: StateCreator<
  DirState,
  [],
  [],
  DirState
> = (set, get) => ({
  dirs: [],
  async dirAdd() {
    let workDir = await open({ multiple: false, directory: true });
    const path = workDir as string;
    const files: File[] = (await readDir(path, { recursive: true })).map(f => {
      const nameSplit = f.name?.split('.') || [];
      const suffix = (nameSplit.pop() || '').toLowerCase();
      return {
        dir: path,
        path: f.path,
        name: f.name || '',
        url: convertFileSrc(f.path) || '',
        pureName: nameSplit.join('.'),
        suffix,
      }
    }).filter(f => ImagesSuffix.includes(f.suffix));
    const dir: Dir = {
      path: workDir as string,
      name: _.last((workDir as string).split('/')) || '',
      files: files,
    };
    const state = get();
    if (state.dirs.length === 0) {
      dir.selected = true;
    }
    set(state => ({
      dirs: _.uniqBy([...state.dirs, dir], 'path'),
    }));
    // 同名文件合并
    // const fileMap: { [key: string]: File[] } = {};
    // files
    //   .filter(file => file.pureName) // 过滤名字不存在的 .ds_store
    //   .forEach(file => {
    //     if (!fileMap[file.pureName as string]) {
    //       fileMap[file.pureName as string] = [];
    //     }
    //     fileMap[file.pureName as string].push(file);
    //   });

    // let fileGroups: FileGroup[] = Object.values(fileMap).map((files: File[]) => {
    //   return {
    //     pureName: files[0].pureName,
    //     imageFile: files.find(f => isImageFile(f)),
    //     files,
    //   }
    // });
    // fileGroups = _.sortBy(fileGroups, ['pureName']);

    // set({
    //   files,
    //   fileGroups,
    // });
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
});