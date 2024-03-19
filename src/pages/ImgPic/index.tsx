import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { open } from "@tauri-apps/api/dialog"
import { readDir, BaseDirectory, readBinaryFile } from '@tauri-apps/api/fs';
import { useSetState, useAsyncEffect } from 'ahooks';
import { Button, Flex, Center, Text, Box, Select } from '@chakra-ui/react';
import { useStore, File } from '@/store';
import FilePreview from "@/components/FilePreview";


export default function () {
  const { setState, files, fileGroups, previewFile } = useStore();

  return (
    <Flex direction="column" h="100vh" >
      <Center flex={1} overflow={'auto'} position="relative">
        {previewFile &&
          <FilePreview file={previewFile}></FilePreview>
        }
        <Box position="absolute" left={0} bottom={0} fontSize="smaller">
          {previewFile?.path}
        </Box>
      </Center>
      <Flex height={30} flexShrink={0} justifyContent="space-between" alignItems="center" borderTop={2} borderBottom={2} borderColor={'gray'} borderStyle={'solid'}>
        <Box>
        </Box>
        <Box>
          <Select placeholder='关闭过滤器' size='xs' variant='filled' onChange={e => console.log(e.target.value)}>
            <option value='option1'>以勾选删除</option>
          </Select>
        </Box>
      </Flex>
      <Flex height={'100px'} flexShrink={0} overflow={'auto'} py={2}>
        {fileGroups?.map(group =>
          <Box
            w={'100px'}
            flexShrink={0}
            borderWidth='1px'
            borderRadius='lg'
            overflow='hidden'
            cursor={'pointer'}
            mx={2}
            onClick={() => {
              setState({ previewFile: group?.imageFile })
            }}
          >
            <FilePreview file={group.imageFile} />
          </Box>
        )}
      </Flex>
    </Flex>
  )
}