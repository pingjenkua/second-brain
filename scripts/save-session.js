/**
 * Script to save session summaries to Supabase
 * Usage: node scripts/save-session.js "<title>" "<content>" "<tags>"
 */
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://utuijwpojmtzpflenqff.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable__kwqNczQCXtBXz9j4wnF2g_GL59Fid5';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function saveSession(title, content, tags = []) {
  const session = {
    id: `session-${Date.now()}`,
    title,
    content,
    tags,
    mood: 'chat',
    createdat: new Date().toISOString(),
    updatedat: new Date().toISOString()
  };

  const { error } = await supabase.from('memories').upsert(session, { onConflict: 'id' });
  
  if (error) {
    console.error('Error saving session:', error.message);
    process.exit(1);
  }
  
  console.log('Session saved! 🎉');
  console.log('ID:', session.id);
}

// CLI mode
if (require.main === module) {
  const title = process.argv[2] || 'Session';
  const content = process.argv[3] || '';
  const tags = process.argv[4] ? process.argv[4].split(',') : [];
  
  saveSession(title, content, tags);
}

module.exports = { saveSession };
