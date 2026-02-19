'use client';

import { useState, useEffect } from 'react';

interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const categories = ['Notes', 'Ideas', 'Journal', 'Work', 'Personal', 'Archive'];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'Notes' });
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const res = await fetch('/api/documents');
    const data = await res.json();
    setDocuments(data.reverse());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    });

    setForm({ title: '', content: '', category: 'Notes' });
    setShowForm(false);
    setEditingId(null);
    fetchDocuments();
  };

  const handleEdit = (d: Document) => {
    setForm({ title: d.title, content: d.content, category: d.category });
    setEditingId(d.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this document?')) {
      await fetch(`/api/documents?id=${id}`, { method: 'DELETE' });
      fetchDocuments();
    }
  };

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(filter.toLowerCase()) ||
      d.content.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = !categoryFilter || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📄 Documents</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', content: '', category: 'Notes' }); }}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Document'}
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
            <label className="block text-zinc-400 mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 mb-1">Content</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white h-64 font-mono"
              required
            />
          </div>
          <button type="submit" className="bg-white text-black px-6 py-2 rounded-lg font-medium">
            {editingId ? 'Update' : 'Save'} Document
          </button>
        </form>
      )}

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search documents..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid gap-4">
        {filteredDocs.map(d => (
          <div key={d.id} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{d.title}</h3>
                  <span className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-sm">{d.category}</span>
                </div>
                <p className="text-zinc-400 text-sm">{new Date(d.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(d)} className="text-zinc-400 hover:text-white">Edit</button>
                <button onClick={() => handleDelete(d.id)} className="text-zinc-400 hover:text-red-400">Delete</button>
              </div>
            </div>
            <pre className="mt-3 text-zinc-300 whitespace-pre-wrap font-mono text-sm">{d.content}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
