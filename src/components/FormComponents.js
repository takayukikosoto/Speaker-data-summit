import React from 'react';
import styled from 'styled-components';

// フォームコンテナ
export const FormContainer = styled.div`
  max-width: 800px;
  margin: 8rem auto 4rem;
  padding: 2.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
`;

// フォームタイトル
export const FormTitle = styled.h1`
  font-size: 2rem;
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
    margin: 1rem auto;
  }
`;

// フォームの説明
export const FormDescription = styled.p`
  margin-bottom: 2.5rem;
  text-align: center;
  font-size: 1.1rem;
  color: #666;
`;

// フォームグループ
export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

// フォームラベル
export const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
`;

// 必須マーク
export const RequiredMark = styled.span`
  color: #e53e3e;
  margin-left: 0.25rem;
`;

// 入力フィールド
export const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
`;

// テキストエリア
export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
`;

// セレクト
export const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
`;

// チェックボックスコンテナ
export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

// チェックボックス
export const FormCheckbox = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
`;

// ラジオボタンコンテナ
export const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

// ラジオオプション
export const RadioOption = styled.div`
  display: flex;
  align-items: center;
`;

// ラジオボタン
export const FormRadio = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
`;

// 送信ボタン
export const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
  
  &:hover {
    background-color: #333;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

// エラーメッセージ
export const ErrorMessage = styled.p`
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

// ヘルプテキスト
export const HelpText = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
`;

// フォームセクション
export const FormSection = styled.div`
  margin-bottom: 2.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 2rem;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

// セクションタイトル
export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

// 2カラムレイアウト
export const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// ファイルアップロードエリア
export const FileUploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 4px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #000;
  }
`;

// ファイルアップロード入力
export const FileInput = styled.input`
  display: none;
`;

// ファイルアップロードラベル
export const FileInputLabel = styled.label`
  cursor: pointer;
  display: block;
  font-weight: 500;
`;

// ファイルアップロードアイコン
export const FileUploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

// ファイル情報
export const FileInfo = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 削除ボタン
export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

// 成功メッセージ
export const SuccessMessage = styled.div`
  background-color: #f0fff4;
  border-left: 4px solid #48bb78;
  padding: 1rem;
  margin-bottom: 2rem;
  color: #2f855a;
`;

// 注意メッセージ
export const WarningMessage = styled.div`
  background-color: #fffaf0;
  border-left: 4px solid #ed8936;
  padding: 1rem;
  margin-bottom: 2rem;
  color: #c05621;
`;

// フォームステップナビゲーション
export const StepNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

// 前へボタン
export const PrevButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #f8f9fa;
  color: #000;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #eee;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 次へボタン
export const NextButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #333;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// ステップインジケーター
export const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
`;

// ステップアイテム
export const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 1rem;
    width: 100%;
    height: 2px;
    background-color: ${props => props.active ? '#000' : '#ddd'};
    left: 50%;
  }
`;

// ステップ番号
export const StepNumber = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${props => props.active ? '#000' : '#ddd'};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  z-index: 1;
`;

// ステップラベル
export const StepLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.active ? '#000' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
`;
