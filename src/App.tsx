import { useEffect, useState } from "react";
import "./App.css";
import { useStore } from '@/store';
import SelectDir from "./pages/SelectDir";
import ImgPic from "./pages/ImgPic";


function App() {
  const { workDir, files } = useStore();

  if (!workDir) {
    return <SelectDir />
  }
  if (files) {
    return <ImgPic />
  }

  return <div>异常</div>;
}

export default App;
