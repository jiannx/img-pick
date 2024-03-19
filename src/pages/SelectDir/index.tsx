import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { open } from "@tauri-apps/api/dialog"
import { readDir, BaseDirectory, readBinaryFile } from '@tauri-apps/api/fs';
import { useSetState, useAsyncEffect } from 'ahooks';
import { Button, Center } from '@chakra-ui/react';
import { useStore, File, FileGroup } from '@/store';
import { isImageFile } from "@/utils";


export default function () {
  const { setState } = useStore();

  const onSelectDir = async () => {
    // 读取文件
    let workDir = await open({ multiple: false, directory: true });
    const files: File[] = (await readDir(workDir as string, { recursive: true }))
      .map(f => {
        const nameSplit = f.name?.split('.') || [];
        const suffix = nameSplit.pop();
        return {
          dir: workDir,
          path: f.path,
          name: f.name,
          url: convertFileSrc(f.path),
          pureName: nameSplit.join('.'),
          suffix,
        }
      });

    // 同名文件合并
    const fileMap: { [key: string]: File[] } = {};
    files
      .filter(file => file.pureName) // 过滤名字不存在的 .ds_store
      .forEach(file => {
        if (!fileMap[file.pureName as string]) {
          fileMap[file.pureName as string] = [];
        }
        fileMap[file.pureName as string].push(file);
      });

    const fileGroups: FileGroup[] = Object.values(fileMap).map((files: File[]) => {
      return {
        pureName: files[0].pureName,
        imageFile: files.find(f => isImageFile(f)),
        files,
      }
    });

    setState({
      workDir,
      files,
      fileGroups,
    });
    console.log('files', fileGroups)
  }

  return (
    <Center w="100vh" h="100vh">
      <Button onClick={onSelectDir}>选择目录</Button>
    </Center>
  )
}