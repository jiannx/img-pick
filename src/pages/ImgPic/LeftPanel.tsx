import { useStore, FileTag } from '@/store';
import FilePreview from "@/components/FilePreview";
import { Icon } from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import { ask } from '@tauri-apps/api/dialog';
import { useKeyPress } from 'ahooks';
import { Button } from "@/components/ui/button"
import { ThemeTigger } from '@/components/Theme';
import { Space } from '@/components/Space';
import { Settings, CircleHelp, SunMedium, Plus } from "lucide-react"

export default function LeftPanel() {
  return (
    <div className='w-full h-full flex flex-col bg-background'>
      <div className='grow p-2'>
        <div className='flex items-center justify-between'>
          <div className='text-slate-500 text-sm'>{'folders'.toUpperCase()}</div>
          <Button variant="secondary" size={'xs'}>
            <Plus size={16} strokeWidth={1} />
          </Button>
        </div>
        <div>
          <div>目录1</div>
          <div>目录2</div>
          <div>目录3</div>
        </div>
      </div>
      <div className='h-8 flex justify-between items-center border-t px-1 border-border'>
        <div></div>
        <Space>
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