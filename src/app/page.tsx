'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const createNewBoard = async () => {
    const res = await fetch('/api/board', { method: 'POST' });
    const { id } = await res.json();
    router.push(`/whiteboard/${id}`);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Realtime Whiteboard</h1>
      <button
        onClick={createNewBoard}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl"
      >
        Create New Board
      </button>
    </main>
  );
}
