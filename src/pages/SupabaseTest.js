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

const ButtonGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  background-color: #00A99D;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background-color: #008C82;
  }
`;

const Alert = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  background-color: ${props => props.error ? '#f8d7da' : '#d4edda'};
  color: ${props => props.error ? '#721c24' : '#155724'};
`;

const CardContainer = styled.div`
  margin-bottom: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  background-color: #f8f9fa;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
`;

const CardBody = styled.div`
  padding: 1rem;
`;

const DownloadItem = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [error, setError] = useState(null);
  const [downloads, setDownloads] = useState([]);

  // Supabase接続テスト
  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('downloads_sp').select('count()', { count: 'exact' });
      
      if (error) throw error;
      
      setConnectionStatus('接続成功');
      setError(null);
    } catch (err) {
      console.error('Supabase connection error:', err);
      setConnectionStatus('接続エラー');
      setError(err.message);
    }
  };

  // データ取得
  const fetchDownloads = async () => {
    try {
      const { data, error } = await supabase.from('downloads_sp').select('*');
      
      if (error) throw error;
      
      setDownloads(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching downloads:', err);
      setError(err.message);
    }
  };

  // テストデータ挿入
  const insertTestData = async () => {
    try {
      const testData = {
        title: `テストダウンロード ${new Date().toISOString()}`,
        category: 'test',
        description: 'テストデータの説明文',
        downloadUrl: 'https://example.com/test.pdf'
      };
      
      // IDを絶対に送らない
      delete testData.id;
      
      const { data, error } = await supabase
        .from('downloads_sp')
        .insert([testData])
        .select();
        
      if (error) throw error;
      
      setConnectionStatus('データ挿入成功');
      setError(null);
      // 最新データを表示
      fetchDownloads();
    } catch (err) {
      console.error('Error inserting test data:', err);
      setConnectionStatus('データ挿入失敗');
      setError(err.message);
    }
  };

  // テーブルリセット
  const resetTable = async () => {
    try {
      const { error } = await supabase
        .from('downloads_sp')
        .delete()
        .neq('id', 'dummy'); // 全ての行を削除
        
      if (error) throw error;
      
      setConnectionStatus('テーブルリセット成功');
      setError(null);
      fetchDownloads();
    } catch (err) {
      console.error('Error resetting table:', err);
      setConnectionStatus('テーブルリセット失敗');
      setError(err.message);
    }
  };

  // UUID変換用SQL実行
  const executeUuidConversion = async () => {
    try {
      // UUID拡張を有効化
      await supabase.rpc('execute_sql', {
        sql_query: "create extension if not exists \"uuid-ossp\";"
      });
      
      // IDカラムをUUID型に変換
      await supabase.rpc('execute_sql', {
        sql_query: "alter table downloads alter column id type uuid using (uuid_generate_v4()), alter column id set default uuid_generate_v4();"
      });
      
      // 主キー制約を再設定
      await supabase.rpc('execute_sql', {
        sql_query: "alter table downloads drop constraint if exists downloads_pkey; alter table downloads add primary key (id);"
      });
      
      setConnectionStatus('UUID変換成功');
      setError(null);
    } catch (err) {
      console.error('Error executing UUID conversion:', err);
      setConnectionStatus('UUID変換失敗');
      setError(err.message);
    }
  };

  // 初期ロード
  useEffect(() => {
    testConnection();
    fetchDownloads();
  }, []);

  return (
    <Container>
      <Title>Supabase接続テスト</Title>
      
      <ButtonGroup>
        <Button onClick={testConnection}>接続テスト</Button>
        <Button onClick={fetchDownloads}>データ取得</Button>
        <Button onClick={insertTestData}>テストデータ挿入</Button>
        <Button onClick={resetTable}>テーブルリセット</Button>
        <Button onClick={executeUuidConversion}>UUID変換実行</Button>
      </ButtonGroup>
      
      {connectionStatus && (
        <Alert error={connectionStatus.includes('エラー') || connectionStatus.includes('失敗')}>
          <strong>状態:</strong> {connectionStatus}
          {error && <div style={{ marginTop: '0.5rem' }}><strong>エラー:</strong><br/>{error}</div>}
        </Alert>
      )}
      
      {downloads.length > 0 && (
        <CardContainer>
          <CardHeader>ダウンロードデータ ({downloads.length}件)</CardHeader>
          <CardBody>
            {downloads.map((item, index) => (
              <DownloadItem key={index}>
                <h3>{item.title}</h3>
                <p><strong>ID:</strong> {item.id}</p>
                <p><strong>カテゴリー:</strong> {item.category}</p>
                <p><strong>説明:</strong> {item.description}</p>
                <p><strong>URL:</strong> {item.downloadUrl}</p>
                <p><strong>作成日時:</strong> {item.created_at}</p>
              </DownloadItem>
            ))}
          </CardBody>
        </CardContainer>
      )}
    </Container>
  );
};

export default SupabaseTest;
