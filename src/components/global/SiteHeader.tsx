import Link from 'next/link';

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import { HomeIcon, PlusIcon } from 'lucide-react';

import NotificationBell from '../shared/NotificationBell';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function SiteHeader() {
  return (
    <header className='flex items-center justify-between p-4'>
      <div className={'flex items-center gap-4'}>
        <Link
          href='/'
          className='text-xl font-bold'
        >
          Mixup.gg
        </Link>
        <div>
          <Button
            variant='ghost'
            asChild
          >
            <Link
              href='/dashboard'
              className={'flex items-center gap-2'}
            >
              <HomeIcon size={18} />
              Dashboard
            </Link>
          </Button>
          <Button
            variant='ghost'
            asChild
          >
            <Link
              href='/create'
              className={'flex items-center gap-2'}
            >
              <PlusIcon size={18} />
              Create
            </Link>
          </Button>
        </div>
      </div>
      <div className={'w-full max-w-[600px]'}>
        <Input
          type='search'
          placeholder='Search'
          className={'w-full'}
        />
      </div>
      <div className='flex items-center gap-6'>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <NotificationBell />
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
