import { Dir, File, ImagesSuffix, Suffix } from "@/types";
import useStore from "../useStore";
import _ from 'lodash';
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog"
import { readDir } from '@tauri-apps/api/fs';
import { convertFileSrc } from '@tauri-apps/api/tauri'

export default function useActions() {
  const store = useStore();
  const { set } = store;

  const actions = {
    dirRead: async (path: string) => {
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
    dirAdd: async () => {
      let workDir = await open({ multiple: false, directory: true });
      const path = workDir as string;
      const dir = await actions.dirRead(path);

      if (store.dirs.length === 0) {
        dir.selected = true;
      }
      console.log('dir', dir)
      set({
        dirs: _.uniqBy([...store.dirs, dir], 'path'),
      });
    },
    /** remove directory */
    dirRemove: (dir: Dir) => {
      set({
        dirs: store.dirs.filter(d => d.path !== dir.path)
      });
    },
    /** select directory */
    dirSelect: (dir: Dir) => {
      set({
        dirs: store.dirs.map(d => ({
          ...d, selected: dir.path === d.path,
        })),
      });
    },
    /** 目录刷新 */
    dirRefresh: async (dir: Dir) => {
      const newdir = await actions.dirRead(dir.path);
      const oldDir = store.dirs.find(d => d.id === dir.id);
      newdir.selected = oldDir?.selected as boolean;
      Object.assign(oldDir!, newdir)
      set({
        dirs: [...store.dirs],
      });
    },
    /** 文件选中 */
    fileSelect: (dir?: Dir, file?: File | File[], isClearOthers?: boolean) => {
      const fileIds = _.isArray(file) ? file.map(f => f?.id) : [file?.id]
      dir?.files?.forEach(f => {
        if (fileIds.includes(f.id)) {
          f.selected = true;
        } else if (isClearOthers) {
          f.selected = false;
        }
      });
      set({
        dirs: [...store.dirs],
      });
    },
    /** 文件全选 */
    fileSelectAll: (dir: Dir) => {
      dir?.files?.forEach(f => {
        f.selected = true;
      });
      set({
        dirs: [...store.dirs],
      });
    },
    /** 文件选择下一张 */
    fileSelectPrevious: () => {
      const dir = store.dirs.find(d => d.selected);
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
      set({
        dirs: [...store.dirs],
      });
    },
    /** 文件选中下一张 */
    fileSelectNext: () => {
      const dir = store.dirs.find(d => d.selected);
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
      set({
        dirs: [...store.dirs],
      });
    },
    /** 图片删除 */
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
      actions.dirRefresh(dir);
    },
    /** set tags */
    fileMarkSet: (file: File | undefined, markkey: 'delete' | 'color' | 'star', markValue: any) => {
      if (!file) {
        return;
      }
      _.set(file, ['mark', markkey], markValue);
      set({
        dirs: [...store.dirs],
      });
    },
    /** 文件过滤器设置 */
    dirFilterSet: (dir: Dir | undefined, markkey: string, value: any) => {
      set({
        dirs: store.dirs.map(d => ({
          ...d,
          filter: d.id === dir?.id ? {
            ...d.filter,
            [markkey]: value
          } : d.filter
        })),
      })
    },
  }

  return actions;
}