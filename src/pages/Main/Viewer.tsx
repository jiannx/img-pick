import FilePreview from "@/components/FilePreview";
import _ from 'lodash';
import { Button } from "@/components/ui/button"
import { Space } from '@/components/Space';
import { ChevronLeft, ChevronRight } from "lucide-react"
import LeftPanel from './LeftPanel';
import { StarMark, ColorMark, TrashMark } from '@/components/Mark';
import { useCurrentWorkspace, useStore, useActions } from '@/hooks';


export default function () {
  const { fileSelectPrevious, fileSelectNext, fileMarkSet } = useActions();
  const { dir, files, selectedFiles, selectedFileIndex } = useCurrentWorkspace();
  const selectedFile = selectedFiles[0];

  if (!selectedFile) {
    return null;
  }

  return (
    <div className='h-full w-full flex flex-col relative overflow-hidden'>
      <div className='flex'>
        {/* <Icon as={MdClose} boxSize={6} onClick={onReset} title="重新选择目录"></Icon> */}
      </div>
      <div className='grow flex items-center justify-center h-0'>
        <FilePreview file={selectedFile}></FilePreview>
      </div>
      <div className='h-8 flex justify-between items-center px-2'>
        <Space>
          {/* <ColorMark /> */}
          <StarMark
            value={selectedFile?.mark?.star}
            onChange={(v) => {
              fileMarkSet(selectedFile, 'star', v);
              return {};
            }}
          />
          <TrashMark
            value={selectedFile?.mark?.delete}
            onChange={(v) => {
              fileMarkSet(selectedFile, 'delete', v);
              return {};
            }}
          />
        </Space>
        <Space size={'lg'} className='text-sm'>
          <span> {selectedFile?.name} </span>
          <Space>
            <Button variant="secondary" size={'xs'} onClick={fileSelectPrevious}>
              <ChevronLeft size={16} strokeWidth={1} />
            </Button>
            <span>{selectedFileIndex}/{files.length}</span>
            <Button variant="secondary" size={'xs'}>
              <ChevronRight size={16} strokeWidth={1} onClick={fileSelectNext} />
            </Button>
          </Space>
        </Space>
        {/* <CheckboxGroup value={previewGroup?.tags || []} onChange={(tags: FileTag[]) => actions.setGroupTagChange(previewGroup!, tags)}>
          <Stack spacing={[5, 5]} direction={['column', 'row']}>
            <Checkbox value={FileTag.Del}><Box fontSize="small">标记删除</Box></Checkbox>
          </Stack>
        </CheckboxGroup> */}
      </div>
    </div>
  )
}