import Link from 'next/link';

import { manageTournamentRoutes } from '@/routes/manageTournamentRoutes';

import { Button } from './ui/button';

export default function TournamentAdminSidebar({ slug }: { slug: string }) {
  return (
    <div className={'border border-gray-200 bg-white p-4'}>
      <ul>
        {manageTournamentRoutes.map((route) => (
          <li key={route.path}>
            <Button
              variant='ghost'
              asChild
            >
              <Link
                href={`/manage/tournament/${slug}${route.path}`}
                className='flex w-full items-center justify-start gap-2 font-semibold'
              >
                {route.icon}
                <span>{route.label}</span>
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
