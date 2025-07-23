import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { formService } from '../utils/supabaseService';

const FormsContainer = styled.div`
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

const FormSection = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #0a7463; // 色を統一
  padding-bottom: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const FormCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FormTitle = styled.h3`
  font-size: 1.2rem;
  color: #0a7463; // 色を統一
  margin-bottom: 1rem;
`;

const FormDescription = styled.p`
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #666;
`;

const FormLink = styled.a`
  display: inline-block;
  background-color: #0a7463; // 色を統一
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;

  &:hover {
    background-color: #065446; // ホバー時は少し暗く
  }
`;

const DeadlineInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #666;
`;

const Deadline = styled.span`
  background-color: #e9ecef;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: ${props => props.$urgent ? '#dc3545' : '#666'};
  font-weight: ${props => props.$urgent ? 'bold' : 'normal'};
`;

const ImportantNote = styled.div`
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const GoogleFormEmbed = styled.iframe`
  width: 100%;
  height: 600px;
  border: none;
  margin-top: 1rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  
  &:hover {
    color: #0a7463; // 色を統一
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
`;

const ErrorContainer = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
`;

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // カテゴリーごとにフォームをグループ化する関数
  const groupFormsByCategory = (forms) => {
    const groupedForms = {};
    
    forms.forEach(form => {
      if (!groupedForms[form.category]) {
        groupedForms[form.category] = [];
      }
      groupedForms[form.category].push(form);
    });
    
    return groupedForms;
  };
  
  // カテゴリー名を日本語に変換する関数
  const getCategoryName = (category) => {
    const categoryMap = {
      'sponsor': '各種申請フォーム',
      'speaker': '講演者向けフォーム',
      'press': 'プレス向けフォーム',
      'general': '一般フォーム'
    };
    
    return categoryMap[category] || 'その他のフォーム';
  };
  
  // フォームデータを取得
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const formsData = await formService.getAllForms();
        setForms(formsData);
        setLoading(false);
      } catch (err) {
        console.error('フォームデータの取得に失敗しました:', err);
        setError('フォームデータの読み込み中にエラーが発生しました。');
        setLoading(false);
      }
    };
    
    fetchForms();
  }, []);
  
  // フォームを開く処理
  const handleOpenForm = (form) => {
    setSelectedForm(form);
    setShowModal(true);
  };
  
  // モーダルを閉じる処理
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedForm(null);
  };
  
  // 期限が近いかどうかを判定する関数
  const isDeadlineUrgent = (deadline) => {
    if (!deadline) return false;
    
    // 現在の日付を取得
    const now = new Date();
    
    // 締切日を解析（例: "2025年8月22日（金）"）
    const match = deadline.match(/([0-9]{4})年([0-9]{1,2})月([0-9]{1,2})日/);
    if (!match) return false;
    
    const year = parseInt(match[1]);
    const month = parseInt(match[2]) - 1; // JavaScriptの月は0から始まる
    const day = parseInt(match[3]);
    
    const deadlineDate = new Date(year, month, day);
    
    // 締切日までの日数を計算
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 14日（2週間）以内なら緊急と判定
    return diffDays <= 14 && diffDays >= 0;
  };
  
  // フォームをカテゴリーごとにグループ化
  const groupedForms = groupFormsByCategory(forms);
  
  return (
    <FormsContainer>
      <PageTitle>primeNumber DATA SUMMIT 2025 各種フォーム</PageTitle>
      
      <ImportantNote>
        <p>※ 各フォームの提出期限にご注意ください。期限を過ぎると提出できない場合があります。</p>
        <p>※ お問い合わせは <a href="mailto:primenumber_speaker2025@eventdesk.info">primenumber_speaker2025@eventdesk.info</a> までお願いいたします。</p>
      </ImportantNote>
      
      {loading ? (
        <LoadingContainer>
          <p>フォームデータを読み込み中...</p>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <p>{error}</p>
        </ErrorContainer>
      ) : (
        Object.keys(groupedForms).map(category => (
          <FormSection key={category}>
            <SectionTitle>{getCategoryName(category)}</SectionTitle>
            <FormGrid>
              {groupedForms[category].map(form => (
                <FormCard key={form.id}>
                  <FormTitle>{form.title}</FormTitle>
                  <FormDescription>
                    {form.description}
                  </FormDescription>
                  {form.deadline && (
                    <DeadlineInfo>
                      <Deadline $urgent={isDeadlineUrgent(form.deadline)}>
                        提出期限: {form.deadline}
                      </Deadline>
                      {form.isRequired && <span>必須提出物</span>}
                    </DeadlineInfo>
                  )}
                  <FormLink onClick={() => handleOpenForm(form)}>フォームを開く</FormLink>
                </FormCard>
              ))}
            </FormGrid>
          </FormSection>
        ))
      )}
      
      {showModal && selectedForm && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            <h2>{selectedForm.title}</h2>
            <p>{selectedForm.description}</p>
            {selectedForm.deadline && (
              <p><strong>提出期限:</strong> {selectedForm.deadline}</p>
            )}
            <GoogleFormEmbed 
              src={selectedForm.formUrl} 
              title={selectedForm.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </ModalContent>
        </Modal>
      )}
    </FormsContainer>
  );
};

export default Forms;
