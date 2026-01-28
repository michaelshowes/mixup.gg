import { CreateTournamentForm } from '@/components/forms/CreateTournamentForm';

export default function CreateTournamentPage() {
  return (
    <div className='mx-auto max-w-2xl py-8'>
      <h1 className='mb-8 text-2xl font-bold'>Create Tournament</h1>
      <CreateTournamentForm />
    </div>
  );
}
