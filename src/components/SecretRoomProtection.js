import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ProtectionContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #ffebee;
  border-radius: 4px;
  text-align: center;
`;

const SecretRoomLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 秘密の部屋のパスワード（実際の環境では環境変数や安全な場所に保存すべき）
  const SECRET_PASSWORD = 'secret2025';
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // パスワードの検証
    setTimeout(() => {
      if (password === SECRET_PASSWORD) {
        // ログイン成功
        localStorage.setItem('secretRoomAuthenticated', 'true');
        onLogin();
      } else {
        // ログイン失敗
        setError('秘密の部屋へのアクセスが拒否されました。');
      }
      setLoading(false);
    }, 500);
  };
  
  return (
    <ProtectionContainer>
      <Title>秘密の部屋 - アクセス認証</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="secret-password">特別パスワード</Label>
          <Input
            type="password"
            id="secret-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? '認証中...' : '入室する'}
        </Button>
      </Form>
    </ProtectionContainer>
  );
};

const SecretRoomProtection = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // コンポーネントマウント時に認証状態を確認
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem('secretRoomAuthenticated') === 'true';
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // ログイン成功時の処理
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  // ローディング中の表示
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>読み込み中...</p>
      </div>
    );
  }
  
  // 未認証の場合はログイン画面を表示
  if (!isAuthenticated) {
    return <SecretRoomLogin onLogin={handleLogin} />;
  }
  
  // 認証済みの場合は子コンポーネントを表示
  return children;
};

export default SecretRoomProtection;
