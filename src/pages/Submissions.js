import React, { useState, useEffect } from 'react';
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

const TableCellCenter = styled(TableCell)`
  text-align: center;
`;

const Submissions = () => {
  return (
    <SubmissionsContainer>
      <PageTitle>提出物</PageTitle>
      
      <ImportantNote>
        <p>※各種提出物のご確認をお願いいたします。期限を過ぎた場合、反映が間に合わない場合がございますので、お気をつけください。</p>
      </ImportantNote>

      {/* CSVデータを読み込むためのステート */}
      {(() => {
        const [submissionsData, setSubmissionsData] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        
        // CSVファイルを読み込む関数
        useEffect(() => {
          fetch('/teishutu.csv')
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
              const headers = parsedData[0];
              const data = parsedData.slice(1).map(row => {
                const entry = {};
                headers.forEach((header, index) => {
                  entry[header] = row[index] || '';
                });
                return entry;
              });
              
              // 注釈行を除外
              const filteredData = data.filter(row => {
                // 注釈行は提出物が「※」で始まるか、締切日が空の行
                return !row['提出物']?.startsWith('※') && row['締切日'] !== '';
              });
              
              setSubmissionsData(filteredData);
              setLoading(false);
            })
            .catch(err => {
              console.error('エラー:', err);
              setError(err.message);
              setLoading(false);
            });
        }, []);
        
        // 提出方法のリンク化処理と準備中テキストのスタイル適用
        const renderSubmissionMethod = (method, rowData) => {
          if (method.includes('フォームはこちら')) {
            // 講演情報フォーム提出の場合は特定のURLを使用
            if (rowData['提出物'] === '講演情報フォーム提出') {
              return (
                <a href="https://forms.gle/LGSpB4NPXugy7LLE6" target="_blank" rel="noopener noreferrer">
                  フォームはこちら <FaExternalLinkAlt />
                </a>
              );
            } else {
              return (
                <a href="https://forms.gle/LGSpB4NPXugy7LLE6" target="_blank" rel="noopener noreferrer">
                  フォームはこちら <FaExternalLinkAlt />
                </a>
              );
            }
          } else if (method.includes('フォーム準備中')) {
            return (
              <span style={{ color: '#888', fontStyle: 'italic' }}>
                フォーム準備中
              </span>
            );
          }
          return method;
        };
        
        return (
          <EventTable>
            <thead>
              <TableRow>
                <TableHeader>提出物</TableHeader>
                <TableHeader>締切日</TableHeader>
                <TableHeader>提出方法</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="3">データを読み込み中...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan="3">エラー: {error}</TableCell>
                </TableRow>
              ) : (
                submissionsData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row['提出物']}</TableCell>
                    <TableCell>{row['締切日']}</TableCell>
                    <TableCell>{renderSubmissionMethod(row['提出方法'], row)}</TableCell>
                  </TableRow>
                ))
              )}
            </tbody>
          </EventTable>
        );
      })()}
      
      <div style={{ marginTop: '2rem' }} data-component-name="Submissions">
        <p data-component-name="Submissions">ご不明な点がございましたら、下記メールアドレスまたは担当営業までお問い合わせください。</p>
        <p>スピーカー事務局: primenumber_speaker2025@eventdesk.info</p>
      </div>
    </SubmissionsContainer>
  );
};

export default Submissions;
