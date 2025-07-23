import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { loadFAQText } from '../utils/faqTextLoader';
import { migrateFaqTextToSupabase } from '../utils/supabaseService';
import AdminProtection from '../components/AdminProtection';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #00A99D;
  margin-bottom: 2rem;
  text-align: center;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background-color: #00A99D;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #008C7A;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: ${props => props.success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.success ? '#155724' : '#721c24'};
`;

const TextPreview = styled.pre`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const DataMigration = () => {
  const [faqText, setFaqText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    const loadText = async () => {
      try {
        const text = await loadFAQText();
        setFaqText(text);
      } catch (error) {
        console.error('Error loading FAQ text:', error);
        setMessage({
          text: 'FAQテキストの読み込みに失敗しました。',
          success: false
        });
      }
    };
    
    loadText();
  }, []);
  
  const handleMigration = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      const result = await migrateFaqTextToSupabase(faqText);
      
      setMessage({
        text: result.message,
        success: result.success
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Migration error:', error);
      setMessage({
        text: `移行中にエラーが発生しました: ${error.message}`,
        success: false
      });
      setLoading(false);
    }
  };
  
  return (
    <AdminProtection>
      <Container>
        <PageTitle>データ移行ツール</PageTitle>
        
        <Card>
          <h2>FAQテキストをSupabaseに移行</h2>
          <p>
            このツールは、FAQテキストファイルからデータを抽出し、Supabaseデータベースに移行します。
            移行を実行する前に、Supabaseの接続情報が正しく設定されていることを確認してください。
          </p>
          
          <h3>FAQテキストプレビュー</h3>
          <TextPreview>
            {faqText ? faqText.substring(0, 500) + '...' : 'テキストを読み込んでいます...'}
          </TextPreview>
          
          <Button 
            onClick={handleMigration} 
            disabled={loading || !faqText}
          >
            {loading ? '移行中...' : 'Supabaseに移行する'}
          </Button>
          
          {message && (
            <Message success={message.success}>
              {message.text}
            </Message>
          )}
        </Card>
        
        <Card>
          <h2>使用方法</h2>
          <ol>
            <li>Supabaseプロジェクトを作成し、接続情報を設定します。</li>
            <li>Supabaseで「faqs」テーブルを作成します。</li>
            <li>「Supabaseに移行する」ボタンをクリックして、FAQデータを移行します。</li>
            <li>移行が完了したら、FAQページでデータが正しく表示されることを確認します。</li>
          </ol>
          <p>
            <strong>注意:</strong> 移行を実行すると、既存のFAQデータは上書きされます。
          </p>
        </Card>
      </Container>
    </AdminProtection>
  );
};

export default DataMigration;
