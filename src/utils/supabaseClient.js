import { createClient } from '@supabase/supabase-js';

// Supabaseの接続情報
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://jyvwoxzuqldqrndewxny.supabase.co';
console.log('Supabase URL:', supabaseUrl);

// 現在のパスが管理ダッシュボードかどうかを確認
const currentPath = window.location.pathname;
const currentHash = window.location.hash;

// パスまたはハッシュに '/admin' が含まれているか確認
const isAdminDashboard = currentPath.includes('/admin') || currentHash.includes('/admin');

console.log('現在のパス:', currentPath);
console.log('現在のハッシュ:', currentHash);
console.log('管理ダッシュボードかどうか:', isAdminDashboard);

// 管理ダッシュボードの場合はサービスロールキーを使用し、それ以外は匿名キーを使用
let supabaseKey;
if (isAdminDashboard) {
  // 管理ダッシュボード用のサービスロールキー
  supabaseKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dndveHp1cWxkcXJuZGV3eG55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU4MzEyNCwiZXhwIjoyMDY0MTU5MTI0fQ.8Ew_YdnQqKGdCYZKMuCNvGjTpPBwSy3_HJIqZYYYmMw';
  console.log('管理ダッシュボード: サービスロールキーを使用します');
  console.log('キーの先頭部分:', supabaseKey.substring(0, 20) + '...');
} else {
  // 一般ユーザー用の匿名キー
  supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dndveHp1cWxkcXJuZGV3eG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1ODMxMjQsImV4cCI6MjA2NDE1OTEyNH0.CAvGZK66x0zK3LobZzc5NBVTdxSmPPqtFSlLPscYGgo';
  console.log('一般ページ: 匿名キーを使用します');
  console.log('キーの先頭部分:', supabaseKey.substring(0, 20) + '...');
}

// 開発モードでの警告
if (process.env.NODE_ENV === 'development' && 
    (supabaseUrl === 'https://your-project-url.supabase.co')) {
  console.warn('Supabaseの接続情報が設定されていません。環境変数を確認してください。');
  console.warn('REACT_APP_SUPABASE_URLを.envファイルに設定してください。');
}

// Supabaseクライアントの作成
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
