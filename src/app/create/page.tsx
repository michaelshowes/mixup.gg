import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function CreatePage() {
  return (
    <div>
      <Button asChild>
        <Link href='/create/tournament'>Create a new Tournament</Link>
      </Button>
    </div>
  );
}
