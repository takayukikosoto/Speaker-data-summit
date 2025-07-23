import React from 'react';
import styled from 'styled-components';
import FAQSearch from '../components/FAQSearch';

const FAQPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #0a7463; // 色を統一
  margin-bottom: 2rem;
  text-align: center;
`;

const Description = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: #666;
  line-height: 1.6;
`;

const FAQ = () => {
  return (
    <FAQPageContainer>
      <PageTitle>よくあるご質問</PageTitle>
      <Description>
        primeNumber DATA SUMMIT 2025に関するよくあるご質問をまとめています。
        検索ボックスにキーワードを入力して、お探しの情報を見つけてください。
      </Description>
      
      <FAQSearch />
    </FAQPageContainer>
  );
};

export default FAQ;
