'use client';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export const useCopyToClipboard = () => {
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast(
      <div className={'flex w-full items-center gap-2'}>
        <Copy size={12} />
        <span className={'font-semibold'}>Copied to clipboard</span>
      </div>,
      {
        className: '!bg-yellow !border-transparent'
      }
    );
  };

  type CopyButtonProps = {
    text: string;
    children: React.ReactNode;
    className?: string;
  };

  return {
    CopyButton: ({ text, children, className }: CopyButtonProps) => (
      <button
        className={className}
        onClick={() => copy(text)}
      >
        {children}
      </button>
    ),
    copy
  };
};
