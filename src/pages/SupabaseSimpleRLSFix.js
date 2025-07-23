import React, { useState, useEffect } from 'react';
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

const InfoBox = styled.div`
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const CodeBox = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-family: monospace;
  white-space: pre-wrap;
`;

const SupabaseSimpleRLSFix = () => {
  const [results, setResults] = useState([]);
  const [tableInfo, setTableInfo] = useState(null);
  const [connectionInfo, setConnectionInfo] = useState(null);

  useEffect(() => {
    // 接続情報を表示
    const url = supabase.supabaseUrl;
    // APIキーは表示しない
    setConnectionInfo({
      url,
      isConnected: !!url
    });

    // テーブル情報を取得
    checkTables();
  }, []);

  const addResult = (title, data, isError = false) => {
    setResults(prev => [
      { id: Date.now(), title, data, isError },
      ...prev
    ]);
  };

  // テーブル情報を取得
  const checkTables = async () => {
    try {
      addResult('テーブル情報取得中...', null);
      
      // downloadsテーブルからデータを取得
      const { data: downloadsData, error: downloadsError } = await supabase
        .from('downloads_sp')
        .select('*')
        .limit(1);
      
      // faqsテーブルからデータを取得
      const { data: faqsData, error: faqsError } = await supabase
        .from('faqs_sp')
        .select('*')
        .limit(1);
      
      setTableInfo({
        downloads: {
          accessible: !downloadsError,
          error: downloadsError ? downloadsError.message : null,
          sample: downloadsData
        },
        faqs: {
          accessible: !faqsError,
          error: faqsError ? faqsError.message : null,
          sample: faqsData
        }
      });
      
      if (downloadsError) {
        addResult('downloadsテーブルアクセスエラー', downloadsError.message, true);
      } else {
        addResult('downloadsテーブルアクセス成功', downloadsData);
      }
      
      if (faqsError) {
        addResult('faqsテーブルアクセスエラー', faqsError.message, true);
      } else {
        addResult('faqsテーブルアクセス成功', faqsData);
      }
    } catch (err) {
      console.error('テーブル情報取得エラー:', err);
      addResult('テーブル情報取得エラー', err.message, true);
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

  // 最新データを取得
  const fetchLatestData = async () => {
    try {
      addResult('最新データ取得中...', null);
      
      // downloadsテーブルから最新データを取得
      const { data, error } = await supabase
        .from('downloads_sp')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      addResult('最新データ取得結果', data);
    } catch (err) {
      console.error('最新データ取得エラー:', err);
      addResult('最新データ取得エラー', err.message, true);
    }
  };
  
  // テストデータ更新
  const updateTestData = async () => {
    try {
      addResult('テストデータ更新中...', null);
      
      // 最新のテストデータを取得
      const { data: latestData, error: fetchError } = await supabase
        .from('downloads_sp')
        .select('*')
        .eq('category', 'test')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (fetchError) throw fetchError;
      if (!latestData || latestData.length === 0) {
        throw new Error('更新するテストデータが見つかりません。まずテストデータを挿入してください。');
      }
      
      const testItem = latestData[0];
      const updateData = {
        title: `更新済み: ${new Date().toISOString().substring(0, 16)}`,
        description: '更新されたテスト説明'
      };
      
      // データを更新
      const { data: updatedData, error: updateError } = await supabase
        .from('downloads_sp')
        .update(updateData)
        .eq('id', testItem.id)
        .select();
      
      if (updateError) throw updateError;
      
      addResult('テストデータ更新結果', updatedData);
    } catch (err) {
      console.error('テストデータ更新エラー:', err);
      addResult('テストデータ更新エラー', err.message, true);
    }
  };

  // Supabase接続情報を表示
  const showConnectionInfo = () => {
    try {
      const connectionInfo = {
        url: supabase.supabaseUrl,
        authConfig: {
          autoRefreshToken: supabase.auth.autoRefreshToken,
          persistSession: supabase.auth.persistSession,
          storageKey: supabase.auth.storageKey
        },
        headers: {
          apikey: 'REDACTED FOR SECURITY',
          authorization: 'REDACTED FOR SECURITY'
        }
      };
      
      addResult('Supabase接続情報', connectionInfo);
    } catch (err) {
      console.error('接続情報取得エラー:', err);
      addResult('接続情報取得エラー', err.message, true);
    }
  };

  return (
    <Container>
      <Title>Supabase簡易診断・修正ツール</Title>
      
      <InfoBox>
        <h3>⚠️ RLSポリシーの設定方法</h3>
        <p>Supabaseプロジェクトに<code>execute_sql</code>関数が設定されていないため、RLSポリシーを自動的に修正できません。</p>
        <p>以下の手順でSupabaseダッシュボードから直接RLSポリシーを設定してください：</p>
        
        <h4>1. Supabaseダッシュボードにログイン</h4>
        <p>プロジェクトのSupabaseダッシュボードにアクセスしてください。</p>
        
        <h4>2. テーブルエディタを開く</h4>
        <p>左側のメニューから「Table Editor」を選択します。</p>
        
        <h4>3. downloadsテーブルのRLS設定</h4>
        <CodeBox>
          -- RLSを有効化
          ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
          
          -- 既存のポリシーを削除
          DROP POLICY IF EXISTS "Enable all access for anon" ON "public"."downloads";
          
          -- 匿名ユーザーに全権限を付与
          CREATE POLICY "Enable all access for anon" ON "public"."downloads"
          FOR ALL TO anon USING (true) WITH CHECK (true);
        </CodeBox>
        
        <h4>4. faqsテーブルのRLS設定</h4>
        <CodeBox>
          -- RLSを有効化
          ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
          
          -- 既存のポリシーを削除
          DROP POLICY IF EXISTS "Enable all access for anon" ON "public"."faqs";
          
          -- 匿名ユーザーに全権限を付与
          CREATE POLICY "Enable all access for anon" ON "public"."faqs"
          FOR ALL TO anon USING (true) WITH CHECK (true);
        </CodeBox>
        
        <h4>5. SQLエディタでの実行方法</h4>
        <p>Supabaseダッシュボードの「SQL Editor」を開き、上記のSQLコマンドを実行してください。</p>
      </InfoBox>
      
      {tableInfo && (
        <ResultContainer>
          <h3>テーブルアクセス状態</h3>
          <div>
            <h4>downloadsテーブル</h4>
            <p>アクセス可能: {tableInfo.downloads.accessible ? '✅ はい' : '❌ いいえ'}</p>
            {tableInfo.downloads.error && <p>エラー: {tableInfo.downloads.error}</p>}
          </div>
          <div>
            <h4>faqsテーブル</h4>
            <p>アクセス可能: {tableInfo.faqs.accessible ? '✅ はい' : '❌ いいえ'}</p>
            {tableInfo.faqs.error && <p>エラー: {tableInfo.faqs.error}</p>}
          </div>
        </ResultContainer>
      )}
      
      <div>
        <Button onClick={showConnectionInfo}>接続情報表示</Button>
        <Button onClick={insertTestData}>テストデータ挿入</Button>
        <Button onClick={updateTestData}>テストデータ更新</Button>
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

export default SupabaseSimpleRLSFix;
