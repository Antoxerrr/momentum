import { Spinner } from "@heroui/react";

export default function LoadingSpinner() {
  const SPINNER_SIZE_CLASSES = 'w-16 h-16';
  const BORDER_CLS = 'border-4';

  return (
    <Spinner color="default" classNames={{
      wrapper: `${SPINNER_SIZE_CLASSES}`,
      circle1: `${SPINNER_SIZE_CLASSES} ${BORDER_CLS}`,
      circle2: `${SPINNER_SIZE_CLASSES} ${BORDER_CLS}`
    }}/>
  )
}