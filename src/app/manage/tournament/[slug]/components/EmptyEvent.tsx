import Link from 'next/link';

import { Button } from '@/components/ui/button';

type Props = {
  slug: string;
};

export default function EmptyEvent({ slug }: Props) {
  return (
    <section
      className={
        'flex min-h-[160px] flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-white p-4'
      }
    >
      <p>No Events Yet</p>
      <p className={'text-sm text-gray-500'}>
        Get started by creating an event
      </p>
      <Button
        asChild
        className={'mt-4'}
      >
        <Link href={`/manage/tournament/${slug}/create-event`}>
          Create Event
        </Link>
      </Button>
    </section>
  );
}
