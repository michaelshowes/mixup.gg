import Image from 'next/image';

import { titleCase } from '@/helpers/titleCase';

export default function EventCard({ event }: any) {
  return (
    <div
      className={'h-full overflow-hidden border border-gray-200 py-0 shadow-sm'}
    >
      <div className={'relative -mx-4 h-40'}>
        <Image
          src={event.image}
          alt={event.name}
          fill
          className={'object-cover'}
        />
      </div>
      <div className={'p-4'}>
        <h3 className={'text-lg font-bold'}>{titleCase(event.name)}</h3>
        <p className={'text-sm text-gray-500'}>Card Description</p>
        <p className={'text-sm text-gray-500'}>Card Content</p>
      </div>
    </div>
  );
}
