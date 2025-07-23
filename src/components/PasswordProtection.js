import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Inter', sans-serif;
`;

const PasswordForm = styled.form`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 16px;
  margin-bottom: 30px;
  color: #666;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const Button = styled.button`
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #0052a3;
  }
`;

const ErrorMessage = styled.p`
  color: #e53935;
  margin-top: 10px;
  font-size: 14px;
`;

const Logo = styled.img`
  max-width: 200px;
  margin-bottom: 30px;
`;

// パスワード保護コンポーネント
const PasswordProtection = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  
  // ローカルストレージからの認証状態の復元
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  // パスワード入力の処理
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };
  
  // フォーム送信の処理
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 正しいパスワード（実際の環境では環境変数などで管理することをお勧めします）
    const correctPassword = 'DataSummit_2025!';
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      setError('パスワードが正しくありません。もう一度お試しください。');
    }
  };
  
  // 認証済みの場合は子コンポーネントを表示
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  // 未認証の場合はパスワード入力フォームを表示
  return (
    <PasswordContainer>
      <PasswordForm onSubmit={handleSubmit}>
        <Logo src="/logo.png" alt="primeNumber DATA SUMMIT 2025" />
        <Title>primeNumber DATA SUMMIT 2025</Title>
        <Subtitle>このサイトはパスワードで保護されています</Subtitle>
        <Input
          type="password"
          placeholder="パスワードを入力してください"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">アクセス</Button>
      </PasswordForm>
    </PasswordContainer>
  );
};

export default PasswordProtection;
