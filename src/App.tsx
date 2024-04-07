import { useEffect } from "react";
import "./App.css";
import { useStore } from '@/store';
import SelectDir from "./pages/SelectDir";
import ImgPic from "./pages/ImgPic";



function App() {

  useEffect(() => {
    // 移除默认快捷键
    document.addEventListener("keydown", function (event) {
      event.preventDefault();
    });
  }, []);

  const { workDir, fileGroups } = useStore();
  let child = null;
  if (!workDir) {
    child = <SelectDir />
  } else if (fileGroups) {
    child = <ImgPic />
  }

  return child;
}

export default App;
