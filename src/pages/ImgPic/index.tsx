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
import { Icon } from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import { ask } from '@tauri-apps/api/dialog';
import { useKeyPress } from 'ahooks';

export default function () {
  const { setState, fileGroups, previewGroup, filter, onReset, actions } = useStore();
  const toast = useToast({
    isClosable: true,
  });

  useKeyPress('leftarrow', (e) => {
    e.stopPropagation();
    actions.preiviewPrevious();
  });
  useKeyPress('rightarrow', (e) => {
    e.stopPropagation();
    actions.preiviewNext();
  });
  useKeyPress('meta.a', (e) => {
    e.stopPropagation();
    actions.selectAll();
  });
  useKeyPress(['delete', 'backspace'], (e) => {
    e.stopPropagation();
    if (previewGroup?.tags?.includes(FileTag.Del)) {
      actions.setGroupTagChange(previewGroup!, previewGroup?.tags.filter(t => t !== FileTag.Del));
    } else {
      actions.setGroupTagChange(previewGroup!, [...(previewGroup?.tags || []), FileTag.Del]);
    }
  });

  const showGroups = fileGroups?.filter(g => {
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
      toast.promise(actions.removeFiles(previewGroup), {
        success: { title: '文件删除成功' },
        error: { title: '文件删除失败', },
        loading: { title: '文件删除中', description: 'Please wait' },
      });
    }
  };

  return (
    <Flex direction="column" h="100vh" >
      {/* 预览 */}
      <Center flex={1} overflow={'auto'} position="relative" p={4}>
        {previewGroup &&
          <FilePreview file={previewGroup?.imageFile}></FilePreview>
        }
        <Box position="absolute" top={0} right={0} >
          <Icon as={MdClose} boxSize={6} onClick={onReset} title="重新选择目录"></Icon>
        </Box>
      </Center>

      <Flex
        height={30}
        justifyContent="space-between"
        alignItems="center"
        borderColor={'gray'}
        borderStyle={'solid'}
        px={4}
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
          <CheckboxGroup value={previewGroup?.tags || []} onChange={(tags: FileTag[]) => actions.setGroupTagChange(previewGroup!, tags)}>
            <Stack spacing={[5, 5]} direction={['column', 'row']}>
              <Checkbox value={FileTag.Del}><Box fontSize="small">标记删除</Box></Checkbox>
            </Stack>
          </CheckboxGroup>
        </Box>
      </Flex>
      {/* 中间工具 */}
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
        <Box></Box>
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
      </Flex>
      <Flex
        height={'150px'}
        flexShrink={0}
        bg="gray.50"
        overflow={'auto'}
        px={4}
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
    </Flex>
  )
}