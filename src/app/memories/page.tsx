'use client';

import { useState, useEffect } from 'react';

interface Memory {
  id: string;
  title: string;
  content: string;
  tags: string[];
  mood: string;
  createdAt: string;
  updatedAt: string;
}

const moods = ['💭', '😊', '🤔', '💡', '🎯', '🔥', '⭐', '🌟'];

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', tags: '', mood: '💭' });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    const res = await fetch('/api/memories');
    const data = await res.json();
    setMemories(data.reverse());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    await fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
    });

    setForm({ title: '', content: '', tags: '', mood: '💭' });
    setShowForm(false);
    setEditingId(null);
    fetchMemories();
  };

  const handleEdit = (m: Memory) => {
    setForm({ title: m.title, content: m.content, tags: m.tags.join(', '), mood: m.mood });
    setEditingId(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this memory?')) {
      await fetch(`/api/memories?id=${id}`, { method: 'DELETE' });
      fetchMemories();
    }
  };

  const filteredMemories = memories.filter(m =>
    m.title.toLowerCase().includes(filter.toLowerCase()) ||
    m.content.toLowerCase().includes(filter.toLowerCase()) ||
    m.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">💭 Memories</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', content: '', tags: '', mood: '💭' }); }}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Memory'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
          <div>
            <label className="block text-zinc-400 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1">Content</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white h-32"
              required
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
              placeholder="work, ideas, personal"
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1">Mood</label>
            <div className="flex gap-2">
              {moods.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setForm({ ...form, mood: m })}
                  className={`text-2xl p-2 rounded-lg transition-colors ${form.mood === m ? 'bg-zinc-700' : 'hover:bg-zinc-800'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="bg-white text-black px-6 py-2 rounded-lg font-medium">
            {editingId ? 'Update' : 'Save'} Memory
          </button>
        </form>
      )}

      <input
        type="text"
        placeholder="Search memories..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white"
      />

      <div className="grid gap-4">
        {filteredMemories.map(m => (
          <div key={m.id} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{m.mood}</span>
                <div>
                  <h3 className="font-semibold text-lg">{m.title}</h3>
                  <p className="text-zinc-400 text-sm">{new Date(m.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(m)} className="text-zinc-400 hover:text-white">Edit</button>
                <button onClick={() => handleDelete(m.id)} className="text-zinc-400 hover:text-red-400">Delete</button>
              </div>
            </div>
            <p className="mt-3 text-zinc-300">{m.content}</p>
            {m.tags.length > 0 && (
              <div className="mt-3 flex gap-2">
                {m.tags.map(t => (
                  <span key={t} className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-sm">#{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
