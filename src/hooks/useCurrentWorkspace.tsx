import { useStore, File } from "@/store";

export default function useCurrentWorkspace() {
  const { dirs, fileSelect, fileSelectDelete } = useStore();
  const dir = dirs.find(d => d.selected);
  const filter = dir?.filter;
  let files = (dir?.files || []).filter(f => dir?.filter.suffixes?.includes(f.suffix));
  // 已标记删除的
  if (filter?.markAsDelete) {
    files = files.filter(f => f.mark?.delete);
  }
  // 尚未标记删除的
  if (filter?.notMarkAsDelete) {
    files = files.filter(f => !f.mark?.delete);
  }

  const selectedFiles = files.filter(f => f.selected === true);
  const selectedFileIndex = files.findIndex(f => f.selected === true) + 1;

  return {
    dir,
    files,
    selectedFiles,
    selectedFileIndex,
    filter,
    onSelectAll: () => {
      fileSelect(dir, files);
    },
    onUnselectAll: () => {
      fileSelect(dir, []);
    },
    onDeleteSelectedFile: () => {
      // console.log(files.filter(f => f.selected));
      // fileSelectDelete(dir!, files.filter(f => f.selected));
    },
  }
}