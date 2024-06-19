import { File } from "@/store";
import { useRef } from "react";
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { Center, Image } from "@chakra-ui/react";

async function read() {
  // await readImageToUrl('/Users/hao/a/DSCF1675.JPG');
  const assetUrl = convertFileSrc('/Users/hao/a/DSCF1675.JPG');
  console.log(assetUrl)
}
read();


export default function FilePreview({ file }: {
  file?: File;
  [key: string]: any;
}) {
  const ref = useRef(null);
  // const [inViewport] = useInViewport(ref);
  const inViewport = true;

  return (
    <div ref={ref} style={{ height: '100%' }}>
      {inViewport && <img src={file?.url} alt="" style={{ height: '100%', width: 'auto'}} />}
    </div>
  )
}

