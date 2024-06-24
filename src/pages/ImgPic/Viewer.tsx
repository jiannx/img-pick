import { Flex, Center, Box, Select, CheckboxGroup, Stack, HStack, Tag, useToast } from '@chakra-ui/react';
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
import { Button } from "@/components/ui/button"
import { ThemeTigger } from '@/components/Theme';
import { Space } from '@/components/Space';
import { ChevronLeft, ChevronRight } from "lucide-react"
import LeftPanel from './LeftPanel';
import { StarMark, ColorMark, TrashMark } from '@/components/Mark';
import { useCurrentWorkspace } from '@/hooks';


export default function () {
  const { fileSelectPrevious, fileSelectNext, fileMarkSet } = useStore();
  const { dir, files, selectedFiles, selectedFileIndex } = useCurrentWorkspace();
  const selectedFile = selectedFiles[0];

  const toast = useToast({
    isClosable: true,
  });
  const listRef = useRef<HTMLDivElement>();

  useKeyPress('leftarrow', (e) => {
    e.stopPropagation();
    // actions.preiviewPrevious();

    listRef.current?.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  });
  useKeyPress('rightarrow', (e) => {
    e.stopPropagation();
    // actions.preiviewNext();

  });
  useKeyPress('meta.a', (e) => {
    e.stopPropagation();
    actions.selectAll();
  });
  useKeyPress(['delete', 'backspace', 'd'], (e) => {
    // e.stopPropagation();
    // if (previewGroup?.tags?.includes(FileTag.Del)) {
    //   actions.setGroupTagChange(previewGroup!, previewGroup?.tags.filter(t => t !== FileTag.Del));
    // } else {
    //   actions.setGroupTagChange(previewGroup!, [...(previewGroup?.tags || []), FileTag.Del]);
    // }
  });

  if (!selectedFile) {
    return null;
  }

  return (
    <div className='h-full w-full flex flex-col relative overflow-hidden'>
      <div className='flex'>
        {/* <Icon as={MdClose} boxSize={6} onClick={onReset} title="重新选择目录"></Icon> */}
      </div>
      <div className='grow flex items-center justify-center h-0'>
        <FilePreview file={selectedFile}></FilePreview>
      </div>
      <div className='h-8 flex justify-between items-center px-2'>
        <Space>
          {/* <ColorMark /> */}
          <StarMark
            value={selectedFile?.mark?.star}
            onChange={(v) => {
              fileMarkSet(selectedFile, 'star', v);
              return {};
            }}
          />
          <TrashMark
            value={selectedFile?.mark?.delete}
            onChange={(v) => {
              fileMarkSet(selectedFile, 'delete', v);
              return {};
            }}
          />
        </Space>
        <Space size={'lg'} className='text-sm'>
          <span> {selectedFile?.name} </span>
          <Space>
            <Button variant="secondary" size={'xs'} onClick={fileSelectPrevious}>
              <ChevronLeft size={16} strokeWidth={1} />
            </Button>
            <span>{selectedFileIndex}/{files.length}</span>
            <Button variant="secondary" size={'xs'}>
              <ChevronRight size={16} strokeWidth={1} onClick={fileSelectNext} />
            </Button>
          </Space>
        </Space>
        {/* <CheckboxGroup value={previewGroup?.tags || []} onChange={(tags: FileTag[]) => actions.setGroupTagChange(previewGroup!, tags)}>
          <Stack spacing={[5, 5]} direction={['column', 'row']}>
            <Checkbox value={FileTag.Del}><Box fontSize="small">标记删除</Box></Checkbox>
          </Stack>
        </CheckboxGroup> */}
      </div>
    </div>
  )
}