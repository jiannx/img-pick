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
import { Settings, CircleHelp, SunMedium, Bolt, Trash2 } from "lucide-react"
import LeftPanel from './LeftPanel';
import { StarMark, ColorMark, TrashMark } from '@/components/Mark';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox"


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

  let showGroups = fileGroups?.filter(g => {
    if (filter === FileTag.Del) {
      return g.tags?.includes(FileTag.Del);
    }
    if (filter === FileTag.NotDel) {
      return !g.tags?.includes(FileTag.Del);
    }
    return true;
  });

  return (
    <div className='h-full w-full flex flex-col'>
      <div className='flex'>
        <Box fontSize="small">
          {previewGroup?.pureName}
        </Box>
        {previewGroup?.files?.map((file) => (
          <Tag size="sm" key={file.suffix} colorScheme="blue" fontSize={'x-small'}>
            {file.suffix}
          </Tag>
        ))}
        {/* <Icon as={MdClose} boxSize={6} onClick={onReset} title="重新选择目录"></Icon> */}
      </div>
      <div className='grow flex items-center justify-center'>
        {previewGroup &&
          <FilePreview file={previewGroup?.imageFile}></FilePreview>
        }
      </div>
      <div className='h-10 flex justify-between items-center px-2'>
        <Space>
          <ColorMark />
          <StarMark />
          <TrashMark />
        </Space>
        <div className='text-sm'>
          1 / 20
        </div>
        <Space>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="secondary" size={'xs'}>
                <Bolt size={16} strokeWidth={1} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" align="end">
              <DropdownMenuLabel>配置</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Checkbox />&nbsp;合并相同名称照片
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary" size={'xs'}>
            <Trash2 size={16} strokeWidth={1} />
          </Button>
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