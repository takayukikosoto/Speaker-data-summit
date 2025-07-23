-- フォームテーブルの作成
CREATE TABLE IF NOT EXISTS public.forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  form_url TEXT NOT NULL,
  deadline TEXT,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Row Level Security (RLS) ポリシーの設定
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーのみ書き込み可能なポリシー
CREATE POLICY "認証済みユーザーのみ書き込み可能" ON public.forms
  FOR INSERT USING (auth.role() = 'authenticated');

-- 認証済みユーザーのみ更新可能なポリシー
CREATE POLICY "認証済みユーザーのみ更新可能" ON public.forms
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 認証済みユーザーのみ削除可能なポリシー
CREATE POLICY "認証済みユーザーのみ削除可能" ON public.forms
  FOR DELETE USING (auth.role() = 'authenticated');

-- 全員が読み取り可能なポリシー
CREATE POLICY "全員が読み取り可能" ON public.forms
  FOR SELECT USING (true);