import React from 'react';
import styled from 'styled-components';

const ScheduleContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #00A99D;
  margin-bottom: 2rem;
  text-align: center;
`;

const ScheduleSection = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #00A99D;
  padding-bottom: 0.5rem;
`;

const Timeline = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  
  &::after {
    content: '';
    position: absolute;
    width: 6px;
    background-color: #00A99D;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -3px;
    
    @media (max-width: 768px) {
      left: 31px;
    }
  }
`;

const TimelineItem = styled.div`
  padding: 10px 40px;
  position: relative;
  background-color: inherit;
  width: 50%;
  
  &:nth-child(odd) {
    left: 0;
  }
  
  &:nth-child(even) {
    left: 50%;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding-left: 70px;
    padding-right: 25px;
    
    &:nth-child(odd), &:nth-child(even) {
      left: 0;
    }
  }
`;

const TimelineContent = styled.div`
  padding: 20px 30px;
  background-color: white;
  position: relative;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TimelineDate = styled.div`
  font-weight: bold;
  color: #00A99D;
  margin-bottom: 0.5rem;
`;

const TimelineTitle = styled.h3`
  margin: 0 0 0.5rem 0;
`;

const TimelineDescription = styled.p`
  margin: 0;
`;

const ImportantNote = styled.div`
  background-color: #e6f7f6;
  border-left: 4px solid #00A99D;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const Schedule = () => {
  return (
    <ScheduleContainer>
      <PageTitle>スケジュール</PageTitle>
      
      <ImportantNote>
        <p>※ スケジュールは変更になる場合がございます。最新情報は随時更新いたします。</p>
      </ImportantNote>

      <ScheduleSection>
        <SectionTitle>イベント準備スケジュール</SectionTitle>
        <Timeline>
          <TimelineItem>
            <TimelineContent>
              <TimelineDate>2025年4月</TimelineDate>
              <TimelineTitle>出展社・スポンサー募集開始</TimelineTitle>
              <TimelineDescription>公式サイトにて募集開始</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <TimelineDate>2025年6月18日</TimelineDate>
              <TimelineTitle>スポンサー申込締切</TimelineTitle>
              <TimelineDescription>各種スポンサープランの申込期限</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <TimelineDate>2025年8月1日（金）</TimelineDate>
              <TimelineTitle>ロゴデータ/会社情報提出シート/講演情報確認シート送付</TimelineTitle>
              <TimelineDescription>各種情報提出用シートの送付</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <TimelineDate>2025年8月22日（金）</TimelineDate>
              <TimelineTitle>ロゴデータ/会社情報提出シート/講演情報確認シート/講演者写真締切</TimelineTitle>
              <TimelineDescription>各種情報提出の締切日</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <TimelineDate>2025年9月下旬</TimelineDate>
              <TimelineTitle>イベントサイトオープン</TimelineTitle>
              <TimelineDescription>公式ウェブサイトの公開</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <TimelineDate>2025年10月中旬</TimelineDate>
              <TimelineTitle>セッション環境確認シート送付</TimelineTitle>
              <TimelineDescription>講演環境確認用シートの送付</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <TimelineDate>2025年10月31日（金）</TimelineDate>
              <TimelineTitle>セッション環境確認シート締切</TimelineTitle>
              <TimelineDescription>講演環境の確認情報提出期限</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <TimelineDate>2025年11月7日（金）</TimelineDate>
              <TimelineTitle>セッション資料/配布資料PDF 提出期限</TimelineTitle>
              <TimelineDescription>講演資料と配布資料の提出期限</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <TimelineDate>2025年11月17日（月）</TimelineDate>
              <TimelineTitle>当日ご案内資料送付・配布資料PDF FIX</TimelineTitle>
              <TimelineDescription>当日の案内資料送付と配布資料の確定</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <TimelineDate>2025年11月21日（金）</TimelineDate>
              <TimelineTitle>セッション資料FIX</TimelineTitle>
              <TimelineDescription>講演資料の最終確定版提出</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <TimelineDate>2025年11月25日（火）</TimelineDate>
              <TimelineTitle>セッションリハーサル（希望制）・出展社搬入日</TimelineTitle>
              <TimelineDescription>リハーサル実施および搬入作業（16:00頃から）</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <TimelineDate>2025年11月26日（水）</TimelineDate>
              <TimelineTitle>primeNumber DATA SUMMIT 2025 開催</TimelineTitle>
              <TimelineDescription>高輪ゲートウェイコンベンションセンター 4階にて開催 (10:00-19:00)</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem>
            <TimelineContent>
              <TimelineDate>2025年12月8日（月）</TimelineDate>
              <TimelineTitle>イベントレポート送付</TimelineTitle>
              <TimelineDescription>イベント結果のレポート送付</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          

        </Timeline>
      </ScheduleSection>

      <ScheduleSection>
        <SectionTitle>イベント当日スケジュール（11月26日）</SectionTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6', backgroundColor: '#f8f9fa' }}>時間</th>
              <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6', backgroundColor: '#f8f9fa' }}>内容</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>9:00 - 10:00</td>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>受付開始・出展社準備</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>10:00 - 10:30</td>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>オープニング・主催者挨拶</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>10:30 - 12:00</td>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>KEYNOTE（基調講演）</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>12:00 - 13:00</td>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>ランチタイム・プラチナスポンサーセッション</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>13:00 - 14:30</td>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>User Session（ユーザー事例セッション）</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>14:30 - 15:30</td>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>シアターセッション（スポンサー企業セッション）</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>15:30 - 17:00</td>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>Special Talk（スペシャルトーク）</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>17:00 - 17:30</td>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>クロージング</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>17:30 - 19:00</td>
              <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>ネットワーキングパーティー（事前招待制）</td>
            </tr>
          </tbody>
        </table>
      </ScheduleSection>
    </ScheduleContainer>
  );
};

export default Schedule;
