import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  z-index: 1000;
  transition: all 0.3s ease;
  padding: ${props => props.scrolled ? '0.8rem 2rem' : '1.5rem 2rem'};
  box-shadow: ${props => props.scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  
  @media (max-width: 768px) {
    padding: ${props => props.scrolled ? '0.8rem 1rem' : '1.2rem 1rem'};
  }
`;

const NavInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: ${props => props.scrolled ? '1.3rem' : '1.5rem'};
  font-weight: 700;
  color: #000;
  text-decoration: none;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    width: 80%;
    height: 100vh;
    background: white;
    padding: 5rem 2rem 2rem;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    gap: 1.5rem;
    z-index: 1001;
    overflow-y: auto;
    transform: translateX(${props => props.isOpen ? '0' : '100%'});
    transition: transform 0.3s ease-in-out;
  }
`;

const NavLink = styled(Link)`
  color: #000;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  padding: 0.3rem 0;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #0a7463; // 色を統一
    transition: width 0.3s ease;
  }
  
  &:hover:after, &.active:after {
    width: 100%;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid #f0f0f0;
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1005;
  padding: 0.5rem;
  position: relative;
  outline: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 21px;
  }
  
  &:focus {
    outline: none;
  }
`;

const MenuBar = styled.span`
  display: block;
  height: 3px;
  width: 100%;
  background-color: #000;
  border-radius: 3px;
  transition: all 0.3s ease;
  
  &:nth-child(1) {
    transform: ${props => props.isOpen ? 'rotate(45deg) translate(5px, 6px)' : 'rotate(0)'};
  }
  
  &:nth-child(2) {
    opacity: ${props => props.isOpen ? '0' : '1'};
  }
  
  &:nth-child(3) {
    transform: ${props => props.isOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'rotate(0)'};
  }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // スクロール検知
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // メニュー状態変更時の処理
  useEffect(() => {
    console.log('Menu state changed:', isOpen);
    
    // モバイルメニューが開いているときはスクロールを無効にする
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // ページ遷移時にメニューを閉じる
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  // メニュー切り替え関数 - useCallbackでメモ化
  const toggleMenu = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setIsOpen(prevState => {
      const newState = !prevState;
      console.log('Toggling menu, new state will be:', newState);
      return newState;
    });
  }, []);
  
  // メニューを閉じる関数 - useCallbackでメモ化
  const closeMenu = useCallback(() => {
    console.log('Closing menu');
    setIsOpen(false);
  }, []);

  // デバッグ用のクリックハンドラ
  const handleButtonClick = (e) => {
    console.log('Button clicked');
    toggleMenu(e);
  };
  
  // スケジュールへのスクロールハンドラ
  const scrollToSchedule = (e) => {
    e.preventDefault();
    closeMenu();
    
    const scheduleElement = document.getElementById('schedule');
    if (scheduleElement) {
      window.scrollTo({
        top: scheduleElement.offsetTop - 100, // ヘッダーの高さを考慮してオフセット
        behavior: 'smooth'
      });
    } else {
      // ホームページにいない場合は、ホームページに移動してからスケジュールにスクロール
      if (location.pathname !== '/') {
        window.location.href = '/#schedule';
      }
    }
  };

  return (
    <>
      {/* オーバーレイ - メニュー開閉状態に応じて表示/非表示 */}
      <Overlay isOpen={isOpen} onClick={closeMenu} />
      
      {/* ナビゲーションバー */}
      <NavContainer scrolled={scrolled}>
        <NavInner>
          {/* ロゴ */}
          <Logo to="/" scrolled={scrolled}>
            primeNumber DATA SUMMIT 2025
          </Logo>
          
          {/* モバイルメニューボタン */}
          <MobileMenuButton 
            onClick={handleButtonClick}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <MenuBar isOpen={isOpen} />
            <MenuBar isOpen={isOpen} />
            <MenuBar isOpen={isOpen} />
          </MobileMenuButton>
          
          {/* ナビゲーションリンク */}
          <NavLinks isOpen={isOpen}>
            <NavLink to="/" onClick={closeMenu} className={location.pathname === '/' ? 'active' : ''}>ホーム</NavLink>
            <NavLink to="/#schedule" onClick={scrollToSchedule}>スケジュール</NavLink>
            {/* 開催概要のリンクは非表示のまま */}
            {/* <NavLink to="/event-info" onClick={closeMenu} className={location.pathname === '/event-info' ? 'active' : ''}>開催概要</NavLink> */}
            <NavLink to="/downloads" onClick={closeMenu} className={location.pathname === '/downloads' ? 'active' : ''}>資料ダウンロード</NavLink>
            <NavLink to="/submissions-and-forms" onClick={closeMenu} className={location.pathname === '/submissions-and-forms' ? 'active' : ''}>提出物・各種申請フォーム</NavLink>
            {/* <NavLink to="/faq" onClick={closeMenu} className={location.pathname === '/faq' ? 'active' : ''}>よくある質問</NavLink> */}
            {/* <NavLink to="/admin" onClick={closeMenu} className={location.pathname === '/admin' ? 'active' : ''}>管理</NavLink> */}
          </NavLinks>
        </NavInner>
      </NavContainer>
    </>
  );
};

export default Navbar;
