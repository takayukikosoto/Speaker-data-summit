import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #000;
  color: #fff;
  padding: 5rem 2rem 3rem;
  margin-top: 8rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
`;

const FooterLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #fff;
  }
`;

const ContactInfo = styled.div`
  margin-top: 0.5rem;
  
  a {
    color: #aaa;
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: #fff;
    }
  }
`;

const Copyright = styled.div`
  max-width: 1200px;
  margin: 4rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid #333;
  text-align: center;
  font-size: 0.8rem;
  color: #777;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>primeNumber DATA SUMMIT 2025</FooterTitle>
          <p style={{ color: '#aaa', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Connect Data, Transform Future。
            あらゆるデータを、ビジネスの力に変える。
          </p>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>リンク</FooterTitle>
          <FooterLink to="/">ホーム</FooterLink>
          {/* 開催概要のリンクは非表示のまま */}
          {/* <FooterLink to="/event-info">開催概要</FooterLink> */}
          <FooterLink to="/downloads">資料ダウンロード</FooterLink>
          <FooterLink to="/submissions-and-forms">提出物・各種申請フォーム</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>お問い合わせ</FooterTitle>
          <ContactInfo>
            <p style={{ color: '#aaa', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
              primeNumber DATA SUMMIT 2025 運営事務局
            </p>
            <p style={{ color: '#aaa', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
              Email: <a href="mailto:datasummit2025_primenumber@eventdesk.info">datasummit2025_primenumber@eventdesk.info</a>
            </p>
            <p style={{ color: '#aaa', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
              <Link to="/admin" style={{ color: '#aaa', textDecoration: 'none' }}>管理ページはこちら</Link>
            </p>
          </ContactInfo>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        <p>&copy; {new Date().getFullYear()} primeNumber DATA SUMMIT 2025. All rights reserved.</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
