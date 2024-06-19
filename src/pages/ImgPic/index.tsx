import { Flex, Center, Box, Select, CheckboxGroup, Stack, Checkbox, HStack, Tag, useToast } from '@chakra-ui/react';
import { useStore, FileTag } from '@/store';
import FilePreview from "@/components/FilePreview";
import { Icon } from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import { ask } from '@tauri-apps/api/dialog';
import { useKeyPress } from 'ahooks';
import _ from 'lodash';
import { useEffect, useRef } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import LeftPanel from './LeftPanel';
import Viewer from './Viewer';
import Bottom from './Bottom';

export default function () {
  const { setState, fileGroups, previewGroup, filter, onReset, actions } = useStore();
  const toast = useToast({
    isClosable: true,
  });
  const listRef = useRef<HTMLDivElement>();

  useKeyPress('leftarrow', (e) => {
    e.stopPropagation();
    actions.preiviewPrevious();

    listRef.current?.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  });
  useKeyPress('rightarrow', (e) => {
    e.stopPropagation();
    actions.preiviewNext();

  });
  useKeyPress('meta.a', (e) => {
    e.stopPropagation();
    actions.selectAll();
  });
  useKeyPress(['delete', 'backspace', 'd'], (e) => {
    e.stopPropagation();
    if (previewGroup?.tags?.includes(FileTag.Del)) {
      actions.setGroupTagChange(previewGroup!, previewGroup?.tags.filter(t => t !== FileTag.Del));
    } else {
      actions.setGroupTagChange(previewGroup!, [...(previewGroup?.tags || []), FileTag.Del]);
    }
  });

  return (
    <ResizablePanelGroup direction="horizontal">
      {/* 左侧面板 */}
      <ResizablePanel defaultSize={20}>
        <LeftPanel />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
            {/* 中间显示区域 */}
            <Viewer></Viewer>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={25}>
            {/* 底部预览区 */}
            <Bottom />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>

    </ResizablePanelGroup>
  )
}