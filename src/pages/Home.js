import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import NetworkBackground from '../components/NetworkBackground';
import LogoSVG from '../logo/SVG/logo.svg';
import { FaCalendarAlt, FaMapMarkerAlt, FaFileAlt, FaClipboardList, FaDownload, FaArrowRight, FaUsers, FaBuilding, FaEnvelope, FaGlobe, FaRegClock, FaRegCalendarAlt, FaUserTie, FaLink, FaTag, FaExternalLinkAlt } from 'react-icons/fa';

const MainContainer = styled.div`
  margin-top: 5rem;
`;

const HeroSection = styled.section`
  height: calc(100vh - 200px);
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 0 2rem;
  overflow: hidden;
  background-color: #0a7463;
  z-index: 0;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  color: white;
  position: relative;
  z-index: 2;
`;

// EventStatusコンポーネントを削除

const LogoContainer = styled.div`
  margin-bottom: 5rem; // 間隔をさらに広げるために5remに変更
  max-width: 600px;
  width: 100%;
`;

const Logo = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const HeroSubtitle = styled.h2`
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  font-weight: 400;
  margin-bottom: 2.5rem;
  max-width: 700px;
  line-height: 1.5;
  opacity: 0.9;
`;

const EventDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const EventDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
`;

const EventIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-right: 0.5rem;
  font-size: 1rem;
  color: white;
`;

const SpeakerPageLabel = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  padding: 0.8rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  background-color: #0a7463; // 色を統一
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #065446; // ホバー時は少し暗く
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  background-color: transparent;
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid white; // 緑の背景上なので白のボーダーに変更
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const SectionContainer = styled.section`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 50px;
    height: 4px;
    background-color: #0a7463; // 色を統一
    margin: 1rem auto 3rem;
  }
`;

const AboutText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 3rem;
  text-align: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2.5rem;
  justify-content: center;
`;

// 通常のLinkコンポーネントを使用するFeatureCard
const FeatureCard = styled(Link)`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 0;
    background-color: #0a7463; // 色を統一
    transition: height 0.3s ease;
  }
  
  &:hover::before {
    height: 100%;
  }
`;

// 提出物セクション用のスタイル
const SubmissionSection = styled.div`
  margin: 2rem 0;
`;

const SubmissionNote = styled.div`
  background-color: #e6efed;
  border-left: 4px solid #0a7463;
  padding: 1rem;
  margin-bottom: 2rem;
`;

// ページ内リンク用のFeatureCard（aタグベース）
const AnchorFeatureCard = styled.a`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 0;
    background-color: #0a7463; // 色を統一
    transition: height 0.3s ease;
  }
  
  &:hover::before {
    height: 100%;
  }
`;

const FeatureIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: #0a7463;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ArrowIcon = styled.span`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 1.2rem;
  color: #0a7463; // 色を統一
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

// 開催概要セクション用のスタイル
const EventSection = styled(SectionContainer)`
  margin: 3rem auto;
  background-color: white;
`;

const EventInfoContainer = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const EventInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const EventInfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  background-color: #0a7463;
  border-radius: 4px;
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

const EventTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
  
  a {
    color: #0066cc;
    text-decoration: underline;
    &:hover {
      color: #004080;
      text-decoration: none;
    }
  }
`;

const TableCellCenter = styled(TableCell)`
  text-align: center;
`;

// 提出物セクション用のスタイル
const SubmissionsSection = styled(SectionContainer)`
  margin: 3rem auto;
  background-color: white;
`;

const SubmissionsContainer = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const ImportantNote = styled.div`
  background-color: #e6efed; // 色を統一した薄い背景色
  border-left: 4px solid #0a7463; // 色を統一
  padding: 1rem;
  margin-bottom: 2rem;
`;

// 重複したHeroSectionを削除


const Home = () => {
  return (
    <MainContainer>
      <HeroSection>
        {/* NetworkBackgroundコンポーネントを一時的に非表示 */}
        {/* <NetworkBackground /> */}
        <HeroContent>
          <LogoContainer>
            <Logo src={LogoSVG} alt="primeNumber DATA SUMMIT 2025" />
          </LogoContainer>
          <HeroSubtitle>
            Humans trust, AI learns
          </HeroSubtitle>
          
          <EventDetails>
            <EventDetail>
              <EventIcon><FaCalendarAlt /></EventIcon>
              <span>2025年11月26日(水) 10:00-20:00</span>
            </EventDetail>
            <EventDetail>
              <EventIcon><FaMapMarkerAlt /></EventIcon>
              <span>
                <a href="https://www.takanawagateway-cc.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>
                  TAKANAWA GATEWAY Convention Center
                </a>
              </span>
            </EventDetail>
          </EventDetails>
          
          <SpeakerPageLabel>
            スピーカー専用ページ
          </SpeakerPageLabel>
          
          {/* 提出物の確認ボタンを削除 */}
        </HeroContent>
      </HeroSection>
      
      <SectionContainer>
        <SectionTitle>primeNumber DATA SUMMIT 2025について</SectionTitle>
        <AboutText>
          <h>こちらは「primeNumber DATA SUMMIT 2025」のスピーカー様専用ページです。</h>
	<p>各種のファイルのダウンロードや申請が行えます。</p>
        </AboutText>
        
        <FeaturesGrid>

          <FeatureCard to="/downloads">
            <FeatureIcon><FaDownload /></FeatureIcon>
            <FeatureTitle>資料ダウンロード</FeatureTitle>
            <FeatureDescription>
              pN社のロゴデータやスピーカー説明会資料等ダウンロードいただけます。
            </FeatureDescription>
            <ArrowIcon>→</ArrowIcon>
          </FeatureCard>
          
          <FeatureCard to="/submissions-and-forms">
            <FeatureIcon><FaFileAlt /></FeatureIcon>
            <FeatureTitle>提出物・各種申請フォーム</FeatureTitle>
            <FeatureDescription>
              セッション等で必要な情報をご提出いただきます。
            </FeatureDescription>
            <ArrowIcon>→</ArrowIcon>
          </FeatureCard>
        </FeaturesGrid>
      </SectionContainer>
      
      {/* スケジュールセクション */}
      <EventSection>
        <EventInfoContainer>
          <SectionTitle id="schedule">スケジュール</SectionTitle>
          {/* CSVデータを読み込むためのステート */}
          {(() => {
            const [scheduleData, setScheduleData] = useState([]);
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);
            
            // CSVファイルを読み込む関数
            useEffect(() => {
              fetch('/schedule.csv')
                .then(response => {
                  if (!response.ok) {
                    throw new Error('CSVファイルの読み込みに失敗しました');
                  }
                  return response.text();
                })
                .then(csvText => {
                  // 適切なCSV解析関数
                  const parseCSV = (text) => {
                    const result = [];
                    const lines = text.split('\n');
                    let currentRow = [];
                    let currentField = '';
                    let inQuotes = false;
                    
                    for (let i = 0; i < lines.length; i++) {
                      const line = lines[i];
                      
                      for (let j = 0; j < line.length; j++) {
                        const char = line[j];
                        
                        if (char === '"') {
                          if (inQuotes && line[j + 1] === '"') {
                            // エスケープされた引用符
                            currentField += '"';
                            j++; // 次の文字をスキップ
                          } else {
                            // 引用符の開始/終了
                            inQuotes = !inQuotes;
                          }
                        } else if (char === ',' && !inQuotes) {
                          // フィールドの区切り
                          currentRow.push(currentField.trim());
                          currentField = '';
                        } else {
                          currentField += char;
                        }
                      }
                      
                      if (inQuotes) {
                        // 引用符内で改行がある場合
                        currentField += '\n';
                      } else {
                        // 行の終了
                        currentRow.push(currentField.trim());
                        if (currentRow.some(field => field.length > 0)) {
                          result.push(currentRow);
                        }
                        currentRow = [];
                        currentField = '';
                      }
                    }
                    
                    return result;
                  };
                  
                  const parsedData = parseCSV(csvText);
                  if (parsedData.length > 0) {
                    const headers = parsedData[0];
                    const data = parsedData.slice(1).map(row => {
                      const entry = {};
                      headers.forEach((header, index) => {
                        entry[header] = row[index] || '';
                      });
                      return entry;
                    });
                    setScheduleData(data);
                  }
                  setLoading(false);
                })
                .catch(err => {
                  console.error('エラー:', err);
                  setError(err.message);
                  setLoading(false);
                });
            }, []);
            
            return (
              <EventTable>
                <thead>
                  <TableRow>
                    <TableHeader>締切日</TableHeader>
                    <TableHeader>提出物</TableHeader>
                  </TableRow>
                </thead>
                <tbody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan="2">データを読み込み中...</TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan="2">エラー: {error}</TableCell>
                    </TableRow>
                  ) : (
                    scheduleData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row['締切日']}</TableCell>
                        <TableCell>{row['提出物']}</TableCell>
                      </TableRow>
                    ))
                  )}
                </tbody>
              </EventTable>
            );
          })()}
        </EventInfoContainer>
      </EventSection>
      
      {/* 提出物セクション - 一時的に非表示 */}
      {/* 
      <SubmissionsSection id="submissions-section">
        <SubmissionsContainer>
          <SectionTitle>提出物</SectionTitle>
          
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
                <TableCell>スポンサー説明会</TableCell>
                <TableCell>10月初旬</TableCell>
                <TableCell>オンライン会議</TableCell>
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
      </SubmissionsSection>
      */}
      

      
      {/* イベント情報セクション */}
      <EventSection>
        <EventInfoContainer>
          <SectionTitle>イベント情報</SectionTitle>
          <EventInfoGrid>
            <EventInfoItem>
              <IconWrapper>
                <FaTag />
              </IconWrapper>
              <InfoContent>
                <InfoTitle>イベント名</InfoTitle>
                <InfoText>primeNumber DATA SUMMIT 2025</InfoText>
              </InfoContent>
            </EventInfoItem>
            
            <EventInfoItem>
              <IconWrapper>
                <FaCalendarAlt />
              </IconWrapper>
              <InfoContent>
                <InfoTitle>開催日時</InfoTitle>
                <InfoText>2025年11月26日（水）10:00-20:00</InfoText>
              </InfoContent>
            </EventInfoItem>
            
            <EventInfoItem>
              <IconWrapper>
                <FaMapMarkerAlt />
              </IconWrapper>
              <InfoContent>
                <InfoTitle>会場情報</InfoTitle>
                <InfoText>
                  TAKANAWA GATEWAY Convention Center<br />
                  〒108-0074 東京都港区高輪3-13-1
                </InfoText>
              </InfoContent>
            </EventInfoItem>
            
            <EventInfoItem>
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
            </EventInfoItem>
            
            <EventInfoItem>
              <IconWrapper>
                <FaUserTie />
              </IconWrapper>
              <InfoContent>
                <InfoTitle>参加対象</InfoTitle>
                <InfoText>データ利活用に関わる全ての方々</InfoText>
              </InfoContent>
            </EventInfoItem>
            
            <EventInfoItem>
              <IconWrapper>
                <FaUsers />
              </IconWrapper>
              <InfoContent>
                <InfoTitle>申込予定人数</InfoTitle>
                <InfoText>3,000名（事前登録制）</InfoText>
              </InfoContent>
            </EventInfoItem>
            
            <EventInfoItem>
              <IconWrapper>
                <FaBuilding />
              </IconWrapper>
              <InfoContent>
                <InfoTitle>主催</InfoTitle>
                <InfoText>株式会社primeNumber</InfoText>
              </InfoContent>
            </EventInfoItem>
          </EventInfoGrid>
        </EventInfoContainer>
      </EventSection>
      
      {/* お問い合わせセクション */}
      <EventSection>
        <EventInfoContainer>
          <SectionTitle>お問い合わせ</SectionTitle>
          <EventInfoGrid>
            <EventInfoItem>
              <IconWrapper>
                <FaEnvelope />
              </IconWrapper>
              <InfoContent>
                <InfoTitle>お問い合わせ</InfoTitle>
                <InfoText>スピーカー事務局: primenumber_speaker2025@eventdesk.info</InfoText>
              </InfoContent>
            </EventInfoItem>
            
            {/* 公式サイトの項目を削除 */}
          </EventInfoGrid>
        </EventInfoContainer>
      </EventSection>
    </MainContainer>
  );
};

export default Home;
