import Main from "./Main";
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@/components/Theme";
import Setting from './Helper';
import useKeyboard from "@/hooks/useKeyboard";

const router = createHashRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/setting",
    element: <Setting />,
  },
]);

function App() {
  useKeyboard();

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App;
