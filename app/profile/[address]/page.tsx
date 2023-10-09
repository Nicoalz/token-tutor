export default function Profile({ params }: { params: { address: string } }) {
  return (
    <main className="mx-32 my-10 p-10 bg-[#181c2a] rounded-xl shadow-sm">
      {params.address}
    </main>
  );
}
