import { useEffect } from "react";
import "./App.css";
import { useStore } from '@/store';
import SelectDir from "./SelectDir";
import ImgPic from "./ImgPic";
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@/components/Theme"


const router = createHashRouter([
  {
    path: "/",
    element: <ImgPic />,
  },
  {
    path: "/help",
    element: <SelectDir />,
  },
]);

function App() {
  useEffect(() => {
    // 移除默认快捷键
    document.addEventListener("keydown", function (event) {
      event.preventDefault();
    });
  }, []);

  // const { workDir, fileGroups } = useStore();
  // let child = null;
  // if (!workDir) {
  //   child = <SelectDir />
  // } else if (fileGroups) {
  //   child = <ImgPic />
  // }

  // return child;

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )

}

export default App;
