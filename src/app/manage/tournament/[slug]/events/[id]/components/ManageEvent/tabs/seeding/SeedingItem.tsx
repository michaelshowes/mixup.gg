'use client';

import Image from 'next/image';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import { cn } from '@/lib/utils';

type Props = {
  id: string;
  seed: number;
  gamertag: string;
  user: {
    fullName: string;
    imageUrl?: string;
  } | null;
  disabled?: boolean;
};

export default function SeedingItem({ id, seed, gamertag, user, disabled }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 border border-gray-200 bg-white p-3',
        !disabled && 'cursor-grab touch-none active:cursor-grabbing',
        isDragging && 'z-50 shadow-lg'
      )}
      {...attributes}
      {...(disabled ? {} : listeners)}
    >
      <GripVertical className={cn('size-5', disabled ? 'text-gray-200' : 'text-gray-400')} />

      <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white'>
        {seed}
      </div>

      {user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt={user.fullName}
          width={32}
          height={32}
          className='size-8 rounded-full object-cover'
        />
      )}

      <div className='min-w-0 flex-1'>
        <p className='truncate font-medium text-gray-900'>{gamertag}</p>
      </div>

      <span
        className={cn(
          'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
          'bg-gray-100 text-gray-600'
        )}
      >
        Not checked in
      </span>
    </div>
  );
}
