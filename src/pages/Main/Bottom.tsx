import { Flex, Center, Box, CheckboxGroup, Stack, HStack, Tag, useToast } from '@chakra-ui/react';
import {  FileTag, File } from '@/types';
import FilePreview from "@/components/FilePreview";
import _ from 'lodash';
import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Space } from '@/components/Space';
import { cn } from '@/lib/utils';
import { Trash2 } from "lucide-react"
import Filter from './components/Filter';
import { useCurrentWorkspace, useStore, useActions } from '@/hooks';
import DeleteConfirm from './components/DeleteConfirm';

export default function () {
  const { fileSelect } = useActions();
  const { dir, files, selectedFiles, onSelectAll, onUnselectAll, onDeleteSelectedFile } = useCurrentWorkspace();
  const selectIds = selectedFiles.map(f => f.id);

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

  const onImgSelect = () => {

  };

  console.log('files', files)


  return (
    <div className='h-full w-full flex flex-col'>
      <Space className={cn('h-8 shrink-0 flex justify-between px-2')}>
        <div></div>
        <Space>
          <Button variant="outline" size="xs" onClick={onSelectAll}>全选</Button>
          <Button variant="outline" size="xs" onClick={onUnselectAll}>取消选中</Button>
          {/* <Button variant="outline" size="xs" onClick={onRemove}>删除选中图片</Button> */}


          <DeleteConfirm>
            <Button variant="secondary" size={'xs'}
              onClick={() => {
                onDeleteSelectedFile()
              }}
            >
              <Trash2 size={16} strokeWidth={1} />
            </Button>
          </DeleteConfirm>

          {/* <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="secondary" size={'xs'}>
                <Bolt size={16} strokeWidth={1} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" align="end">
              <DropdownMenuLabel>配置</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Checkbox checked={setting.mergeSameNameFiles} onCheckedChange={(v: boolean) => setSetting({ mergeSameNameFiles: v })} />&nbsp;合并相同名称照片
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}

          <Filter />

        </Space>
      </Space>
      <div className='grow px-4 pb-4 pt-1 overflow-auto'>
        <Space className='h-full' size={'lg'}>
          {files?.map((file: File) => {
            return (
              <div
                className={cn('h-full aspect-[2/3]', {
                  'outline outline-gray-600 shadow-xl': selectIds.includes(file.id),
                  'opacity-50': file.mark?.delete,
                })}
                key={file.path}
                onClick={() => {
                  fileSelect(dir, file);
                }}
              >
                <FilePreview file={file} />
              </div>
            )
          })}
        </Space>
      </div>
    </div>
  )
}