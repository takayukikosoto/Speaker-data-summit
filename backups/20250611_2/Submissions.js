import React from 'react';
import styled from 'styled-components';
import { FaExternalLinkAlt } from 'react-icons/fa';

const SubmissionsContainer = styled.div`
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

const ImportantNote = styled.div`
  background-color: #e6efed; // 色を統一した薄い背景色
  border-left: 4px solid #0a7463; // 色を統一
  padding: 1rem;
  margin-bottom: 2rem;
`;

const EventTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  
  &:hover {
    background-color: #e6efed; // 色を統一した薄い背景色
  }
`;

const TableHeader = styled.th`
  background-color: #e6efed; // 色を統一した薄い背景色
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #dee2e6;
  position: sticky;
  top: 0;
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  vertical-align: top;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
  
  a {
    color: #0a7463;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    
    &:hover {
      text-decoration: underline;
    }
    
    svg {
      margin-left: 0.25rem;
      font-size: 0.8rem;
    }
  }
`;

const Submissions = () => {
  return (
    <SubmissionsContainer>
      <PageTitle>提出物</PageTitle>
      
      <ImportantNote>
        <p>※各種提出物のご確認をお願いいたします。期限を過ぎた場合、反映が間に合わない場合がございますので、お気をつけください。</p>
      </ImportantNote>

      <EventTable>
        <thead>
          <TableRow>
            <TableHeader>提出物</TableHeader>
            <TableHeader>締切日</TableHeader>
            <TableHeader>提出方法</TableHeader>
            <TableHeader>Platinum</TableHeader>
            <TableHeader>Gold</TableHeader>
            <TableHeader>Silver</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          <TableRow>
            <TableCell>ロゴデータ/会社情報提出シート/スポンサー費お見積り送付、講演情報確認シート送付</TableCell>
            <TableCell>8/1(金)</TableCell>
            <TableCell><a href="https://forms.gle/q9WWDok1nXCkmG5c9" target="_blank" rel="noopener noreferrer">会社情報提出フォーム <FaExternalLinkAlt /></a></TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ロゴデータ/会社情報提出シート締切、講演情報確認シート/講演者写真締切</TableCell>
            <TableCell>8/22(金)</TableCell>
            <TableCell>フォルダへ格納 / 申請フォーム</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>イベントサイト掲載情報チェック</TableCell>
            <TableCell>9月中旬</TableCell>
            <TableCell>メールにてご確認</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>招待状配布、イベントサイトオープン</TableCell>
            <TableCell>9月下旬</TableCell>
            <TableCell>郵送？ / オンラインでご確認</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>スポンサー費ご請求書送付</TableCell>
            <TableCell>9/30(火)</TableCell>
            <TableCell>メールにて送付</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>ブース情報確認シート送付、セッション環境確認シート送付</TableCell>
            <TableCell>10月中旬</TableCell>
            <TableCell>申請フォーム</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>―</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ブース情報確認シート締切、セッション環境確認シート締切、幕間CM締切、スポンサー費ご入金期限</TableCell>
            <TableCell>10/31(金)</TableCell>
            <TableCell>申請フォーム / フォルダへ格納 / 振込</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>セッション資料ご提出期限</TableCell>
            <TableCell>11/7(金)</TableCell>
            <TableCell>フォルダへ格納</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>―</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>当日ご案内資料送付</TableCell>
            <TableCell>11/17(月)</TableCell>
            <TableCell>フォルダへ格納</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>セッション資料FIX</TableCell>
            <TableCell>11/21(金)</TableCell>
            <TableCell>フォルダへ格納</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>―</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>事前荷物送付</TableCell>
            <TableCell>11/24(月)</TableCell>
            <TableCell>郵送？</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ブース搬入/セッティング</TableCell>
            <TableCell>11/25(火)</TableCell>
            <TableCell>現地参加</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>―</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>イベント本番</TableCell>
            <TableCell>11/26(水)</TableCell>
            <TableCell>現地参加</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>スポンサーオプション費ご請求書送付</TableCell>
            <TableCell>11/28(金)</TableCell>
            <TableCell>メールにてご確認</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>リード情報提供</TableCell>
            <TableCell>12/2(火)</TableCell>
            <TableCell>メールにてご確認</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>―</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>イベントレポート送付</TableCell>
            <TableCell>12/8(月)</TableCell>
            <TableCell>メールにてご確認</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>スポンサーオプション費ご入金期限</TableCell>
            <TableCell>12月末</TableCell>
            <TableCell>振込</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
            <TableCell>●</TableCell>
          </TableRow>
        </tbody>
      </EventTable>
      
      <div style={{ marginTop: '2rem' }}>
        <p>メール提出先: primenumber_sponsor2025@eventdesk.info</p>
        <p>ご不明な点がございましたら、上記メールアドレスまたは担当営業までお問い合わせください。</p>
      </div>
    </SubmissionsContainer>
  );
};

export default Submissions;
