import { Flex, Center, Box, CheckboxGroup, Stack, Checkbox, HStack, Tag, useToast } from '@chakra-ui/react';
import { useStore, FileTag, File } from '@/store';
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
import { Button } from "@/components/ui/button";
import { ThemeTigger } from '@/components/Theme';
import { Space } from '@/components/Space';
import { Settings, CircleHelp, SunMedium, MoonStar } from "lucide-react"
import LeftPanel from './LeftPanel';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function () {

  const { setState, fileGroups, previewGroup, filter, onReset, actions, dirs } = useStore();
  const files = dirs.find(d => d.selected)?.files || [];
  console.log('files', files)
  const toast = useToast({
    isClosable: true,
  });
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

  // let showGroups = fileGroups?.filter(g => {
  //   if (filter === FileTag.Del) {
  //     return g.tags?.includes(FileTag.Del);
  //   }
  //   if (filter === FileTag.NotDel) {
  //     return !g.tags?.includes(FileTag.Del);
  //   }
  //   return true;
  // });

  const onRemove = async () => {
    // const yes = await ask('将同时从磁盘中删除.RAW等后缀的同名文件', { title: '确认删除' });
    // if (yes) {
    //   toast.promise(actions.removeFiles(), {
    //     success: { title: '文件删除成功' },
    //     error: { title: '文件删除失败', },
    //     loading: { title: '文件删除中', description: 'Please wait' },
    //   });
    // }
  };

  return (
    <div className='h-full w-full flex flex-col'>
      <div className={cn('h-8 shrink-0 flex justify-between items-center')}>
        <div></div>
        <Space>
          {/* <Button variant="outline" size="xs" onClick={actions?.selectAll}>全部选中</Button>
          <Button variant="outline" size="xs" onClick={actions?.unselectAll}>取消选中</Button>
          <Button variant="outline" size="xs" onClick={onRemove}>删除选中图片</Button> */}

          <Select onChange={e => {
            // setState({ filter: e.target.value, previewGroup: null });
          }}>
            <SelectTrigger>
              <SelectValue placeholder="关闭过滤器" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={FileTag.Del}>已标记删除</SelectItem>
              <SelectItem value={FileTag.NotDel}>未标记删除</SelectItem>
            </SelectContent>
          </Select>
        </Space>
      </div>
      <div className='grow p-4 overflow-auto'>
        <div className='flex h-full' size={'md'}>
          {files?.map((file: File) => {
            // const isSel = group.isSelected || group.pureName === previewGroup?.pureName;
            const isSel = false;
            return (
              <div
                className='h-full relative overflow-hidden'
                key={file.path}
                // borderWidth={isSel ? '4px' : '4px'}
                // borderColor={isSel ? 'green' : 'gray.50'}
                // boxShadow={isSel ? '2xl' : 'none'}
                // cursor={'pointer'}
                // mx={2}
                // onClick={() => {
                //   actions?.setSelectedGroup(group);
                // }}
              // opacity={group?.tags?.includes(FileTag.Del) ? 0.5 : 1}
              >
                <FilePreview file={file} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}