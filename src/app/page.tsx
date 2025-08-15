'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';

const BoardSkeleton = () => (
  <div className="p-4 border border-zinc-800 rounded-lg animate-pulse">
    <div className="h-5 bg-zinc-800 rounded mb-2 w-3/4"></div>
    <div className="h-4 bg-zinc-900 rounded w-1/2"></div>
  </div>
);

const AvatarSkeleton = () => (
  <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse border border-zinc-700" />
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const [boards, setBoards] = useState({ createdBoards: [], joinedBoards: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [navigatingToBoard, setNavigatingToBoard] = useState<string | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // FAB open state (mobile)
  const [fabOpen, setFabOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchBoards = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/boards');
      setBoards(res.data);
    } catch (err) {
      console.error('Failed to fetch boards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const createNewBoard = async () => {
    if (!newBoardName.trim()) {
      setError('Board name is required');
      return;
    }
    setError('');
    setIsCreating(true);
    try {
      const res = await axios.post('/api/boards', { name: newBoardName.trim() });
      setIsModalOpen(false);
      setNewBoardName('');
      setNavigatingToBoard(res.data.id);
      router.push(`/whiteboard/${res.data.id}`);
      // Optionally refetch boards after navigation
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create board');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinBoard = async () => {
    if (!joinCode.trim()) {
      setJoinError('Board code is required');
      return;
    }
    setJoinError('');
    setIsJoining(true);
    try {
      const res = await axios.patch('/api/boards', { boardId: joinCode.trim() });
      setIsJoinModalOpen(false);
      setJoinCode('');
      // Refetch boards and navigate
      await fetchBoards();
      setNavigatingToBoard(res.data.id);
      router.push(`/whiteboard/${res.data.id}`);
    } catch (err: any) {
      setJoinError(err.response?.data?.error || 'Join failed');
    } finally {
      setIsJoining(false);
    }
  };

  const handleBoardClick = (boardId: string) => {
    setNavigatingToBoard(boardId);
    router.push(`/whiteboard/${boardId}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCreating) {
      createNewBoard();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewBoardName('');
    setError('');
  };

  const closeJoinModal = () => {
    setIsJoinModalOpen(false);
    setJoinCode('');
    setJoinError('');
  };

  const renderBoardSection = (title: string, boards: any[], emptyMessage: string) => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-2">
        {title}
      </h2>
      <div className="space-y-3 min-h-[120px]">
        {isLoading ? (
          <>
            <BoardSkeleton />
            <BoardSkeleton />
            <BoardSkeleton />
          </>
        ) : boards.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-center">
            <p className="text-zinc-500 text-sm">{emptyMessage}</p>
          </div>
        ) : (
          boards.map((board: any) => (
            <div
              key={board._id}
              onClick={() => handleBoardClick(board._id)}
              className="group relative p-4 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer transition-all duration-200 hover:shadow-lg shadow-black/20"
            >
              {navigatingToBoard === board._id && (
                <div className="absolute inset-0 bg-zinc-900 bg-opacity-90 flex items-center justify-center rounded-lg">
                  <LoadingSpinner />
                </div>
              )}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                    {board.name}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    {title === 'Your Boards'
                      ? `Created ${new Date(board.createdAt).toLocaleDateString()}`
                      : `Created by ${board.createdBy}`}
                  </p>
                </div>
                <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-5 h-5 text-zinc-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-between mb-8 relative">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Realtime Whiteboard</h1>
            <p className="text-zinc-400 text-sm mt-1 hidden sm:block">
              Create and collaborate on whiteboards in real-time
            </p>
          </div>

          {/* Desktop Controls */}
          <div className="hidden sm:flex items-center gap-4 relative z-50">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-blue-500 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-xl hover:shadow-2xl shadow-blue-600/20 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              New Board
            </button>

            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-xl hover:shadow-2xl shadow-green-600/20 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Join Room
            </button>

            <div className="relative w-10 h-10" ref={dropdownRef}>
              {session?.user ? (
                <>
                  <img
                    src={session.user.image ?? '/default-avatar.png'}
                    alt="User Avatar"
                    className={`absolute inset-0 w-10 h-10 rounded-full border border-zinc-700 cursor-pointer hover:ring-2 hover:ring-blue-500 transition ${avatarLoading ? 'opacity-0' : 'opacity-100'}`}
                    onClick={() => setDropdownOpen(v => !v)}
                    onLoad={() => setAvatarLoading(false)}
                    onError={() => setAvatarLoading(false)}
                  />
                  {avatarLoading && <AvatarSkeleton />}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl p-4 z-50 animate-[fadeInSlide_0.2s_ease-out]">
                      <p className="text-white font-medium truncate">{session.user.name}</p>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="mt-3 w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <AvatarSkeleton />
              )}
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-950 rounded-xl shadow-2xl border border-zinc-800 p-6">
            {renderBoardSection(
              'Your Boards',
              boards.createdBoards,
              'No boards created yet. Create your first board to get started!'
            )}
          </div>

          <div className="bg-zinc-950 rounded-xl shadow-2xl border border-zinc-800 p-6">
            {renderBoardSection(
              'Joined Boards',
              boards.joinedBoards,
              'No boards joined yet. Ask someone to share a board with you!'
            )}
          </div>
        </section>

        {/* Mobile FAB with icons only */}
        <div className="sm:hidden fixed bottom-6 right-6 flex flex-col items-center gap-3 z-50">
          {fabOpen && (
            <>
              <button
                onClick={() => {
                  setIsJoinModalOpen(true);
                  setFabOpen(false);
                }}
                className="w-12 h-12 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setFabOpen(false);
                }}
                className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </>
          )}

          {/* Main FAB */}
          <button
            onClick={() => setFabOpen((prev) => !prev)}
            className="w-14 h-14 rounded-full bg-pink-600 text-white shadow-xl hover:bg-pink-700 flex items-center justify-center transition-colors"
          >
            {fabOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Avatar */}
        <div className="sm:hidden fixed top-6 right-6 z-50" ref={dropdownRef}>
          {session?.user ? (
            <>
              <img
                src={session.user.image ?? '/default-avatar.png'}
                alt="User Avatar"
                className={`w-10 h-10 rounded-full border border-zinc-700 cursor-pointer hover:ring-2 hover:ring-blue-500 transition ${avatarLoading ? 'opacity-0' : 'opacity-100'}`}
                onClick={() => setDropdownOpen(v => !v)}
                onLoad={() => setAvatarLoading(false)}
                onError={() => setAvatarLoading(false)}
              />
              {avatarLoading && <AvatarSkeleton />}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl p-4 animate-[fadeInSlide_0.2s_ease-out]">
                  <p className="text-white font-medium truncate">{session.user.name}</p>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="mt-3 w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <AvatarSkeleton />
          )}
        </div>

        {/* Join Room Modal */}
        {isJoinModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="bg-zinc-950 rounded-xl shadow-2xl border border-zinc-800 w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Join Room</h2>
                  <button onClick={closeJoinModal} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="joinCode" className="block text-sm font-medium text-zinc-300 mb-2">
                      Enter Room Code
                    </label>
                    <input
                      id="joinCode"
                      type="text"
                      value={joinCode}
                      onChange={(e) => {
                        setJoinCode(e.target.value);
                        if (joinError) setJoinError('');
                      }}
                      placeholder="Paste the code here"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors placeholder-zinc-500"
                      disabled={isJoining}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isJoining) {
                          handleJoinBoard();
                        }
                      }}
                    />
                  </div>
                  {joinError && (
                    <div className="bg-red-950 bg-opacity-50 border border-red-800 rounded-lg p-3">
                      <p className="text-red-300 text-sm">{joinError}</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
                  <button
                    onClick={closeJoinModal}
                    disabled={isJoining}
                    className="px-4 py-2.5 text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleJoinBoard}
                    disabled={isJoining || !joinCode.trim()}
                    className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-500 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
                  >
                    {isJoining ? (
                      <>
                        <LoadingSpinner />
                        Joining...
                      </>
                    ) : (
                      'Join Room'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Board Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="bg-zinc-950 rounded-xl shadow-2xl border border-zinc-800 w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Create New Board</h2>
                  <button
                    onClick={closeModal}
                    className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="boardName" className="block text-sm font-medium text-zinc-300 mb-2">
                      Board Name
                    </label>
                    <input
                      id="boardName"
                      type="text"
                      value={newBoardName}
                      onChange={(e) => {
                        setNewBoardName(e.target.value);
                        if (error) setError('');
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter a unique board name"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-zinc-500"
                      disabled={isCreating}
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="bg-red-950 bg-opacity-50 border border-red-800 rounded-lg p-3">
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
                  <button
                    onClick={closeModal}
                    disabled={isCreating}
                    className="px-4 py-2.5 text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-900 hover:text-white disabled:bg-zinc-900 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createNewBoard}
                    disabled={isCreating || !newBoardName.trim()}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-500 disabled:cursor-not-allowed transition-colors font-medium min-w-[100px] cursor-pointer"
                  >
                    {isCreating ? (
                      <>
                        <LoadingSpinner />
                        Creating...
                      </>
                    ) : (
                      'Create Board'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInSlide {
          0% {
            opacity: 0;
            transform: translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
