import { HeroUIProvider } from "@heroui/react";
import { useHref, useNavigate } from "react-router-dom";
import {ToastProvider} from "@heroui/react";


export function Providers({ children }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ToastProvider/>
      {children}
    </HeroUIProvider>
  );
}
