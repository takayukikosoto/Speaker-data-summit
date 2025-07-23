import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import OpenAI from 'openai';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #00A99D;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-size: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #008C82;
    transform: scale(1.05);
  }
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 350px;
  height: 450px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  transform-origin: bottom right;
  transform: ${props => props.isOpen ? 'scale(1)' : 'scale(0)'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  pointer-events: ${props => props.isOpen ? 'all' : 'none'};
`;

const ChatHeader = styled.div`
  background-color: #00A99D;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  
  ${props => props.isUser ? `
    align-self: flex-end;
    background-color: #00A99D;
    color: white;
    border-bottom-right-radius: 4px;
  ` : `
    align-self: flex-start;
    background-color: #f1f1f1;
    color: #333;
    border-bottom-left-radius: 4px;
  `}
`;

const ChatInputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #00A99D;
  }
`;

const SendButton = styled.button`
  background-color: #00A99D;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #008C82;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// OpenAI APIの初期化関数
// 実行時に初期化して環境変数の取得問題を回避
const createOpenAIClient = () => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    console.log('OpenAIクライアントを初期化します。APIキーの存在:', !!apiKey);
    
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      console.error('APIキーが設定されていないか、デフォルト値のままです');
      return null;
    }
    
    return new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // ブラウザでの使用を許可（本番環境では推奨されません）
    });
  } catch (error) {
    console.error('OpenAIクライアントの初期化エラー:', error);
    return null;
  }
};

// イベント情報のコンテキスト（AIに与える背景情報）
const eventContext = `
primeNumber DATA SUMMIT 2025は、2025年11月26日（水）10:00-19:00に高輪ゲートウェイコンベンションセンター 4階で開催されるデータ活用に関するカンファレンスです。

重要な日程:
- スポンサー申込締切: 2025年6月18日
- ロゴデータ/会社情報提出シート/講演情報確認シート送付: 2025年8月1日（金）
- ロゴデータ/会社情報提出シート/講演情報確認シート/講演者写真締切: 2025年8月22日（金）
- イベントサイトオープン: 2025年9月下旬
- セッション環境確認シート送付: 2025年10月中旬
- セッション環境確認シート締切: 2025年10月31日（金）
- セッション資料/配布資料PDF 提出期限: 2025年11月7日（金）
- 当日ご案内資料送付・配布資料PDF FIX: 2025年11月17日（月）
- セッション資料FIX: 2025年11月21日（金）
- セッションリハーサル（希望制）・出展社搬入日: 2025年11月25日（火）16:00頃から
- イベント本番: 2025年11月26日（水）
- イベントレポート送付: 2025年12月8日（月）

スポンサープラン:
- Platinumスポンサー: 300万円・限定2枠、30分のブレイクアウトセッション、ブースサイズ約3,000mm
- Goldスポンサー: 150万円・限定15枠、15分のシアターセッション、ブースサイズ約2,000mm
- Silverスポンサー: 50万円・限定5枠

各種フォーム:
- 企業情報登録フォーム: 出展企業の基本情報、ロゴ、会社概要などを登録
- 展示ブース情報フォーム: ブースレイアウト、必要設備、展示内容などを登録
- セッション情報フォーム: 講演内容、タイトル、概要などを登録
- 講演環境フォーム: 講演に必要な機材、環境設定、特別要望などを登録
- 講演者プロフィールフォーム: 講演者の経歴、写真、SNSアカウントなどを登録
- 搬入出情報フォーム: 展示物の搬入出スケジュール、車両情報などを登録
- プレス登録フォーム: メディア関係者の登録、取材申請を行うためのフォーム
- 懇親会参加登録フォーム: イベント終了後に開催される懇親会への参加登録
`;

// クォータ超過状態を追跡するグローバル変数
let isQuotaExceeded = false;

// OpenAI GPTを使用した高度な応答生成
const getAIResponse = async (message, chatHistory, setQuotaExceeded, setUseAI) => {
  try {
    console.log('メッセージを受信しました:', message);
    
    // OpenAIクライアントを初期化
    const openai = createOpenAIClient();
    
    if (!openai) {
      console.error('OpenAIクライアントが初期化されていません');
      return 'すみません、APIキーの設定に問題があります。管理者にお問い合わせください。';
    }
    
    // チャット履歴をOpenAIの形式に変換
    const messages = [
      { role: 'system', content: `あなたはprimeNumber DATA SUMMIT 2025の運営チームの一員で、出展者からの質問に答えるアシスタントです。丁寧かつ簡潔に回答してください。以下はイベントに関する情報です：${eventContext}` },
      ...chatHistory.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    console.log('OpenAI APIを呼び出します...');
    
    try {
      // OpenAI APIを呼び出し
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      console.log('API呼び出し成功:', completion.choices[0].message.content.substring(0, 50) + '...');
      return completion.choices[0].message.content;
    } catch (apiError) {
      console.error('OpenAI API呼び出しエラー:', apiError);
      
      // APIキーの問題を詳細に表示
      if (apiError.message && apiError.message.includes('API key')) {
        console.error('APIキーが無効です。正しいAPIキーを設定してください。');
        return 'すみません、APIキーが無効です。管理者にお問い合わせください。';
      }
      
      // クォータ超過エラーの場合
      if (apiError.message && apiError.message.includes('quota')) {
        console.error('APIの使用量制限を超えました。簡易モードに切り替えます。');
        
        // グローバル変数を更新
        isQuotaExceeded = true;
        
        // 引数として受け取った状態更新関数が存在する場合は使用
        if (setQuotaExceeded && typeof setQuotaExceeded === 'function') {
          setQuotaExceeded(true);
        }
        
        if (setUseAI && typeof setUseAI === 'function') {
          setUseAI(false);
        }
        
        // 簡易モードの応答を返す
        return getFallbackResponse(message);
      }
      
      return `すみません、API呼び出し中にエラーが発生しました: ${apiError.message || '不明なエラー'}`;
    }
  } catch (error) {
    console.error('getAIResponse全体エラー:', error);
    return 'すみません、現在システムに問題が発生しています。datasummit2025_primenumber@eventdesk.info までメールでお問い合わせいただくか、03-XXXX-XXXXまでお電話ください。';
  }
};

// フォールバック用の簡易応答機能
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // 一般的な応答
  if (lowerMessage.includes('こんにちは') || lowerMessage.includes('はじめまして')) {
    return 'こんにちは！primeNumber DATA SUMMIT 2025運営チームです。どのようなご質問でしょうか？';
  }
  
  if (lowerMessage.includes('ありがとう')) {
    return 'どういたしまして！他にご質問があればお気軽にどうぞ。';
  }
  
  if (lowerMessage.includes('申し込み') || lowerMessage.includes('締め切り')) {
    return 'スポンサー申込の締切は2025年6月18日です。各種資料の提出期限については、フォームページでご確認いただけます。';
  }
  
  if (lowerMessage.includes('ブース') || lowerMessage.includes('サイズ')) {
    return 'ブースサイズはスポンサープランにより異なります。Platinumスポンサーは3,000mm程度、Goldスポンサーは2,000mm程度のスペースをご提供します。';
  }
  
  // デフォルトの応答
  return 'ご質問ありがとうございます。詳細な回答が必要な場合は、datasummit2025_primenumber@eventdesk.info までメールでお問い合わせいただくか、03-XXXX-XXXXまでお電話ください。';
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'こんにちは！primeNumber DATA SUMMIT 2025運営チームです。どのようなご質問がありますか？', isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [useAI, setUseAI] = useState(true); // APIキーが設定されているかどうかで切り替え
  const [quotaExceeded, setQuotaExceeded] = useState(false); // クォータ超過フラグ
  
  // APIキーの確認
  useEffect(() => {
    // デバッグ用に環境変数をログ出力
    console.log('APIキーの状態確認:', {
      'APIキーが存在するか': !!process.env.REACT_APP_OPENAI_API_KEY,
      'APIキーの先頭数文字': process.env.REACT_APP_OPENAI_API_KEY ? 
        `${process.env.REACT_APP_OPENAI_API_KEY.substring(0, 5)}...` : 'なし',
      '環境変数の数': Object.keys(process.env).filter(key => key.startsWith('REACT_APP')).length
    });
    
    if (!process.env.REACT_APP_OPENAI_API_KEY || 
        process.env.REACT_APP_OPENAI_API_KEY === 'your_openai_api_key_here') {
      setUseAI(false);
      console.warn('OpenAI APIキーが正しく設定されていないため、簡易応答モードで動作します。');
    } else if (!quotaExceeded) {
      console.log('OpenAI APIキーが設定されています。AI応答モードで動作します。');
    }
  }, [quotaExceeded]);
  
  // 自動スクロール
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // ユーザーメッセージを追加
    const userMessage = { text: inputValue, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    
    // 応答生成
    setIsTyping(true);
    
    try {
      let response;
      
      // APIキーの状態を再確認
      const apiKeyExists = !!process.env.REACT_APP_OPENAI_API_KEY && 
                          process.env.REACT_APP_OPENAI_API_KEY !== 'your_openai_api_key_here';
      
      console.log('応答モード:', useAI ? 'AIモード' : '簡易モード');
      console.log('APIキーの状態:', apiKeyExists ? '存在します' : '存在しません');
      console.log('クォータ超過状態:', quotaExceeded ? '超過しています' : '正常です');
      
      if (useAI && apiKeyExists && !quotaExceeded) {
        // OpenAI APIを使用した高度な応答
        console.log('AI応答を生成します...');
        response = await getAIResponse(inputValue, messages, setQuotaExceeded, setUseAI);
      } else {
        // フォールバック用の簡易応答
        console.log('簡易応答を生成します...');
        response = getFallbackResponse(inputValue);
      }
      
      setMessages(prevMessages => [...prevMessages, { text: response, isUser: false }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prevMessages => [...prevMessages, { 
        text: `すみません、エラーが発生しました: ${error.message || '不明なエラー'}。後ほど再度お試しいただくか、datasummit2025_primenumber@eventdesk.info までお問い合わせください。`, 
        isUser: false 
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  return (
    <ChatContainer>
      <ChatButton onClick={toggleChat}>
        {isOpen ? '✕' : '💬'}
      </ChatButton>
      
      <ChatWindow isOpen={isOpen}>
        <ChatHeader>
          <ChatTitle>primeNumber DATA SUMMIT 2025 サポート</ChatTitle>
          <CloseButton onClick={toggleChat}>✕</CloseButton>
        </ChatHeader>
        
        <ChatMessages>
          {messages.map((message, index) => (
            <Message key={index} isUser={message.isUser}>
              {message.text}
            </Message>
          ))}
          {isTyping && (
            <Message isUser={false}>
              <em>入力中...</em>
            </Message>
          )}
          <div ref={messagesEndRef} />
        </ChatMessages>
        
        <ChatInputContainer>
          <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', gap: '10px' }}>
            <ChatInput
              type="text"
              placeholder="メッセージを入力..."
              value={inputValue}
              onChange={handleInputChange}
            />
            <SendButton type="submit" disabled={!inputValue.trim() || isTyping}>
              ↑
            </SendButton>
          </form>
        </ChatInputContainer>
      </ChatWindow>
    </ChatContainer>
  );
};

export default ChatWidget;
