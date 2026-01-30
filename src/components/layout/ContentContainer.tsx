import { cn } from '@/lib/utils';

export default function ContentContainer({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-[1600px] px-4', className)}>
      {children}
    </div>
  );
}
