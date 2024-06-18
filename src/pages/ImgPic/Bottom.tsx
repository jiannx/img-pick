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
import { Button } from "@/components/ui/button"
import { ThemeTigger } from '@/components/Theme';
import { Space } from '@/components/Space';
import { Settings, CircleHelp, SunMedium, MoonStar } from "lucide-react"
import LeftPanel from './LeftPanel';


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

  const onRemove = async () => {
    const yes = await ask('将同时从磁盘中删除.RAW等后缀的同名文件', { title: '确认删除' });
    if (yes) {
      toast.promise(actions.removeFiles(), {
        success: { title: '文件删除成功' },
        error: { title: '文件删除失败', },
        loading: { title: '文件删除中', description: 'Please wait' },
      });
    }
  };

  return (
    <div className='h-full w-full flex flex-col'>
      <div className='flex'>
        <Icon as={MdClose} boxSize={6} onClick={onReset} title="重新选择目录"></Icon>
        <Flex alignItems="center">
          <Button size="xs" mr={2} w={'80px'} onClick={actions.selectAll}>全部选中</Button>
          <Button size="xs" mr={2} w={'80px'} onClick={actions.unselectAll}>取消选中</Button>
          <Button size="xs" mr={2} w={'100px'} onClick={onRemove}>删除选中图片</Button>
          <Select placeholder='关闭过滤器' size='xs' variant='filled' onChange={e => {
            setState({ filter: e.target.value, previewGroup: null });
          }} w={150}>
            <option value={FileTag.Del}>已标记删除</option>
            <option value={FileTag.NotDel}>未标记删除</option>
          </Select>
        </Flex>
      </div>
      <div className='grow flex items-center justify-center'>
        <Flex
          height={'150px'}
          flexShrink={0}
          bg="gray.50"
          overflow={'auto'}
          px={4}
          ref={listRef}
        >
          {showGroups?.map(group => {
            const isSel = group.isSelected || group.pureName === previewGroup?.pureName;
            return (
              <Box
                key={group.pureName}
                minW={'80px'}
                height={'120px'}
                flexShrink={0}
                overflow='hidden'
                borderWidth={isSel ? '4px' : '4px'}
                borderColor={isSel ? 'green' : 'gray.50'}
                boxShadow={isSel ? '2xl' : 'none'}
                cursor={'pointer'}
                mx={2}
                onClick={() => {
                  actions.setSelectedGroup(group);
                }}
                opacity={group?.tags?.includes(FileTag.Del) ? 0.5 : 1}
              >
                <FilePreview file={group.imageFile} />
              </Box>
            )
          })}
        </Flex>
      </div>
      <div></div>
    </div>
  )
}