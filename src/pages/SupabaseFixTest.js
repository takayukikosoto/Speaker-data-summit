import React, { useState } from 'react';
import { Container, Button, Alert, Card } from 'react-bootstrap';
import supabase from '../utils/supabaseClient';

const SupabaseFixTest = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [tableInfo, setTableInfo] = useState(null);

  // テーブル構造確認
  const checkTableStructure = async () => {
    try {
      setStatus('テーブル構造確認中...');
      
      // カラム情報
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, column_default')
        .eq('table_name', 'downloads')
        .eq('table_schema', 'public');
      
      if (columnsError) throw columnsError;
      
      // 主キー情報
      const { data: constraints, error: constraintsError } = await supabase
        .from('information_schema.table_constraints')
        .select('constraint_name, constraint_type')
        .eq('table_name', 'downloads')
        .eq('table_schema', 'public');
      
      if (constraintsError) throw constraintsError;
      
      setTableInfo({ columns, constraints });
      setStatus('テーブル構造確認完了');
      setError(null);
    } catch (err) {
      console.error('テーブル構造確認エラー:', err);
      setStatus('テーブル構造確認失敗');
      setError(err.message);
    }
  };

  // UUID変換
  const fixUuidStructure = async () => {
    try {
      setStatus('UUID構造修正中...');
      
      // 1. UUID拡張の有効化
      await supabase.rpc('execute_sql', {
        sql_query: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
      });
      
      // 2. テーブルを空にする
      await supabase
        .from('downloads_sp')
        .delete()
        .neq('id', 'dummy'); // 全行削除
      
      // 3. IDカラムをUUID型に変更し、デフォルト値を設定
      await supabase.rpc('execute_sql', {
        sql_query: 'ALTER TABLE downloads ALTER COLUMN id DROP DEFAULT, ALTER COLUMN id TYPE uuid USING (uuid_generate_v4()), ALTER COLUMN id SET DEFAULT uuid_generate_v4();'
      });
      
      // 4. 主キー制約を再設定
      await supabase.rpc('execute_sql', {
        sql_query: 'ALTER TABLE downloads DROP CONSTRAINT IF EXISTS downloads_pkey; ALTER TABLE downloads ADD PRIMARY KEY (id);'
      });
      
      setStatus('UUID構造修正完了');
      setError(null);
      
      // 構造確認
      checkTableStructure();
    } catch (err) {
      console.error('UUID構造修正エラー:', err);
      setStatus('UUID構造修正失敗');
      setError(err.message);
    }
  };

  // テストデータ挿入
  const insertTestData = async () => {
    try {
      setStatus('テストデータ挿入中...');
      
      const testData = {
        title: `テストダウンロード ${new Date().toISOString()}`,
        category: 'test',
        description: 'テストデータの説明文',
        downloadUrl: 'https://example.com/test.pdf'
      };
      
      // IDを絶対に含めない
      delete testData.id;
      
      console.log('挿入するデータ:', testData);
      
      const { data, error } = await supabase
        .from('downloads_sp')
        .insert([testData])
        .select();
      
      if (error) throw error;
      
      setStatus('テストデータ挿入成功');
      setError(null);
      fetchDownloads();
    } catch (err) {
      console.error('テストデータ挿入エラー:', err);
      setStatus('テストデータ挿入失敗');
      setError(err.message);
    }
  };

  // データ取得
  const fetchDownloads = async () => {
    try {
      setStatus('データ取得中...');
      
      const { data, error } = await supabase
        .from('downloads_sp')
        .select('*');
      
      if (error) throw error;
      
      setDownloads(data);
      setStatus('データ取得完了');
      setError(null);
    } catch (err) {
      console.error('データ取得エラー:', err);
      setStatus('データ取得失敗');
      setError(err.message);
    }
  };

  return (
    <Container className="py-4">
      <h1>Supabase修正テスト</h1>
      
      <div className="mb-4">
        <Button onClick={checkTableStructure} variant="primary" className="me-2 mb-2">
          テーブル構造確認
        </Button>
        <Button onClick={fixUuidStructure} variant="danger" className="me-2 mb-2">
          UUID構造修正
        </Button>
        <Button onClick={insertTestData} variant="success" className="me-2 mb-2">
          テストデータ挿入
        </Button>
        <Button onClick={fetchDownloads} variant="info" className="mb-2">
          データ取得
        </Button>
      </div>
      
      {status && (
        <Alert variant={status.includes('失敗') ? 'danger' : 'success'} className="mb-3">
          <strong>状態:</strong> {status}
          {error && <div className="mt-2"><strong>エラー:</strong><br/>{error}</div>}
        </Alert>
      )}
      
      {tableInfo && (
        <Card className="mb-4">
          <Card.Header>テーブル構造: downloads</Card.Header>
          <Card.Body>
            <h5>カラム情報</h5>
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>カラム名</th>
                  <th>データ型</th>
                  <th>デフォルト値</th>
                </tr>
              </thead>
              <tbody>
                {tableInfo.columns.map((col, idx) => (
                  <tr key={idx}>
                    <td>{col.column_name}</td>
                    <td>{col.data_type}</td>
                    <td>{col.column_default}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <h5 className="mt-4">制約情報</h5>
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>制約名</th>
                  <th>制約タイプ</th>
                </tr>
              </thead>
              <tbody>
                {tableInfo.constraints.map((constraint, idx) => (
                  <tr key={idx}>
                    <td>{constraint.constraint_name}</td>
                    <td>{constraint.constraint_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card.Body>
        </Card>
      )}
      
      {downloads.length > 0 && (
        <Card>
          <Card.Header>ダウンロードデータ ({downloads.length}件)</Card.Header>
          <Card.Body>
            {downloads.map((item, index) => (
              <div key={index} className="mb-3 p-3 border rounded">
                <h5>{item.title}</h5>
                <p><strong>ID:</strong> {item.id}</p>
                <p><strong>カテゴリー:</strong> {item.category}</p>
                <p><strong>説明:</strong> {item.description}</p>
                <p><strong>URL:</strong> {item.downloadUrl}</p>
                <p><strong>作成日時:</strong> {item.created_at}</p>
              </div>
            ))}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default SupabaseFixTest;
