import { File } from "@/store";
import { useRef } from "react";
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { Center, Image } from "@chakra-ui/react";
import { useInViewport } from 'ahooks';
import { Space } from "../Space";
import { cn } from "@/lib/utils";

// async function read() {
//   // await readImageToUrl('/Users/hao/a/DSCF1675.JPG');
//   const assetUrl = convertFileSrc('/Users/hao/a/DSCF1675.JPG');
//   console.log(assetUrl)
// }
// read();


export default function FilePreview({ file }: {
  file?: File;
  showSuffixes?: boolean;
}) {
  const ref = useRef(null);
  const [inViewport] = useInViewport(ref);

  return (
    <div ref={ref} className="h-full relative cursor-pointer">
      {inViewport && <img src={file?.url} alt="" style={{ height: '100%', width: 'auto' }} />}
    </div>
  )
}

