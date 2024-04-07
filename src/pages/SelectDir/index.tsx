import { convertFileSrc } from '@tauri-apps/api/tauri'
import { open } from "@tauri-apps/api/dialog"
import { readDir } from '@tauri-apps/api/fs';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, Stack, Tag, VStack } from '@chakra-ui/react';
import { useStore, File, FileGroup } from '@/store';
import { isImageFile } from "@/utils";


export default function () {
  const { setState } = useStore();

  const onSelectDir = async () => {
    // 读取文件
    let workDir = await open({ multiple: false, directory: true });
    const files: any[] = (await readDir(workDir as string, { recursive: true }))
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
    <Flex w="100%" height='100vh' alignItems="center" flexDirection="column" justifyContent="center">
      <Button onClick={onSelectDir} mb={4}>选择目录</Button>
      <Alert
        status='info'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='200px'
        width="70vh"
        position="absolute"
        bottom={4}
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle mt={4} mb={1} fontSize='lg'>
          操作说明
        </AlertTitle>
        <AlertDescription>
          <VStack>
            <Box fontSize="small" textAlign="left" w={300}>
              <p>1. 选择需要管理的图片文件夹</p>
              <p>2. 筛选图片</p>
              <p>3. 删除图片并同时删除同名.RAW文件</p>
            </Box>
            <Stack spacing={1} direction={['column', 'row']}>
              <Tag size="sm">command+a 全选</Tag>
              <Tag size="sm">delete 标记删除</Tag>
              <Tag size="sm">&lt;&minus; 上一张</Tag>
              <Tag size="sm">&minus;&gt; 下一张</Tag>
            </Stack>
          </VStack>
        </AlertDescription>
      </Alert>
    </Flex>
  )
}