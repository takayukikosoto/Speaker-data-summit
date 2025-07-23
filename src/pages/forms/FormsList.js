import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FormsContainer = styled.div`
  max-width: 1000px;
  margin: 8rem auto 4rem;
  padding: 0 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 50px;
    height: 4px;
    background-color: #000;
    margin: 1rem auto 3rem;
  }
`;

const FormsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const FormCard = styled(Link)`
  background-color: #fff;
  border-radius: 8px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  }
`;

const FormIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #000;
`;

const FormTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FormDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const FormButton = styled.span`
  display: inline-block;
  background-color: #000;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  margin-top: auto;
  text-align: center;
  
  ${FormCard}:hover & {
    background-color: #333;
  }
`;

const FormsList = () => {
  const forms = [
    {
      id: 'session',
      title: 'セッション情報フォーム',
      description: 'データサイエンスやAIに関する講演内容、セッションタイトル、概要などの情報を登録するためのフォームです。',
      icon: '🎤',
      path: '/forms/session'
    },
    {
      id: 'company',
      title: '企業情報フォーム',
      description: 'primeNumber DATA SUMMIT 2025に出展する企業の基本情報、ロゴ、会社概要などを登録するためのフォームです。',
      icon: '🏢',
      path: '/forms/company'
    },
    {
      id: 'presentation-env',
      title: '講演環境フォーム',
      description: 'データ分析やAIデモに必要な機材、環境設定、特別な要望などを登録するためのフォームです。',
      icon: '💻',
      path: '/forms/presentation-env'
    },
    {
      id: 'booth',
      title: '展示ブース情報フォーム',
      description: '高輪ゲートウェイコンベンションセンター 4階での展示ブースのレイアウト、必要な設備、展示内容などを登録するためのフォームです。',
      icon: '🏪',
      path: '/forms/booth'
    },
    {
      id: 'sponsor',
      title: 'スポンサー申し込みフォーム',
      description: 'primeNumber DATA SUMMIT 2025のスポンサーシッププラン（Platinum・Gold・Silver）の選択、支払い情報などを登録するためのフォームです。',
      icon: '💰',
      path: '/forms/sponsor'
    },
    {
      id: 'logistics',
      title: '搬入出情報フォーム',
      description: '高輪ゲートウェイコンベンションセンター 4階への展示物の搬入出スケジュール（11月25日搬入）、車両情報などを登録するためのフォームです。',
      icon: '📦',
      path: '/forms/logistics'
    },
    {
      id: 'press',
      title: 'プレスフォーム',
      description: 'メディア関係者の登録、取材申請などを行うためのフォームです。',
      icon: '📰',
      path: '/forms/press'
    },
    {
      id: 'reception',
      title: 'ネットワーキングパーティー参加登録フォーム',
      description: 'primeNumber DATA SUMMIT 2025終了後に開催されるネットワーキングパーティーへの参加登録、食事の好みなどを登録するためのフォームです。',
      icon: '🍷',
      path: '/forms/reception'
    }
  ];

  return (
    <FormsContainer>
      <PageTitle>primeNumber DATA SUMMIT 2025 各種フォーム</PageTitle>
      
      <FormsGrid>
        {forms.map(form => (
          <FormCard to={form.path} key={form.id}>
            <FormIcon>{form.icon}</FormIcon>
            <FormTitle>{form.title}</FormTitle>
            <FormDescription>{form.description}</FormDescription>
            <FormButton>フォームを開く</FormButton>
          </FormCard>
        ))}
      </FormsGrid>
    </FormsContainer>
  );
};

export default FormsList;
