import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { open } from "@tauri-apps/api/dialog"
import { readDir, BaseDirectory, readBinaryFile } from '@tauri-apps/api/fs';
import { useSetState, useAsyncEffect } from 'ahooks';
import { Button, Flex, Center, Text, Box } from '@chakra-ui/react';
import { useStore, File } from '@/store';
import ImageCard from "@/components/ImageCard";


export default function () {
  const { setState, files, mergedFiles, previewFile } = useStore();

  return (
    <Flex direction="column" h="100vh" >
      <Center flex={1} >
        {previewFile &&
          <div>{previewFile.pureName}</div>
        }
      </Center>
      <Flex height={'100px'} borderTop={1} borderColor={'gray'} borderStyle={'solid'} overflow={'auto'} py={2}>
        {mergedFiles?.map(file =>
          <ImageCard
            key={file.name}
            file={file}
            onClick={() => {
              setState({ previewFile: file })
            }}
          />
        )}
      </Flex>
    </Flex>
  )
}