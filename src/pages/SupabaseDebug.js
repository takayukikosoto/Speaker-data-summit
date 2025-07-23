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

const InfoItem = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  white-space: pre-wrap;
  overflow-x: auto;
`;

const SupabaseDebug = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState([]);
  const [policies, setPolicies] = useState([]);

  // Supabase接続テスト
  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('downloads_sp').select('count()', { count: 'exact' });
      
      if (error) throw error;
      
      setStatus('接続成功');
      setError(null);
      setInfo([
        { title: 'Supabase接続情報', content: JSON.stringify({
          url: supabase.supabaseUrl,
          auth: {
            autoRefreshToken: supabase.auth.autoRefreshToken,
            persistSession: supabase.auth.persistSession
          }
        }, null, 2) }
      ]);
    } catch (err) {
      console.error('Supabase connection error:', err);
      setStatus('接続エラー');
      setError(err.message);
    }
  };

  // RLS設定を確認
  const checkRLS = async () => {
    try {
      setStatus('RLS設定確認中...');
      
      // RLS設定を取得
      const { data: rlsData, error: rlsError } = await supabase.rpc('execute_sql', {
        sql_query: "SELECT table_name, policy_name, roles, cmd, using_expression, with_check FROM pg_policies WHERE schemaname = 'public';"
      });
      
      if (rlsError) throw rlsError;
      
      // テーブルのRLS有効状態を取得
      const { data: rlsEnabledData, error: rlsEnabledError } = await supabase.rpc('execute_sql', {
        sql_query: "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';"
      });
      
      if (rlsEnabledError) throw rlsEnabledError;
      
      setPolicies([
        { title: 'RLSポリシー', content: JSON.stringify(rlsData, null, 2) },
        { title: 'RLS有効状態', content: JSON.stringify(rlsEnabledData, null, 2) }
      ]);
      
      setStatus('RLS設定確認完了');
      setError(null);
    } catch (err) {
      console.error('RLS check error:', err);
      setStatus('RLS設定確認エラー');
      setError(err.message);
    }
  };

  // 直接データ挿入テスト
  const testDirectInsert = async () => {
    try {
      setStatus('直接データ挿入テスト中...');
      
      const testData = {
        title: `テストダウンロード ${new Date().toISOString()}`,
        category: 'test',
        description: 'テストデータの説明文',
        downloadUrl: 'https://example.com/test.pdf',
        fileType: 'PDF',
        fileSize: '1KB',
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      console.log('挿入するデータ:', testData);
      
      // 直接挿入
      const { data: insertData, error: insertError } = await supabase
        .from('downloads_sp')
        .insert([testData]);
      
      if (insertError) throw insertError;
      
      // 挿入後にデータを取得
      const { data: fetchData, error: fetchError } = await supabase
        .from('downloads_sp')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (fetchError) throw fetchError;
      
      setInfo([
        { title: '挿入データ', content: JSON.stringify(testData, null, 2) },
        { title: '挿入結果', content: JSON.stringify(insertData, null, 2) },
        { title: '取得データ', content: JSON.stringify(fetchData, null, 2) }
      ]);
      
      setStatus('直接データ挿入テスト完了');
      setError(null);
    } catch (err) {
      console.error('Direct insert test error:', err);
      setStatus('直接データ挿入テストエラー');
      setError(err.message);
    }
  };

  // リアルタイムリスナーテスト
  const testRealtimeListener = async () => {
    try {
      setStatus('リアルタイムリスナーテスト中...');
      setInfo([{ title: 'リアルタイムイベント', content: '待機中...' }]);
      
      // リアルタイムリスナーを設定
      const subscription = supabase
        .channel('downloads-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'downloads' 
        }, (payload) => {
          console.log('リアルタイムイベント受信:', payload);
          setInfo(prev => [...prev, { 
            title: `リアルタイムイベント (${new Date().toLocaleTimeString()})`, 
            content: JSON.stringify(payload, null, 2) 
          }]);
        })
        .subscribe((status) => {
          console.log('サブスクリプションステータス:', status);
          if (status === 'SUBSCRIBED') {
            setStatus('リアルタイムリスナー接続成功');
          }
        });
      
      // 10秒後にテストデータを挿入
      setTimeout(async () => {
        const testData = {
          title: `リアルタイムテスト ${new Date().toISOString()}`,
          category: 'realtime-test',
          description: 'リアルタイムテスト用データ',
          downloadUrl: 'https://example.com/realtime-test.pdf',
          fileType: 'PDF',
          fileSize: '1KB',
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        console.log('リアルタイムテスト用データ挿入:', testData);
        
        const { error: insertError } = await supabase
          .from('downloads_sp')
          .insert([testData]);
        
        if (insertError) {
          console.error('リアルタイムテスト用データ挿入エラー:', insertError);
          setError(insertError.message);
        }
      }, 3000);
      
    } catch (err) {
      console.error('Realtime listener test error:', err);
      setStatus('リアルタイムリスナーテストエラー');
      setError(err.message);
    }
  };

  // 初期ロード
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Container>
      <Title>Supabaseデバッグツール</Title>
      
      <ButtonGroup>
        <Button onClick={testConnection}>接続テスト</Button>
        <Button onClick={checkRLS}>RLS設定確認</Button>
        <Button onClick={testDirectInsert}>直接データ挿入テスト</Button>
        <Button onClick={testRealtimeListener}>リアルタイムリスナーテスト</Button>
      </ButtonGroup>
      
      {status && (
        <Alert error={status.includes('エラー')}>
          <strong>状態:</strong> {status}
          {error && <div style={{ marginTop: '0.5rem' }}><strong>エラー:</strong><br/>{error}</div>}
        </Alert>
      )}
      
      {info.length > 0 && (
        <CardContainer>
          <CardHeader>デバッグ情報</CardHeader>
          <CardBody>
            {info.map((item, index) => (
              <InfoItem key={index}>
                <h3>{item.title}</h3>
                <pre>{item.content}</pre>
              </InfoItem>
            ))}
          </CardBody>
        </CardContainer>
      )}
      
      {policies.length > 0 && (
        <CardContainer>
          <CardHeader>RLS設定情報</CardHeader>
          <CardBody>
            {policies.map((item, index) => (
              <InfoItem key={index}>
                <h3>{item.title}</h3>
                <pre>{item.content}</pre>
              </InfoItem>
            ))}
          </CardBody>
        </CardContainer>
      )}
    </Container>
  );
};

export default SupabaseDebug;
