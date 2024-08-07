import { useStore, useActions } from "@/hooks";
import { useEffect, useRef } from "react";
import { useKeyPress } from 'ahooks';

export default function useKeyboard() {
  const { fileSelect, fileSelectDelete } = useActions();

  const listRef = useRef<HTMLDivElement>();

  // useKeyPress('leftarrow', (e) => {
  //   e.stopPropagation();
  //   actions.preiviewPrevious();

  //   listRef.current?.scrollTo({
  //     left: 0,
  //     behavior: "smooth",
  //   });
  // });
  // useKeyPress('rightarrow', (e) => {
  //   e.stopPropagation();
  //   actions.preiviewNext();

  // });
  // useKeyPress('meta.a', (e) => {
  //   e.stopPropagation();
  //   actions.selectAll();
  // });
  // useKeyPress(['delete', 'backspace', 'd'], (e) => {
  //   e.stopPropagation();
  //   if (previewGroup?.tags?.includes(FileTag.Del)) {
  //     actions.setGroupTagChange(previewGroup!, previewGroup?.tags.filter(t => t !== FileTag.Del));
  //   } else {
  //     actions.setGroupTagChange(previewGroup!, [...(previewGroup?.tags || []), FileTag.Del]);
  //   }
  // });

  useEffect(() => {
    // 移除默认快捷键
    document.addEventListener("keydown", function (event) {
      event.preventDefault();
    });
  }, []);

  return {}
}