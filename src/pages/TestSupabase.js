import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';

const TestSupabase = () => {
  const [connectionStatus, setConnectionStatus] = useState('テスト中...');
  const [tableData, setTableData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Supabase接続情報を表示
        console.log('Supabase URL:', supabase.supabaseUrl);
        
        // テーブル一覧を取得
        const { data: tables, error: tablesError } = await supabase
          .from('downloads_sp')
          .select('*')
          .limit(1);
        
        if (tablesError) {
          throw tablesError;
        }
        
        setTableData(tables);
        setConnectionStatus('接続成功！');
      } catch (err) {
        console.error('Supabase接続エラー:', err);
        setError(err.message || 'エラーが発生しました');
        setConnectionStatus('接続失敗');
      }
    };
    
    testConnection();
  }, []);
  
  // テスト用のデータを挿入する関数
  const insertTestData = async () => {
    try {
      setConnectionStatus('データ挿入中...');
      
      const testItem = {
        id: '00000000-0000-4000-a000-000000000001',
        category: 'test',
        title: 'テストデータ',
        description: 'これはテスト用のデータです',
        fileType: 'PDF',
        fileSize: '1KB',
        downloadUrl: 'https://example.com/test.pdf',
        lastUpdated: '2025-05-30'
      };
      
      const { data, error } = await supabase
        .from('downloads_sp')
        .insert([testItem])
        .select();
        
      if (error) throw error;
      
      setConnectionStatus('テストデータ挿入成功！');
      setTableData([...tableData, data[0]]);
    } catch (err) {
      console.error('データ挿入エラー:', err);
      setError(err.message || 'データ挿入中にエラーが発生しました');
      setConnectionStatus('データ挿入失敗');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Supabase接続テスト</h1>
      
      <div style={{ 
        padding: '1rem', 
        backgroundColor: connectionStatus.includes('成功') ? '#e6f7f6' : '#ffebee',
        borderRadius: '4px',
        marginBottom: '1rem'
      }}>
        <h2>接続状態: {connectionStatus}</h2>
        {error && (
          <div style={{ color: 'red' }}>
            <h3>エラー:</h3>
            <pre>{error}</pre>
          </div>
        )}
      </div>
      
      <div>
        <h2>Supabase設定情報:</h2>
        <p>URL: {supabase.supabaseUrl}</p>
        <p>Key: {supabase.supabaseKey ? '設定済み（セキュリティのため非表示）' : '未設定'}</p>
      </div>
      
      <button 
        onClick={insertTestData}
        style={{
          backgroundColor: '#00A99D',
          color: 'white',
          padding: '0.7rem 1.5rem',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        テストデータを挿入
      </button>
      
      {tableData && (
        <div style={{ marginTop: '2rem' }}>
          <h2>取得データ:</h2>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '1rem', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(tableData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestSupabase;
