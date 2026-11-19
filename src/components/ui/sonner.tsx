import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-right"
      closeButton
      icons={{
        success: <CircleCheck size={17} />,
        error: <CircleAlert size={17} />,
        info: <Info size={17} />,
        close: <X size={14} />,
      }}
      toastOptions={{
        classNames: { toast: '!border-foreground/20 !bg-panel !text-foreground', description: '!text-muted' },
      }}
      {...props}
    />
  );
}
