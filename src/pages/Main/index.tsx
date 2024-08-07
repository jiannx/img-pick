import _ from 'lodash';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import LeftPanel from './LeftPanel';
import Viewer from './Viewer';
import Bottom from './Bottom';
import { useStore } from '@/hooks';

export default function () {

  return (
    <ResizablePanelGroup direction="horizontal">
      {/* 左侧面板 */}
      <ResizablePanel defaultSize={20}>
        <LeftPanel />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
            {/* 中间显示区域 */}
            <Viewer></Viewer>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={25}>
            {/* 底部预览区 */}
            <Bottom />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>

    </ResizablePanelGroup>
  )
}