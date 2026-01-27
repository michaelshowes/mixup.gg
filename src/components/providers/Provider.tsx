import { ClerkProvider } from '@clerk/nextjs';

import { ConvexClientProvider } from './ConvexClientProvider';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <ClerkProvider>{children}</ClerkProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
