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

const SupabaseTableFix = () => {
  const [results, setResults] = useState([]);

  const addResult = (title, data, isError = false) => {
    setResults(prev => [
      { id: Date.now(), title, data, isError },
      ...prev
    ]);
  };

  // テーブル構造を確認
  const checkTableStructure = async () => {
    try {
      addResult('テーブル構造確認中...', null);
      
      // downloadsテーブルの構造を取得
      const { data, error } = await supabase
        .from('downloads_sp')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      // カラム名を取得
      const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
      
      addResult('downloadsテーブルの構造', {
        columns,
        sampleData: data
      });
    } catch (err) {
      console.error('テーブル構造確認エラー:', err);
      addResult('テーブル構造確認エラー', err.message, true);
    }
  };

  // updated_atカラムを追加
  const addUpdatedAtColumn = async () => {
    try {
      addResult('updated_atカラム追加中...', null);
      
      // SQL実行
      const { error } = await supabase.rpc('add_updated_at_column');
      
      if (error) {
        // RPCが存在しない場合、直接SQLを実行
        const { error: sqlError } = await supabase
          .from('_sqlQueries')
          .select('*')
          .eq('name', 'add_updated_at_column')
          .limit(1);
        
        if (sqlError) {
          // SQLクエリを直接実行するためのRPCを作成
          const createRpcResult = await createAddColumnRpc();
          if (!createRpcResult.success) throw new Error(createRpcResult.error);
          
          // 作成したRPCを実行
          const { error: execError } = await supabase.rpc('add_updated_at_column');
          if (execError) throw execError;
        }
      }
      
      addResult('updated_atカラム追加完了', 'カラムが正常に追加されました');
      
      // 確認のためテーブル構造を再取得
      await checkTableStructure();
    } catch (err) {
      console.error('カラム追加エラー:', err);
      addResult('カラム追加エラー', err.message, true);
    }
  };

  // SQLクエリを実行するためのRPCを作成
  const createAddColumnRpc = async () => {
    try {
      // RPC作成
      const { error: createError } = await supabase.rpc('create_sql_function', {
        function_name: 'add_updated_at_column',
        function_sql: `
          ALTER TABLE downloads 
          ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;
          
          UPDATE downloads 
          SET updated_at = created_at 
          WHERE updated_at IS NULL;
          
          SELECT 'updated_at column added successfully' as result;
        `
      });
      
      if (createError) {
        // RPCが存在しない場合、直接SQLを実行
        const { error: directError } = await supabase.rpc('execute_sql', {
          sql: `
            ALTER TABLE downloads 
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;
            
            UPDATE downloads 
            SET updated_at = created_at 
            WHERE updated_at IS NULL;
          `
        });
        
        if (directError) {
          return { success: false, error: directError.message };
        }
      }
      
      return { success: true };
    } catch (err) {
      console.error('RPC作成エラー:', err);
      return { success: false, error: err.message };
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
        lastUpdated: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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

  // 直接SQLを実行
  const executeDirectSQL = async () => {
    try {
      addResult('SQL実行中...', null);
      
      // SQL文を作成
      const sql = `
        ALTER TABLE downloads 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;
        
        UPDATE downloads 
        SET updated_at = created_at 
        WHERE updated_at IS NULL;
        
        SELECT 'SQL executed successfully' as result;
      `;
      
      // 管理者権限でSQLを実行
      const response = await fetch('https://jimu.supabase.co/rest/v1/rpc/execute_sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({ sql })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || '不明なエラーが発生しました');
      }
      
      addResult('SQL実行結果', result);
    } catch (err) {
      console.error('SQL実行エラー:', err);
      addResult('SQL実行エラー', err.message, true);
    }
  };

  return (
    <Container>
      <Title>Supabase テーブル修正ツール</Title>
      
      <div>
        <Button onClick={checkTableStructure}>テーブル構造確認</Button>
        <Button onClick={addUpdatedAtColumn}>updated_atカラム追加</Button>
        <Button onClick={executeDirectSQL}>直接SQL実行</Button>
        <Button onClick={insertTestData}>テストデータ挿入</Button>
      </div>
      
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h3>エラーについて</h3>
        <p>
          「Could not find the 'updated_at' column of 'downloads' in the schema cache」というエラーは、
          <code>updated_at</code>カラムがテーブルに存在しないことを示しています。
        </p>
        <p>
          このツールでは、<code>updated_at</code>カラムを追加し、既存のレコードには<code>created_at</code>の値をコピーします。
        </p>
        <p>
          <strong>手順:</strong>
        </p>
        <ol>
          <li>「テーブル構造確認」ボタンを押して現在のテーブル構造を確認</li>
          <li>「updated_atカラム追加」ボタンを押してカラムを追加</li>
          <li>「テストデータ挿入」ボタンを押して正常に動作するか確認</li>
        </ol>
        <p>
          もし上記の方法で解決しない場合は、「直接SQL実行」ボタンを押してください。
        </p>
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

export default SupabaseTableFix;
