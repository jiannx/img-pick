import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { open } from "@tauri-apps/api/dialog"
import { readDir, BaseDirectory, readBinaryFile } from '@tauri-apps/api/fs';
import { useSetState, useAsyncEffect } from 'ahooks';
import { Button, Flex, Center, Text, Box } from '@chakra-ui/react';
import { useStore, File } from '@/store';


export default function ImageCard({
  file,
  onClick,
}: {
  file: File,
  onClick: () => void;
}) {
  const { setState, files } = useStore();

  return (
    <Box
      w={'100px'}
      flexShrink={0}
      borderWidth='1px'
      borderRadius='lg'
      overflow='hidden'
      cursor={'pointer'}
      mx={2}
      onClick={onClick}
    >
      {file.pureName}
    </Box>
  )
}