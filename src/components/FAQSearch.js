import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { faqService } from '../utils/supabaseService';
import supabase from '../utils/supabaseClient';

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const SearchBox = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #0a7463; // 色を統一
    box-shadow: 0 0 0 2px rgba(10, 116, 99, 0.2); // 色を統一
  }
`;

const ResultsContainer = styled.div`
  margin-top: 1.5rem;
`;

const FAQItem = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${props => props.highlighted ? '#e6efed' : '#fff'}; // 色を統一した薄い背景色
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Question = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Answer = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
`;

const CategoryTag = styled.span`
  display: inline-block;
  background-color: #0a7463; // 色を統一
  color: white;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-right: 0.5rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const FAQSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allFaqs, setAllFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // すべてのFAQを読み込む
  useEffect(() => {
    const loadFaqs = async () => {
      try {
        setLoading(true);
        const faqs = await faqService.getAllFaqs();
        setAllFaqs(faqs);
        setSearchResults(faqs);
        setLoading(false);
      } catch (err) {
        console.error('Error loading FAQs:', err);
        setError('FAQの読み込みに失敗しました。');
        setLoading(false);
      }
    };
    
    loadFaqs();

    // リアルタイムサブスクリプションを設定
    const subscription = supabase
      .channel('faqs-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'faqs' }, 
        async () => {
          console.log('FAQデータの更新を検知しました');
          
          // データの再取得
          try {
            const faqs = await faqService.getAllFaqs();
            setAllFaqs(faqs);
            
            // 検索クエリがある場合は検索結果を更新、なければ全件表示
            if (searchQuery.trim()) {
              const results = await faqService.searchFaqs(searchQuery);
              setSearchResults(results);
            } else {
              setSearchResults(faqs);
            }
          } catch (err) {
            console.error('Error reloading FAQs:', err);
          }
        }
      )
      .subscribe();

    // クリーンアップ関数
    return () => {
      subscription.unsubscribe();
    };
  }, [searchQuery]);

  
  // 検索クエリが変更されたときの処理
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults(allFaqs);
        return;
      }
      
      try {
        setLoading(true);
        const results = await faqService.searchFaqs(searchQuery);
        setSearchResults(results);
        setLoading(false);
      } catch (err) {
        console.error('Error searching FAQs:', err);
        setError('検索中にエラーが発生しました。');
        setLoading(false);
      }
    };
    
    // 検索クエリが変更されてから少し待ってから検索を実行（タイピング中の連続検索を防ぐ）
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, allFaqs]);
  
  // 検索ボックスの入力処理
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // カテゴリー名を取得する関数
  const getCategoryName = (categoryId) => {
    const categories = {
      'general': '一般情報',
      'venue': '会場・アクセス',
      'registration': '参加登録',
      'sponsor': 'スポンサー・出展',
      'speaker': '登壇者向け'
    };
    
    return categories[categoryId] || categoryId;
  };
  
  if (error) {
    return (
      <FAQContainer>
        <SearchBox>
          <SearchInput
            type="text"
            placeholder="質問を入力してください..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchBox>
        <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
      </FAQContainer>
    );
  }
  
  return (
    <FAQContainer>
      <SearchBox>
        <SearchInput
          type="text"
          placeholder="質問を入力してください..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </SearchBox>
      
      {loading ? (
        <LoadingSpinner>検索中...</LoadingSpinner>
      ) : (
        <ResultsContainer>
          {searchResults.length > 0 ? (
            searchResults.map((faq) => (
              <FAQItem 
                key={faq.id} 
                highlighted={searchQuery && (
                  faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
                )}
              >
                <CategoryTag>{getCategoryName(faq.category)}</CategoryTag>
                <Question>{faq.question}</Question>
                <Answer>{faq.answer}</Answer>
              </FAQItem>
            ))
          ) : (
            <NoResults>
              検索結果がありません。別のキーワードで検索してください。
            </NoResults>
          )}
        </ResultsContainer>
      )}
    </FAQContainer>
  );
};

export default FAQSearch;
