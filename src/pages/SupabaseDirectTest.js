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

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const SupabaseDirectTest = () => {
  const [results, setResults] = useState([]);
  const [testTitle, setTestTitle] = useState(`テスト ${new Date().toISOString().substring(0, 16)}`);

  const addResult = (title, data, isError = false) => {
    setResults(prev => [
      { id: Date.now(), title, data, isError },
      ...prev
    ]);
  };

  // 1. テーブル構造確認
  const checkTableStructure = async () => {
    try {
      addResult('テーブル構造確認中...', null);
      
      // テーブルのカラム情報を取得
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT column_name, data_type, column_default, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'downloads_sp' AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });
      
      if (error) throw error;
      
      addResult('テーブル構造', data);
    } catch (err) {
      console.error('テーブル構造確認エラー:', err);
      addResult('テーブル構造確認エラー', err.message, true);
    }
  };

  // 2. 直接挿入テスト
  const testDirectInsert = async () => {
    try {
      const testData = {
        title: testTitle,
        category: 'test',
        description: 'テスト説明',
        downloadUrl: 'https://example.com/test.pdf',
        fileType: 'PDF',
        fileSize: '1KB',
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      addResult('直接挿入テスト', testData);
      
      // 直接挿入
      const { data, error } = await supabase
        .from('downloads_sp')
        .insert([testData])
        .select();
      
      if (error) throw error;
      
      addResult('挿入結果', data);
    } catch (err) {
      console.error('直接挿入エラー:', err);
      addResult('直接挿入エラー', err.message, true);
    }
  };

  // 3. UUID変換SQL実行
  const executeUUIDConversion = async () => {
    try {
      addResult('UUID変換SQL実行中...', null);
      
      // UUID拡張を有効化
      const { error: extError } = await supabase.rpc('execute_sql', {
        sql_query: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
      });
      
      if (extError) throw extError;
      
      // idカラムをUUID型に変換
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `
          ALTER TABLE downloads_sp 
          ALTER COLUMN id TYPE UUID USING (uuid_generate_v4()),
          ALTER COLUMN id SET DEFAULT uuid_generate_v4();
        `
      });
      
      if (error) throw error;
      
      addResult('UUID変換SQL実行結果', data || 'Success');
    } catch (err) {
      console.error('UUID変換SQL実行エラー:', err);
      addResult('UUID変換SQL実行エラー', err.message, true);
    }
  };

  // 4. RLS設定確認
  const checkRLS = async () => {
    try {
      addResult('RLS設定確認中...', null);
      
      // RLS設定を取得
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT table_name, policy_name, roles, cmd, using_expression, with_check 
          FROM pg_policies 
          WHERE schemaname = 'public' AND table_name = 'downloads_sp';
        `
      });
      
      if (error) throw error;
      
      // テーブルのRLS有効状態を取得
      const { data: rlsEnabledData, error: rlsEnabledError } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT tablename, rowsecurity 
          FROM pg_tables 
          WHERE schemaname = 'public' AND tablename = 'downloads_sp';
        `
      });
      
      if (rlsEnabledError) throw rlsEnabledError;
      
      addResult('RLS設定', {
        policies: data,
        enabled: rlsEnabledData
      });
    } catch (err) {
      console.error('RLS設定確認エラー:', err);
      addResult('RLS設定確認エラー', err.message, true);
    }
  };

  // 5. RLS設定追加
  const addRLSPolicy = async () => {
    try {
      addResult('RLS設定追加中...', null);
      
      // RLSを有効化
      const { error: enableError } = await supabase.rpc('execute_sql', {
        sql_query: `ALTER TABLE downloads_sp ENABLE ROW LEVEL SECURITY;`
      });
      
      if (enableError) throw enableError;
      
      // 匿名ユーザーに全権限を付与
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE POLICY "Enable all access for anon" ON "public"."downloads_sp"
          FOR ALL TO 'anon' USING (true) WITH CHECK (true);
        `
      });
      
      if (error) throw error;
      
      addResult('RLS設定追加結果', data || 'Success');
    } catch (err) {
      console.error('RLS設定追加エラー:', err);
      addResult('RLS設定追加エラー', err.message, true);
    }
  };

  // 6. 最新データ取得
  const fetchLatestData = async () => {
    try {
      addResult('最新データ取得中...', null);
      
      const { data, error } = await supabase
        .from('downloads_sp')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      addResult('最新データ', data);
    } catch (err) {
      console.error('最新データ取得エラー:', err);
      addResult('最新データ取得エラー', err.message, true);
    }
  };

  return (
    <Container>
      <Title>Supabase直接テスト</Title>
      
      <div>
        <Label htmlFor="testTitle">テストタイトル</Label>
        <Input 
          id="testTitle"
          value={testTitle}
          onChange={(e) => setTestTitle(e.target.value)}
          placeholder="テストデータのタイトル"
        />
      </div>
      
      <div>
        <Button onClick={checkTableStructure}>テーブル構造確認</Button>
        <Button onClick={testDirectInsert}>直接挿入テスト</Button>
        <Button onClick={executeUUIDConversion}>UUID変換実行</Button>
        <Button onClick={checkRLS}>RLS設定確認</Button>
        <Button onClick={addRLSPolicy}>RLS設定追加</Button>
        <Button onClick={fetchLatestData}>最新データ取得</Button>
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

export default SupabaseDirectTest;
