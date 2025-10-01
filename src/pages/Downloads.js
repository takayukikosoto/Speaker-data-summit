import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { downloadService } from '../utils/supabaseService';
import supabase from '../utils/supabaseClient';
import { FaDownload, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileArchive, FaFile, FaInfoCircle } from 'react-icons/fa';

const DownloadsContainer = styled.div`
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

const DownloadSection = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #0a7463; // 色を統一
  padding-bottom: 0.5rem;
`;

const DownloadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const DownloadCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const DownloadTitle = styled.h3`
  font-size: 1.2rem;
  color: #0a7463; // 色を統一
  margin-bottom: 1rem;
`;

const DownloadDescription = styled.p`
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #666;
`;

const DownloadLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #0a7463; // 色を統一
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;

  svg {
    margin-right: 8px;
  }

  &:hover {
    background-color: #065446; // ホバー時は少し暗く
  }
`;

const FileInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #666;
`;

const FileType = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: #e9ecef;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  
  svg {
    margin-right: 5px;
    color: #666;
  }
`;

const FileSize = styled.span``;

const ImportantNote = styled.div`
  background-color: #e6efed; // 色を統一した薄い背景色
  border-left: 4px solid #0a7463; // 色を統一
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  
  svg {
    margin-right: 10px;
    color: #0a7463; // 色を統一
    flex-shrink: 0;
    margin-top: 3px;
  }
  
  div {
    flex: 1;
  }
`;

// ファイルタイプに基づいてアイコンを返す関数
const getFileIcon = (fileType) => {
  const type = fileType ? fileType.toLowerCase() : '';
  
  if (type.includes('pdf')) return <FaFilePdf />;
  if (type.includes('doc') || type.includes('word')) return <FaFileWord />;
  if (type.includes('xls') || type.includes('excel') || type.includes('sheet')) return <FaFileExcel />;
  if (type.includes('jpg') || type.includes('jpeg') || type.includes('png') || type.includes('image')) return <FaFileImage />;
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return <FaFileArchive />;
  
  return <FaFile />; // デフォルトアイコン
};

const Downloads = () => {
  const [downloadItems, setDownloadItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // カテゴリーの日本語名マッピング
  const categoryNames = {
    sponsor: 'ブース出展者向け資料',
    speaker: '登壇者向け資料',
    branding: 'プロモーションアセット・ブランド資料',
    press: 'プレス向け資料',
    general: '一般資料'
  };
  
  // カテゴリーの説明マッピング
  const categoryDescriptions = {
    sponsor: 'スポンサー企業様向けの各種ガイドラインやマニュアルです。',
    speaker: 'セッション発表者向けのテンプレートやガイドラインです。',
    branding: 'ロゴや広報資料など、プロモーションにご利用いただける素材です。',
    press: 'メディア関係者向けの資料パッケージです。',
    general: '会場案内や各種一般情報です。'
  };

  // カテゴリー情報を生成する関数
  const generateCategoryMap = (items) => {
    const categoryMap = {};
    
    // アイテムからカテゴリーを抽出
    items.forEach(item => {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = {
          name: categoryNames[item.category] || item.category,
          description: categoryDescriptions[item.category] || ''
        };
      }
    });
    
    return categoryMap;
  };

  // Supabaseからデータを読み込む
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Supabaseからダウンロードアイテムを取得
        const items = await downloadService.getAllItems();
        setDownloadItems(items);
        
        // カテゴリー情報を生成
        setCategories(generateCategoryMap(items));
        setLoading(false);
      } catch (err) {
        console.error('Error loading download data:', err);
        setError('ダウンロードデータの読み込みに失敗しました。後でもう一度お試しください。');
        setLoading(false);
      }
    };
    
    fetchData();

    // リアルタイムサブスクリプションを設定
    const subscription = supabase
      .channel('downloads_sp-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'downloads_sp' }, 
        async (payload) => {
          console.log('新規ダウンロードアイテム追加:', payload.new);
          
          try {
            // 最新の完全なアイテム情報を取得
            const newItem = await downloadService.getItemById(payload.new.id);
            console.log('取得した新規アイテム詳細:', newItem);
            
            // 新しいアイテムを現在のリストに追加
            setDownloadItems(currentItems => {
              // 既に同じIDのアイテムがある場合は置き換え、なければ追加
              const exists = currentItems.some(item => item.id === newItem.id);
              const newItems = exists 
                ? currentItems.map(item => item.id === newItem.id ? newItem : item)
                : [...currentItems, newItem];
              
              setCategories(generateCategoryMap(newItems));
              return newItems;
            });
          } catch (err) {
            console.error('新規アイテム処理エラー:', err);
          }
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'downloads_sp' }, 
        async (payload) => {
          console.log('ダウンロードアイテム更新:', payload.new);
          
          try {
            // 最新の完全なアイテム情報を取得
            const updatedItem = await downloadService.getItemById(payload.new.id);
            console.log('取得した更新アイテム詳細:', updatedItem);
            
            // 更新されたアイテムを現在のリストで置き換え
            setDownloadItems(currentItems => {
              const updatedItems = currentItems.map(item => 
                item.id === updatedItem.id ? updatedItem : item
              );
              setCategories(generateCategoryMap(updatedItems));
              return updatedItems;
            });
          } catch (err) {
            console.error('アイテム更新処理エラー:', err);
          }
        }
      )
      .on('postgres_changes', 
        { event: 'DELETE', schema: 'public', table: 'downloads_sp' }, 
        async (payload) => {
          console.log('ダウンロードアイテム削除:', payload.old);
          
          // 削除されたアイテムをリストから除外
          setDownloadItems(currentItems => {
            const filteredItems = currentItems.filter(item => item.id !== payload.old.id);
            setCategories(generateCategoryMap(filteredItems));
            return filteredItems;
          });
        }
      )
      .subscribe();

    // クリーンアップ関数
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // カテゴリーごとにアイテムをグループ化
  const groupedItems = downloadItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // ローディング中の表示
  if (loading) {
    return (
      <DownloadsContainer>
        <PageTitle>資料ダウンロード</PageTitle>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>資料情報を読み込んでいます...</p>
        </div>
      </DownloadsContainer>
    );
  }
  
  // エラー時の表示
  if (error) {
    return (
      <DownloadsContainer>
        <PageTitle>資料ダウンロード</PageTitle>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          <p>{error}</p>
        </div>
      </DownloadsContainer>
    );
  }

  return (
    <DownloadsContainer>
      <PageTitle>資料ダウンロード</PageTitle>
      
      <ImportantNote>
        <FaInfoCircle size={20} />
        <div>
          <p>※ 各資料は定期的に更新されます。最新版をご確認ください。</p>
        </div>
      </ImportantNote>

      {/* カテゴリーごとにセクションを生成 */}
      {Object.keys(groupedItems).map(categoryKey => (
        <DownloadSection key={categoryKey}>
          <SectionTitle>{categories[categoryKey].name}</SectionTitle>
          <p>{categories[categoryKey].description}</p>
          
          <DownloadGrid>
            {groupedItems[categoryKey].map(item => (
              <DownloadCard key={item.id}>
                <DownloadTitle>{item.title}</DownloadTitle>
                <DownloadDescription>
                  {item.description}
                </DownloadDescription>
                <FileInfo>
                  <FileType>
                    {getFileIcon(item.fileType)}
                    {item.fileType}
                  </FileType>
                  <FileSize>{item.fileSize}</FileSize>
                </FileInfo>
                <DownloadLink 
                  href={item.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FaDownload />
                  ダウンロード
                </DownloadLink>
                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#666' }}>
                  最終更新日: {item.lastUpdated}
                </div>
              </DownloadCard>
            ))}
          </DownloadGrid>
        </DownloadSection>
      ))}
    </DownloadsContainer>
  );
};

export default Downloads;
