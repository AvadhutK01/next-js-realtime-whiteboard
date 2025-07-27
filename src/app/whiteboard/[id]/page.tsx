import Whiteboard from '@/components/Whiteboard';

export default async function WhiteboardPage({ params }: { params: { id: string } }) {
    params = await params;
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Whiteboard  boardId={params.id} />
    </div>
  );
}
