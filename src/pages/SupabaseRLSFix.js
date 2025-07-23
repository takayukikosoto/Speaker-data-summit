import React, { useState } from 'react';
import styled from 'styled-components';
import supabase from '../utils/supabaseClient';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  background-color: #00A99D;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #008C82;
  }
`;

const ResultContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: ${props => props.error ? '#fff8f8' : '#f8fff8'};
`;

const Pre = styled.pre`
  white-space: pre-wrap;
  overflow-x: auto;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
`;

const SupabaseRLSFix = () => {
  const [results, setResults] = useState([]);

  const addResult = (title, data, isError = false) => {
    setResults(prev => [
      { id: Date.now(), title, data, isError },
      ...prev
    ]);
  };

  // RLS設定を確認
  const checkRLS = async () => {
    try {
      addResult('RLS設定確認中...', null);
      
      // RLS設定を取得
      const { data, error } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('schemaname', 'public');
      
      if (error) {
        // 直接SQLを実行して確認
        const { data: sqlData, error: sqlError } = await supabase.rpc('execute_sql', {
          sql_query: `
            SELECT table_name, policy_name, roles, cmd, using_expression, with_check 
            FROM pg_policies 
            WHERE schemaname = 'public';
          `
        });
        
        if (sqlError) throw sqlError;
        addResult('RLS設定 (SQL経由)', sqlData);
      } else {
        addResult('RLS設定', data);
      }
      
      // テーブルのRLS有効状態を取得
      const { data: rlsEnabledData, error: rlsEnabledError } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT tablename, rowsecurity 
          FROM pg_tables 
          WHERE schemaname = 'public';
        `
      });
      
      if (rlsEnabledError) throw rlsEnabledError;
      addResult('RLS有効状態', rlsEnabledData);
      
    } catch (err) {
      console.error('RLS設定確認エラー:', err);
      addResult('RLS設定確認エラー', err.message, true);
    }
  };

  // RLS設定を修正
  const fixRLS = async () => {
    try {
      addResult('RLS設定修正中...', null);
      
      // downloadsテーブルのRLSを有効化
      const { error: enableError } = await supabase.rpc('execute_sql', {
        sql_query: `ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;`
      });
      
      if (enableError) throw enableError;
      
      // 既存のポリシーを削除
      const { error: dropError } = await supabase.rpc('execute_sql', {
        sql_query: `DROP POLICY IF EXISTS "Enable all access for anon" ON "public"."downloads";`
      });
      
      if (dropError) throw dropError;
      
      // 匿名ユーザーに全権限を付与
      const { error: policyError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE POLICY "Enable all access for anon" ON "public"."downloads"
          FOR ALL TO 'anon' USING (true) WITH CHECK (true);
        `
      });
      
      if (policyError) throw policyError;
      
      // faqsテーブルのRLSも同様に設定
      const { error: faqsEnableError } = await supabase.rpc('execute_sql', {
        sql_query: `ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;`
      });
      
      if (faqsEnableError) throw faqsEnableError;
      
      const { error: faqsDropError } = await supabase.rpc('execute_sql', {
        sql_query: `DROP POLICY IF EXISTS "Enable all access for anon" ON "public"."faqs";`
      });
      
      if (faqsDropError) throw faqsDropError;
      
      const { error: faqsPolicyError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE POLICY "Enable all access for anon" ON "public"."faqs"
          FOR ALL TO 'anon' USING (true) WITH CHECK (true);
        `
      });
      
      if (faqsPolicyError) throw faqsPolicyError;
      
      addResult('RLS設定修正完了', '匿名ユーザーに全権限を付与しました');
    } catch (err) {
      console.error('RLS設定修正エラー:', err);
      addResult('RLS設定修正エラー', err.message, true);
    }
  };

  // UUID型への変換を確認
  const checkUUID = async () => {
    try {
      addResult('UUID型確認中...', null);
      
      // downloadsテーブルのカラム情報を取得
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT column_name, data_type, column_default, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'downloads' AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });
      
      if (error) throw error;
      
      addResult('downloadsテーブルの構造', data);
      
      // faqsテーブルのカラム情報も取得
      const { data: faqsData, error: faqsError } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT column_name, data_type, column_default, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'faqs' AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });
      
      if (faqsError) throw faqsError;
      
      addResult('faqsテーブルの構造', faqsData);
    } catch (err) {
      console.error('UUID型確認エラー:', err);
      addResult('UUID型確認エラー', err.message, true);
    }
  };

  // UUID型への変換を実行
  const convertToUUID = async () => {
    try {
      addResult('UUID型変換中...', null);
      
      // UUID拡張を有効化
      const { error: extError } = await supabase.rpc('execute_sql', {
        sql_query: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
      });
      
      if (extError) throw extError;
      
      // downloadsテーブルのidカラムをUUID型に変換
      const { error: downloadsError } = await supabase.rpc('execute_sql', {
        sql_query: `
          ALTER TABLE downloads 
          ALTER COLUMN id TYPE UUID USING (uuid_generate_v4()),
          ALTER COLUMN id SET DEFAULT uuid_generate_v4();
        `
      });
      
      if (downloadsError) throw downloadsError;
      
      // faqsテーブルのidカラムもUUID型に変換
      const { error: faqsError } = await supabase.rpc('execute_sql', {
        sql_query: `
          ALTER TABLE faqs 
          ALTER COLUMN id TYPE UUID USING (uuid_generate_v4()),
          ALTER COLUMN id SET DEFAULT uuid_generate_v4();
        `
      });
      
      if (faqsError) throw faqsError;
      
      addResult('UUID型変換完了', 'downloadsとfaqsテーブルのidカラムをUUID型に変換しました');
    } catch (err) {
      console.error('UUID型変換エラー:', err);
      addResult('UUID型変換エラー', err.message, true);
    }
  };

  // テストデータを挿入
  const insertTestData = async () => {
    try {
      addResult('テストデータ挿入中...', null);
      
      const testData = {
        title: `テストダウンロード ${new Date().toISOString().substring(0, 16)}`,
        category: 'test',
        description: 'テスト説明',
        downloadUrl: 'https://example.com/test.pdf',
        fileType: 'PDF',
        fileSize: '1KB',
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      // 直接挿入
      const { data, error } = await supabase
        .from('downloads_sp')
        .insert([testData])
        .select();
      
      if (error) throw error;
      
      addResult('テストデータ挿入結果', data);
    } catch (err) {
      console.error('テストデータ挿入エラー:', err);
      addResult('テストデータ挿入エラー', err.message, true);
    }
  };

  return (
    <Container>
      <Title>Supabase RLS修正ツール</Title>
      
      <div>
        <Button onClick={checkRLS}>RLS設定確認</Button>
        <Button onClick={fixRLS}>RLS設定修正</Button>
        <Button onClick={checkUUID}>UUID型確認</Button>
        <Button onClick={convertToUUID}>UUID型変換</Button>
        <Button onClick={insertTestData}>テストデータ挿入</Button>
      </div>
      
      {results.map(result => (
        <ResultContainer key={result.id} error={result.isError}>
          <h3>{result.title}</h3>
          {result.data !== null && (
            <Pre>
              {typeof result.data === 'object' 
                ? JSON.stringify(result.data, null, 2) 
                : result.data}
            </Pre>
          )}
        </ResultContainer>
      ))}
    </Container>
  );
};

export default SupabaseRLSFix;
