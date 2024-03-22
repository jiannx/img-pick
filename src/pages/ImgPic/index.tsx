import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { open } from "@tauri-apps/api/dialog"
import { readDir, BaseDirectory, readBinaryFile } from '@tauri-apps/api/fs';
import { useSetState, useAsyncEffect } from 'ahooks';
import { Button, Flex, Center, Text, Box, Select, CheckboxGroup, Stack, Checkbox, HStack, Tag, useToast } from '@chakra-ui/react';
import { useStore, File, FileTag } from '@/store';
import FilePreview from "@/components/FilePreview";
import { removeFile } from '@tauri-apps/api/fs';
import Confirm from "@/components/Confirm";

const FilterTagNotDel = 'notDel';

export default function () {
  const { setState, fileGroups, previewGroup, setGroupTagChange, setSelectedGroup, removeFiles } = useStore();
  const [filter, setFilter] = useState<null | string>(null);
  const toast = useToast();

  const showGroups = fileGroups?.filter(g => {
    if (filter === FileTag.DEL) {
      return g.tags?.includes(FileTag.DEL);
    }
    if (filter === FilterTagNotDel) {
      return !g.tags?.includes(FileTag.DEL);
    }
    return true;
  });

  const onRemove = async () => {
    toast.promise(removeFiles(previewGroup), {
      success: { title: '文件删除成功' },
      error: { title: '文件删除失败', },
      loading: { title: '文件删除中', description: 'Please wait' },
    });
  };

  return (
    <Flex direction="column" h="100vh" >
      <Center flex={1} overflow={'auto'} position="relative" p={4}>
        {previewGroup &&
          <FilePreview file={previewGroup?.imageFile}></FilePreview>
        }
      </Center>
      <Flex
        height={30}
        justifyContent="space-between"
        alignItems="center"
        borderTop={0}
        borderBottom={0}
        borderColor={'gray'}
        borderStyle={'solid'}
        paddingLeft={4}
        paddingRight={4}
      >
        <HStack spacing={2} >
          <Box fontSize="small">
            {previewGroup?.pureName}
          </Box>
          {previewGroup?.files?.map((file) => (
            <Tag size="sm" key={file.suffix} colorScheme="blue" fontSize={'x-small'}>
              {file.suffix}
            </Tag>
          ))}
        </HStack>
        <Box>
          <CheckboxGroup value={previewGroup?.tags || []} onChange={(tags: FileTag[]) => setGroupTagChange(previewGroup!, tags)}>
            <Stack spacing={[5, 5]} direction={['column', 'row']}>
              <Checkbox value={FileTag.DEL}>标记删除</Checkbox>
            </Stack>
          </CheckboxGroup>
        </Box>
      </Flex>
      <Flex
        height={'40px'}
        flexShrink={0}
        justifyContent="space-between"
        alignItems="center"
        px={2}
        borderTop={1}
        borderColor={'gray.200'}
        borderStyle={'solid'}
        bg="gray.50"
      >
        <Box>

        </Box>
        <Flex>
          <Confirm
            onOk={onRemove}
            context={'是否删除文件，将同时从磁盘中删除.RAW等后缀的同名文件'}
          >
            <Button size="xs" mr={4}>删除选中图片</Button>
          </Confirm >
          <Select placeholder='关闭过滤器' size='xs' variant='filled' onChange={e => setFilter(e.target.value)}>
            <option value={FileTag.DEL}>已标记删除</option>
            <option value={FilterTagNotDel}>未标记删除</option>
          </Select>
        </Flex>
      </Flex>
      <Flex
        height={'150px'}
        flexShrink={0}
        bg="gray.50"
        overflow={'auto'}
        px={4}
      >
        {showGroups?.map(group => {
          const isSel = group.pureName === previewGroup?.pureName;
          return (
            <Box
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
                setSelectedGroup(group);
              }}
              opacity={group?.tags?.includes(FileTag.DEL) ? 0.5 : 1}
              
            >
              <FilePreview file={group.imageFile} />
            </Box>
          )
        })}
      </Flex>
    </Flex>
  )
}