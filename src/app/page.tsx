import { faker } from '@faker-js/faker';

import Hero from '@/components/Hero';
import HomeEventList from '@/components/HomeEventList';

export default async function Home() {
  faker.seed(123);

  // create array of 100 random names
  const events = Array.from({ length: 10 }, () => {
    return {
      id: faker.string.uuid(),
      name: faker.lorem.words({
        min: 1,
        max: 5
      }),
      image: faker.image.url()
    };
  });

  return (
    <main className={'space-y-8'}>
      <Hero />
      <div className={'px-4'}>
        <div className={'mx-auto max-w-[1600px]'}>
          <HomeEventList events={events} />
        </div>
      </div>
    </main>
  );
}
