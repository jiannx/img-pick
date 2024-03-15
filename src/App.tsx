import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { open } from "@tauri-apps/api/dialog"
import { readDir, BaseDirectory, readBinaryFile } from '@tauri-apps/api/fs';
import { useSetState, useAsyncEffect } from 'ahooks';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { useStore } from '@/store';
import SelectDir from "./pages/SelectDir";
import ImgPic from "./pages/ImgPic";


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useSetState({
    testUrl: '',
  });

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  async function readImageToUrl(imgPath: string) {
    const binaryData = await readBinaryFile(imgPath)
    // let binary_data_arr = new Uint8Array(binaryData);
    // console.log('binary_data_arr', binaryData, binary_data_arr);
    let p = new Blob([binaryData], { type: 'image/png' });
    return URL.createObjectURL(p);
  }

  const onSelectDir = async () => {
    let dir = await open({ multiple: false, directory: true });
    console.log('dir', dir)
    const entries = await readDir(dir as string, { recursive: true });

    console.log('files', entries)




    // files.forEach(filePath => {
    //   const url = convertFileSrc(filePath)
    // })
  }

  useAsyncEffect(async () => {
    const url = await readImageToUrl('/Users/hao/a/DSCF1675.JPG');
    console.log('url', url)
    setState({
      testUrl: url,
    });
  }, []);

  const { workDir, files } = useStore();
  if (!workDir) {
    return <SelectDir />
  }
  if (files) {
    return <ImgPic />
  }

  return (
    <div className="container">
      <button onClick={onSelectDir}>选择目录</button>
      <img src={state.testUrl} alt="" />


      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
