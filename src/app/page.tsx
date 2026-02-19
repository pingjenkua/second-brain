import Link from 'next/link';

async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? '' : (process.env.NEXT_PUBLIC_API_URL || '');
  const apiUrl = baseUrl || '';
  
  const [memoriesRes, documentsRes, tasksRes] = await Promise.all([
    fetch(`${apiUrl}/api/memories`, { cache: 'no-store' }),
    fetch(`${apiUrl}/api/documents`, { cache: 'no-store' }),
    fetch(`${apiUrl}/api/tasks`, { cache: 'no-store' }),
  ]);

  const memories = (await memoriesRes.json()) || [];
  const documents = (await documentsRes.json()) || [];
  const tasks = (await tasksRes.json()) || [];

  return { memories, documents, tasks };
}

export default async function Dashboard() {
  const { memories, documents, tasks } = await getData();

  const recentMemories = (memories || []).slice(-3).reverse();
  const pendingTasks = (tasks || []).filter((t: any) => t.status !== 'completed').slice(0, 5);
  const completedTasks = (tasks || []).filter((t: any) => t.status === 'completed').length;
  const totalTasks = (tasks || []).length;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <div className="text-4xl font-bold text-white">{(memories || []).length}</div>
          <div className="text-zinc-400 mt-2">💭 Memories</div>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <div className="text-4xl font-bold text-white">{(documents || []).length}</div>
          <div className="text-zinc-400 mt-2">📄 Documents</div>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <div className="text-4xl font-bold text-white">{completedTasks}/{totalTasks}</div>
          <div className="text-zinc-400 mt-2">✅ Tasks Done</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Recent Memories */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Memories</h2>
            <Link href="/memories" className="text-zinc-400 hover:text-white text-sm">View all →</Link>
          </div>
          {recentMemories.length === 0 ? (
            <p className="text-zinc-500">No memories yet. Start capturing!</p>
          ) : (
            <div className="space-y-3">
              {recentMemories.map((m: any) => (
                <div key={m.id} className="p-3 bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{m.mood || '💭'}</span>
                    <span className="font-medium">{m.title}</span>
                  </div>
                  <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{m.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Tasks */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pending Tasks</h2>
            <Link href="/tasks" className="text-zinc-400 hover:text-white text-sm">View all →</Link>
          </div>
          {pendingTasks.length === 0 ? (
            <p className="text-zinc-500">All caught up! 🎉</p>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((t: any) => (
                <div key={t.id} className="p-3 bg-zinc-800/50 rounded-lg flex items-center justify-between">
                  <div>
                    <span className={`font-medium ${
                      t.priority === 'high' ? 'text-red-400' :
                      t.priority === 'medium' ? 'text-yellow-400' : 'text-zinc-400'
                    }`}>[{t.priority?.toUpperCase()}]</span>
                    <span className="ml-2">{t.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
