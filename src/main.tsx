import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import {
  ChakraProvider,
} from '@chakra-ui/react'
import { theme } from './theme';

// React.StrictMode 会导致刷新两次
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
);
