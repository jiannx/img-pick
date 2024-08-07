import { useStore } from '@/hooks';
import { Button } from "@/components/ui/button"
import { ThemeTigger } from '@/components/Theme';
import { Space } from '@/components/Space';
import { Settings, CircleHelp, X, Plus, RefreshCw } from "lucide-react";
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useActions } from '@/hooks';
import { FileTag } from '@/types';

export default function LeftPanel() {
  const { dirs } = useStore();
  const { dirAdd, dirRemove, dirSelect, dirRefresh } = useActions();

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
              <Space>
                <RefreshCw
                  className='w-4 h-4 invisible group-hover:visible'
                  onClick={(e) => {
                    e.stopPropagation();
                    dirRefresh(dir);
                  }}
                />
                <X
                  className='w-4 h-4 invisible group-hover:visible'
                  onClick={() => {
                    dirRemove(dir);
                  }}
                />
              </Space>

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