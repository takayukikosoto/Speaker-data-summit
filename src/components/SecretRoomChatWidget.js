import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import OpenAI from 'openai';
import { searchReferences } from '../utils/botReferenceUtils';

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
  background-color: #2196F3; /* 一般的なブルーに変更 */
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
    background-color: #1976D2;
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
  background-color: #2196F3; /* 一般的なブルーに変更 */
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
    background-color: #2196F3; /* 一般的なブルーに変更 */
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
    border-color: #2196F3; /* 一般的なブルーに変更 */
  }
`;

const SendButton = styled.button`
  background-color: #2196F3; /* 一般的なブルーに変更 */
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
    background-color: #1976D2;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// OpenAI APIの初期化関数
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
- 出展者マニュアル送付: 2025年9月2日（月）
- 出展者説明会: 2025年9月9日（月）
- 各種申請書類提出期限: 2025年10月11日（金）
- 搬入日: 2025年11月25日（火）13:00-18:00
- 開催日: 2025年11月26日（水）10:00-19:00
- 搬出日: 2025年11月26日（水）19:00-21:00
- イベントレポート送付: 2025年12月8日（月）

スポンサープラン:
- Platinumスポンサー: 300万円・限定2枠、30分のブレイクアウトセッション、ブースサイズ約3,000mm
- Goldスポンサー: 150万円・限定15枠、15分のシアターセッション、ブースサイズ約2,000mm
- Silverスポンサー: 50万円・限定5枠

各種フォーム:
- セッション情報フォーム: 講演内容、タイトル、概要等
- 企業情報フォーム: 出展企業の基本情報、ロゴ、会社概要等
- 講演環境フォーム: 講演に必要な機材、環境設定、特別要望等
- 展示ブース情報フォーム: ブースレイアウト、必要設備、展示内容等
- スポンサー申し込みフォーム: スポンサープラン選択、支払情報等
- 搬入出情報フォーム: 展示物の搬入出スケジュール、車両情報等
- プレスフォーム: メディア関係者登録、取材申請等
- 懇親会参加登録フォーム: イベント終了後に開催される懇親会への参加登録
`;

// イベントアシスタントのコンテキスト
const assistantContext = `あなたはprimeNumber DATA SUMMIT 2025のイベントアシスタントやで。
参加者やスポンサーなど、イベントに関わるすべての人をサポートするために存在するんや。
質問に対しては、大阪弁で親しみやすくフレンドリーに答えてや。「やで」「やでぇ」「やん」「やろ」などの大阪弁の特徴的な言い回しを使ってな。
イベント、参加方法、スポンサープラン、セッション情報などに関する質問に答えてや。
また、イベント全般に関する質問にも答えてや。
各種フォームやウェブサイトのURLを質問された場合は、リファレンスファイル（forms_links.txt）に実際に記載されているURLのみ案内してや。リファレンスに存在しないURLは絶対に生成したり想像で案内したりせんといてな。その場合は「公式サイトや事務局の案内をご確認ください」とだけ案内してや。
回答は必ず日本語の大阪弁で行ってや。`;


// OpenAI GPTを使用した高度な応答生成
const getAIResponse = async (message, chatHistory, setQuotaExceeded, setUseAI, references) => {
  try {
    const openai = createOpenAIClient();
    
    if (!openai) {
      setUseAI(false);
      return "申し訳ありませんが、AIサービスに接続できません。管理者にお問い合わせください。";
    }
    
    // チャット履歴をOpenAI形式に変換
    const formattedHistory = chatHistory
      .filter(msg => !msg.isTyping)
      .map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));
    
    // リファレンスファイルから関連情報を検索
    let relevantInfo = '';
    if (references && Object.keys(references).length > 0) {
      relevantInfo = searchReferences(message, references);
      console.log('質問に関連する情報が見つかりました:', relevantInfo ? 'あり' : 'なし');
    }
    
    // システムメッセージを追加（アシスタントコンテキストとイベントコンテキストの両方を含める）
    let combinedContext = `${assistantContext}\n\n${eventContext}`;
    
    // 関連情報があれば追加
    if (relevantInfo) {
      combinedContext += `\n\n以下は質問に関連する詳細情報です。この情報を優先して回答してください：\n${relevantInfo}`;
    }
    
    const messages = [
      { role: 'system', content: combinedContext },
      ...formattedHistory,
      { role: 'user', content: message }
    ];
    
    console.log('OpenAI APIにリクエストを送信します:', { 
      messageCount: messages.length,
      systemContextLength: combinedContext.length,
      hasRelevantInfo: !!relevantInfo
    });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });
    
    console.log('OpenAI APIからの応答:', {
      status: response.status,
      model: response.model,
      responseLength: response.choices?.[0]?.message?.content?.length || 0
    });
    
    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('AIから応答を受信できませんでした');
    }
  } catch (error) {
    console.error('AI応答生成エラー:', error);
    
    // レート制限エラーの場合
    if (error.status === 429) {
      setQuotaExceeded(true);
      setUseAI(false);
      return "申し訳ありませんが、AIサービスの利用制限に達しました。簡易応答モードに切り替えます。";
    }
    
    return `エラーが発生しました: ${error.message || '不明なエラー'}`;
  }
};

// フォールバック用の簡易応答機能
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // イベント関連の質問
  if (lowerMessage.includes('パスワード') || lowerMessage.includes('password')) {
    return "セキュリティ上の理由から、パスワードに関する情報はチャットでは提供できません。管理者にお問い合わせください。";
  } else if (lowerMessage.includes('システム設定') || lowerMessage.includes('system')) {
    return "システム設定機能は現在開発中です。近日中に利用可能になる予定です。";
  } else if (lowerMessage.includes('ユーザー管理') || lowerMessage.includes('user')) {
    return "ユーザー管理機能は現在開発中です。近日中に利用可能になる予定です。";
  } else if (lowerMessage.includes('分析') || lowerMessage.includes('analytics')) {
    return "高度な分析機能は現在開発中です。近日中に利用可能になる予定です。";
  } 
  // イベント関連の質問
  else if (lowerMessage.includes('日程') || lowerMessage.includes('いつ') || lowerMessage.includes('開催日')) {
    return "primeNumber DATA SUMMIT 2025は、2025年11月26日（水）10:00-19:00に高輪ゲートウェイコンベンションセンター 4階で開催されます。";
  } else if (lowerMessage.includes('場所') || lowerMessage.includes('どこ') || lowerMessage.includes('会場')) {
    return "開催場所は高輪ゲートウェイコンベンションセンター 4階です。";
  } else if (lowerMessage.includes('スポンサー') || lowerMessage.includes('sponsor')) {
    return "スポンサープランは以下の3種類があります：\n- Platinumスポンサー: 300万円・限定2枠\n- Goldスポンサー: 150万円・限定15枠\n- Silverスポンサー: 50万円・限定5枠\nお申込みは2025年6月18日までとなっています。";
  } else if (lowerMessage.includes('フォーム') || lowerMessage.includes('申し込み') || lowerMessage.includes('form')) {
    return "各種フォームは以下のものがあります：セッション情報、企業情報、講演環境、展示ブース情報、スポンサー申し込み、搬入出情報、プレス、懇親会参加登録。詳細は各フォームページをご確認ください。";
  } else {
    return "申し訳ありませんが、現在この質問に対する回答を提供できません。イベントの日程、場所、スポンサープラン、各種フォームについてお尋ねいただくか、管理者にお問い合わせください。";
  }
};

const SecretRoomChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    text: '秘密の部屋へようこそ。システム設定、ユーザー管理、高度な分析など、秘密の部屋の機能についてお気軽にお尋ねください。イベント全般に関する質問にもお答えできます。',
    isUser: false
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [references, setReferences] = useState({});
  const [referencesLoaded, setReferencesLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  
  // OpenAIクライアントの初期化
  const openai = useRef(createOpenAIClient());
  
  // リファレンスファイルの読み込み
  useEffect(() => {
    const loadReferences = async () => {
      try {
        const response = await fetch('/api/bot-references');
        if (response.ok) {
          const data = await response.json();
          setReferences(data);
          setReferencesLoaded(true);
          console.log('リファレンスファイルを読み込みました:', Object.keys(data));
        } else {
          console.error('リファレンスファイルの読み込みに失敗しました:', response.status);
        }
      } catch (error) {
        console.error('リファレンスファイルの読み込み中にエラーが発生しました:', error);
      }
    };
    
    loadReferences();
  }, []);
  
  // 初期化時にAPIキーの状態を確認
  useEffect(() => {
    console.log('環境変数の状態:', {
      'APIキーの存在': !!process.env.REACT_APP_OPENAI_API_KEY,
      'APIキーの長さ': process.env.REACT_APP_OPENAI_API_KEY?.length || 0,
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
        // リファレンスデータが読み込まれている場合は、それを利用する
        if (referencesLoaded) {
          console.log('リファレンスデータを利用して応答を生成します');
          response = await getAIResponse(inputValue, messages, setQuotaExceeded, setUseAI, references);
        } else {
          console.log('リファレンスデータなしで応答を生成します');
          response = await getAIResponse(inputValue, messages, setQuotaExceeded, setUseAI, {});
        }
      } else {
        // フォールバック用の簡易応答
        console.log('簡易応答を生成します...');
        // リファレンスデータが読み込まれている場合は、簡易応答でも参照する
        if (referencesLoaded && references) {
          const relevantInfo = searchReferences(inputValue, references);
          if (relevantInfo) {
            console.log('リファレンスデータから関連情報が見つかりました');
            // 関連情報を簡易応答に組み込む
            const basicResponse = getFallbackResponse(inputValue);
            response = `${basicResponse}\n\n参考情報: ${relevantInfo.split('\n').slice(0, 3).join('\n')}`;
          } else {
            response = getFallbackResponse(inputValue);
          }
        } else {
          response = getFallbackResponse(inputValue);
        }
      }
      
      setMessages(prevMessages => [...prevMessages, { text: response, isUser: false }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prevMessages => [...prevMessages, { 
        text: `すみません、エラーが発生しました: ${error.message || '不明なエラー'}。管理者にお問い合わせください。`, 
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
          <ChatTitle>DATA SUMMIT 2025 - アシスタント</ChatTitle>
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

export default SecretRoomChatWidget;
