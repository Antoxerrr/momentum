import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import {ToastProvider} from "@heroui/toast";
import store from "@/store/index.js";
import { Provider as ReduxProvider } from 'react-redux'


export function Providers({ children }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ReduxProvider store={store}>
        <ToastProvider/>
        {children}
      </ReduxProvider>
    </HeroUIProvider>
  );
}
