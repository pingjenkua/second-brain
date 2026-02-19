import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

const DATA_DIR = path.join(process.cwd(), 'data');

export interface Memory {
  id: string;
  title: string;
  content: string;
  tags: string[];
  mood: string;
  createdat: string;
  updatedat: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  createdat: string;
  updatedat: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  duedate?: string;
  createdat: string;
  updatedat: string;
}

// Use Supabase only if client is initialized (env vars present)
const USE_SUPABASE = !!supabase;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSONLocal<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    return defaultValue;
  }
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  } catch {
    return defaultValue;
  }
}

function writeJSONLocal<T>(filename: string, data: T): void {
  ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

const MEMORIES_TABLE = 'memories';
const DOCUMENTS_TABLE = 'documents';
const TASKS_TABLE = 'tasks';

// Memories
export async function getMemories(): Promise<Memory[]> {
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase.from(MEMORIES_TABLE).select('*').order('createdat', { ascending: false });
    if (error) {
      console.error('Supabase error fetching memories:', error);
      return readJSONLocal<Memory[]>('memories.json', []);
    }
    return data || [];
  }
  return readJSONLocal<Memory[]>('memories.json', []);
}

export async function saveMemory(memory: Memory): Promise<void> {
  if (USE_SUPABASE && supabase) {
    const { error } = await supabase.from(MEMORIES_TABLE).upsert(memory, { onConflict: 'id' });
    if (error) {
      console.error('Supabase error saving memory:', error);
    }
    return;
  }
  const memories = await getMemories();
  const index = memories.findIndex(m => m.id === memory.id);
  if (index >= 0) {
    memories[index] = memory;
  } else {
    memories.push(memory);
  }
  writeJSONLocal('memories.json', memories);
}

export async function deleteMemory(id: string): Promise<void> {
  if (USE_SUPABASE && supabase) {
    const { error } = await supabase.from(MEMORIES_TABLE).delete().eq('id', id);
    if (error) {
      console.error('Supabase error deleting memory:', error);
    }
    return;
  }
  const memories = (await getMemories()).filter(m => m.id !== id);
  writeJSONLocal('memories.json', memories);
}

// Documents
export async function getDocuments(): Promise<Document[]> {
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase.from(DOCUMENTS_TABLE).select('*').order('createdat', { ascending: false });
    if (error) {
      console.error('Supabase error fetching documents:', error);
      return readJSONLocal<Document[]>('documents.json', []);
    }
    return data || [];
  }
  return readJSONLocal<Document[]>('documents.json', []);
}

export async function saveDocument(doc: Document): Promise<void> {
  if (USE_SUPABASE && supabase) {
    const { error } = await supabase.from(DOCUMENTS_TABLE).upsert(doc, { onConflict: 'id' });
    if (error) {
      console.error('Supabase error saving document:', error);
    }
    return;
  }
  const docs = await getDocuments();
  const index = docs.findIndex(d => d.id === doc.id);
  if (index >= 0) {
    docs[index] = doc;
  } else {
    docs.push(doc);
  }
  writeJSONLocal('documents.json', docs);
}

export async function deleteDocument(id: string): Promise<void> {
  if (USE_SUPABASE && supabase) {
    const { error } = await supabase.from(DOCUMENTS_TABLE).delete().eq('id', id);
    if (error) {
      console.error('Supabase error deleting document:', error);
    }
    return;
  }
  const docs = (await getDocuments()).filter(d => d.id !== id);
  writeJSONLocal('documents.json', docs);
}

// Tasks
export async function getTasks(): Promise<Task[]> {
  if (USE_SUPABASE && supabase) {
    const { data, error } = await supabase.from(TASKS_TABLE).select('*').order('createdat', { ascending: false });
    if (error) {
      console.error('Supabase error fetching tasks:', error);
      return readJSONLocal<Task[]>('tasks.json', []);
    }
    return data || [];
  }
  return readJSONLocal<Task[]>('tasks.json', []);
}

export async function saveTask(task: Task): Promise<void> {
  if (USE_SUPABASE && supabase) {
    const { error } = await supabase.from(TASKS_TABLE).upsert(task, { onConflict: 'id' });
    if (error) {
      console.error('Supabase error saving task:', error);
    }
    return;
  }
  const tasks = await getTasks();
  const index = tasks.findIndex(t => t.id === task.id);
  if (index >= 0) {
    tasks[index] = task;
  } else {
    tasks.push(task);
  }
  writeJSONLocal('tasks.json', tasks);
}

export async function deleteTask(id: string): Promise<void> {
  if (USE_SUPABASE && supabase) {
    const { error } = await supabase.from(TASKS_TABLE).delete().eq('id', id);
    if (error) {
      console.error('Supabase error deleting task:', error);
    }
    return;
  }
  const tasks = (await getTasks()).filter(t => t.id !== id);
  writeJSONLocal('tasks.json', tasks);
}

export { supabase };
