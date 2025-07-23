import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SecretRoomContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
`;

const Section = styled.section`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  
  &:hover {
    background-color: #45a049;
  }
`;

const BackButton = styled(Link)`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  margin-bottom: 2rem;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const SecretRoom = () => {
  const [loading, setLoading] = useState(false);
  
  return (
    <SecretRoomContainer>
      <BackButton to="/admin">← 管理画面に戻る</BackButton>
      
      <PageTitle>秘密の部屋</PageTitle>
      
      <Section>
        <SectionTitle>特別管理機能</SectionTitle>
        <p>このページには高度な管理機能が含まれています。このページへのアクセスは制限されており、許可された管理者のみが利用できます。</p>
        
        <div style={{ marginTop: '2rem' }}>
          <Button onClick={() => alert('この機能は現在開発中です')}>
            システム設定
          </Button>
          <Button onClick={() => alert('この機能は現在開発中です')}>
            ユーザー管理
          </Button>
          <Button onClick={() => alert('この機能は現在開発中です')}>
            高度な分析
          </Button>
        </div>
      </Section>
      
      <Section>
        <SectionTitle>システム情報</SectionTitle>
        <p>
          <strong>アプリケーション名:</strong> primeNumber DATA SUMMIT 2025<br />
          <strong>バージョン:</strong> 1.0.0<br />
          <strong>最終更新日:</strong> 2025年6月2日<br />
          <strong>環境:</strong> 本番環境<br />
        </p>
      </Section>
    </SecretRoomContainer>
  );
};

export default SecretRoom;
