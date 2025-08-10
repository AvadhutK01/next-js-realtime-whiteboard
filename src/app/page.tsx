'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const router = useRouter();
  const [boards, setBoards] = useState({ createdBoards: [], joinedBoards: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('/api/boards')
      .then((res) => setBoards(res.data))
      .catch((err) => console.error(err));
  }, []);

  const createNewBoard = async () => {
    setError('');
    try {
      const res = await axios.post('/api/boards', { name: newBoardName });
      setIsModalOpen(false);
      router.push(`/whiteboard/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Realtime Whiteboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Board
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Your Boards</h2>
          <div className="space-y-3">
            {boards.createdBoards.length === 0 && (
              <p className="text-gray-500">No boards created yet.</p>
            )}
            {boards.createdBoards.map((board: any) => (
              <div
                key={board._id}
                onClick={() => router.push(`/whiteboard/${board._id}`)}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <h3 className="font-medium">{board.name}</h3>
                <p className="text-sm text-gray-500">
                  Created {new Date(board.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Joined Boards</h2>
          <div className="space-y-3">
            {boards.joinedBoards.length === 0 && (
              <p className="text-gray-500">No boards joined yet.</p>
            )}
            {boards.joinedBoards.map((board: any) => (
              <div
                key={board._id}
                onClick={() => router.push(`/whiteboard/${board._id}`)}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <h3 className="font-medium">{board.name}</h3>
                <p className="text-sm text-gray-500">
                  Created by {board.createdBy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Create New Board</h2>
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Enter unique board name"
              className="border w-full p-2 rounded mb-3"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={createNewBoard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
