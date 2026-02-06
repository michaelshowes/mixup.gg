import { Users } from 'lucide-react';

export default function SeedingEmptyState() {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <Users className='mb-4 size-12 text-gray-400' />
      <h3 className='text-lg font-semibold text-gray-900'>No entrants yet</h3>
      <p className='mt-1 text-sm text-gray-500'>
        Entrants will appear here once they register for the event.
      </p>
    </div>
  );
}
