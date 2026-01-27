import XLogo from '@/assets/svg/XLogo';

export default async function Home() {
  return (
    <main className={'flex h-full items-center justify-center'}>
      <div className='flex flex-col items-center justify-center'>
        <XLogo
          stroke
          arrowColor={'black'}
          size={24}
          className='mb-4'
        />
        <h1 className='text-3xl font-semibold'>Mixup.gg</h1>
        <p className={'text-sm text-gray-600 uppercase'}>Coming Soon..ish</p>
      </div>
    </main>
  );
}
