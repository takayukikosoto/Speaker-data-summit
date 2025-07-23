import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';

/**
 * 管理ページを保護するためのラッパーコンポーネント
 * 認証済みの場合は子コンポーネントを表示し、未認証の場合はログイン画面を表示する
 */
const AdminProtection = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // コンポーネントマウント時に認証状態を確認
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = localStorage.getItem('adminAuthenticated') === 'true';
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
    return <AdminLogin onLogin={handleLogin} />;
  }
  
  // 認証済みの場合は子コンポーネントを表示
  return children;
};

export default AdminProtection;
