import { useStore, FileTag } from '@/store';
import FilePreview from "@/components/FilePreview";
import { Icon } from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import { ask } from '@tauri-apps/api/dialog';
import { useKeyPress } from 'ahooks';
import { Button } from "@/components/ui/button"
import { ThemeTigger } from '@/components/Theme';
import { Space } from '@/components/Space';
import { Settings, CircleHelp, X, Plus } from "lucide-react";
import { cva } from "class-variance-authority"
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function LeftPanel() {
  const { dirs, dirAdd, dirRemove, dirSelect } = useStore();
  console.log('dirs', dirs);

  const onDirRemove = () => {
  }
  const dirClass = 'group w-full text-sm py-1 px-4 rounded flex items-center justify-between cursor-pointer bg-gray';
  const dirClassActive = 'bg-slate-700 text-white'

  return (
    <div className='w-full h-full flex flex-col bg-light-gray'>
      <div className='grow p-2'>
        <div className='flex items-center justify-between'>
          <div className='text-slate-500 text-xs'>{'folders'.toUpperCase()}</div>
          <Button variant="secondary" size={'xs'} onClick={dirAdd}>
            <Plus size={16} strokeWidth={1} />
          </Button>
        </div>
        <Space className='w-full my-2' direction={'col'} size={'sm'}>
          {dirs.map(dir =>
            <div className={cn(dirClass, { [dirClassActive]: dir.selected })} key={dir.path} onClick={() => dirSelect(dir)}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>{dir.name}</TooltipTrigger>
                  <TooltipContent>
                    <p>{dir.path}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <X
                className='w-4 h-4 invisible group-hover:visible'
                onClick={() => {
                  dirRemove(dir);
                }}
              />
            </div>
          )}
        </Space>
      </div>
      <div className='h-8 flex justify-between items-center border-t px-2 border-border'>
        <div></div>
        <Space size={'sm'}>
          <ThemeTigger />
          <Button variant="ghost" size={'xs'}>
            <CircleHelp size={16} strokeWidth={1} />
          </Button>
          <Button variant="ghost" size={'xs'}>
            <Settings size={16} strokeWidth={1} />
          </Button>
          </Space>
      </div>
    </div>
  )
}