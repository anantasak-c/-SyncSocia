
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing connection to Supabase...');
  
  // 1. Check profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (profilesError) {
    console.error('Error fetching from profiles table:', profilesError.message);
  } else {
    console.log('Successfully connected to profiles table.');
  }

  // 2. Check posts
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .limit(1);

  if (postsError) {
    console.error('Error fetching from posts table:', postsError.message);
  } else {
    console.log('Successfully connected to posts table.');
  }
}

testConnection();
