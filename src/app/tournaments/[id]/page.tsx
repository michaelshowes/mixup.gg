export default function TournamentSetupPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Tournament Page</h1>
      <p>Tournament ID: {params.id}</p>
    </div>
  );
}
