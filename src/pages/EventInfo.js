import React from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaBuilding, FaEnvelope, FaGlobe, FaRegClock, FaRegCalendarAlt, FaUserTie, FaFileAlt, FaLink } from 'react-icons/fa';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 8rem auto 5rem;
  padding: 0 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  color: #333;
`;

const EventTheme = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 3rem;
  text-align: center;
  color: #0a7463; // 色を統一
  
  &:after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background-color: #0a7463; // 色を統一
    margin: 1rem auto 0;
  }
`;

const Section = styled.section`
  margin-bottom: 4rem;
  background-color: white;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
  border-bottom: 2px solid #0a7463; // 色を統一
  padding-bottom: 0.8rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  background-color: #0a7463; // 色を統一
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  color: white;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const InfoText = styled.p`
  color: #666;
  line-height: 1.6;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: #f8f8f8;
  color: #333;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #666;
`;

const EventInfo = () => {
  return (
    <PageContainer>
      <PageTitle>primeNumber DATA SUMMIT 2025</PageTitle>
      
      <Section>
        <SectionTitle>イベント情報</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <IconWrapper>
              <FaCalendarAlt />
            </IconWrapper>
            <InfoContent>
              <InfoTitle>開催日時</InfoTitle>
              <InfoText>2025年11月26日（水）10:00-19:00</InfoText>
            </InfoContent>
          </InfoItem>
          
          <InfoItem>
            <IconWrapper>
              <FaMapMarkerAlt />
            </IconWrapper>
            <InfoContent>
              <InfoTitle>開催場所</InfoTitle>
              <InfoText>TAKANAWA GATEWAY Convention Center</InfoText>
            </InfoContent>
          </InfoItem>
          
          <InfoItem>
            <IconWrapper>
              <FaUsers />
            </IconWrapper>
            <InfoContent>
              <InfoTitle>参加予定人数</InfoTitle>
              <InfoText>約1,500名（事前登録制）</InfoText>
            </InfoContent>
          </InfoItem>
          
          <InfoItem>
            <IconWrapper>
              <FaBuilding />
            </IconWrapper>
            <InfoContent>
              <InfoTitle>主催</InfoTitle>
              <InfoText>primeNumber株式会社</InfoText>
            </InfoContent>
          </InfoItem>
        </InfoGrid>
      </Section>
      
      <Section>
        <SectionTitle>対象者</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <IconWrapper>
              <FaUserTie />
            </IconWrapper>
            <InfoContent>
              <InfoTitle>参加対象</InfoTitle>
              <InfoText>
                データ利活用に関わる全ての方々
              </InfoText>
            </InfoContent>
          </InfoItem>
        </InfoGrid>
      </Section>
      

      
      <Section>
        <SectionTitle>重要な日程</SectionTitle>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>日程</TableHeader>
              <TableHeader>内容</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            <TableRow>
              <TableCell>2025年6月18日（水）</TableCell>
              <TableCell>スポンサー申込締切</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025年8月1日（金）</TableCell>
              <TableCell>ロゴデータ/会社情報提出シート/講演情報確認シート送付</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025年9月2日（月）</TableCell>
              <TableCell>出展者マニュアル送付</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025年9月9日（月）</TableCell>
              <TableCell>出展者説明会</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025年10月11日（金）</TableCell>
              <TableCell>各種申請書類提出期限</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025年11月25日（火）13:00-18:00</TableCell>
              <TableCell>搬入日</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025年11月26日（水）10:00-19:00</TableCell>
              <TableCell>開催日</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025年11月26日（水）19:00-21:00</TableCell>
              <TableCell>搬出日</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025年12月8日（月）</TableCell>
              <TableCell>イベントレポート送付</TableCell>
            </TableRow>
          </tbody>
        </Table>
      </Section>
      
      <Section>
        <SectionTitle>フォーム提出について</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <IconWrapper>
              <FaFileAlt />
            </IconWrapper>
            <InfoContent>
              <InfoText>
                フォーム提出はこのホームページの各種申請フォームからお申し込みください。
              </InfoText>
            </InfoContent>
          </InfoItem>
          <InfoItem>
            <IconWrapper>
              <FaLink />
            </IconWrapper>
            <InfoContent>
              <InfoTitle>各種申請フォームページ</InfoTitle>
              <InfoText>
                <a href="/forms" style={{ color: '#0a7463', textDecoration: 'underline' }}>
                  各種申請フォームはこちら
                </a>
              </InfoText>
            </InfoContent>
          </InfoItem>
        </InfoGrid>
      </Section>
      
      <Section>
        <SectionTitle>会場・アクセス</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <IconWrapper>
              <FaMapMarkerAlt />
            </IconWrapper>
            <InfoContent>
              <InfoTitle>会場情報</InfoTitle>
              <InfoText>
                TAKANAWA GATEWAY Convention Center<br />
                〈108-0074 東京都港区高輪3-13-1
              </InfoText>
            </InfoContent>
          </InfoItem>
          
          <InfoItem>
            <IconWrapper>
              <FaMapMarkerAlt />
            </IconWrapper>
            <InfoContent>
              <InfoTitle>交通アクセス</InfoTitle>
              <InfoText>
                ・「JR高輪ゲートウェイ駅」から徒歩3分<br />
                ・JR山手線・京浜東北線「高輪ゲートウェイ駅」下車
              </InfoText>
            </InfoContent>
          </InfoItem>
        </InfoGrid>
      </Section>
      
      <Section>
        <SectionTitle>お問い合わせ</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <IconWrapper>
              <FaEnvelope />
            </IconWrapper>
            <InfoContent>
              <InfoTitle>メール</InfoTitle>
              <InfoText>Email: datasummit2025_primenumber@eventdesk.info</InfoText>
            </InfoContent>
          </InfoItem>
          
          <InfoItem>
            <IconWrapper>
              <FaGlobe />
            </IconWrapper>
            <InfoContent>
              <InfoTitle>公式サイト</InfoTitle>
              <InfoText>近日公開予定</InfoText>
            </InfoContent>
          </InfoItem>
        </InfoGrid>
      </Section>
    </PageContainer>
  );
};

export default EventInfo;
