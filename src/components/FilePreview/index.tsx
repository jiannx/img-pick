import { File } from "@/store";
import { useEffect, useRef } from "react";
import { readImageToUrl } from '@/utils';
import { useAsyncEffect, useInViewport, useSetState } from "ahooks";
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { Center } from "@chakra-ui/react";

async function read() {
  // await readImageToUrl('/Users/hao/a/DSCF1675.JPG');
  const assetUrl = convertFileSrc('/Users/hao/a/DSCF1675.JPG');
  console.log(assetUrl)
}
read();


export default function FilePreview({ file }: {
  file?: File
}) {

  const ref = useRef(null);
  const [inViewport] = useInViewport(ref);

  useAsyncEffect(async () => {
    console.log('useAsyncEffect');
    // if (inViewport && !state.url) {
    //   if (file.suffixs?.includes('JPG')) {
    //     const url = await readImageToUrl(`${file.dir}/${file.pureName}.JPG`);
    //     setState({
    //       url,
    //     });
    //   }
    // }
  }, [file, inViewport]);

  return (
    <Center ref={ref} style={{ height: '100%', width: '100%' }}>
      {inViewport && <img src={file?.url} alt="" style={{ maxHeight: '100%', maxWidth: '100%' }} />}
    </Center>
  )
}

