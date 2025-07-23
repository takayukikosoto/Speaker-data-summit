import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { downloadService, faqService, formService } from '../utils/supabaseService';
import { useNavigate } from 'react-router-dom';
import { exportCSV } from '../utils/csvSaver';
import { getCategoryName, generateFaqId } from '../utils/faqLoader';
import supabase from '../utils/supabaseClient';
import { FaDownload, FaQuestionCircle, FaClipboardList, FaPlus, FaEdit, FaTrashAlt, FaFileDownload, FaLock, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const SecretRoomButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #9c27b0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #7b1fa2;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$active ? '#4CAF50' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background: ${props => props.$active ? '#4CAF50' : '#f5f5f5'};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  
  tr:hover {
    background-color: #f9f9f9;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const SuccessMessage = styled.div`
  background-color: #dff0d8;
  color: #3c763d;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

const ErrorMessage = styled.div`
  background-color: #f2dede;
  color: #a94442;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h2 {
    margin: 0;
    color: #333;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 8px;
      color: #4CAF50;
    }
  }
  
  button {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: #333;
    }
  }
`;

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('downloads');
  const [downloadItems, setDownloadItems] = useState([]);
  const [faqData, setFaqData] = useState({ categories: [], items: [] });
  const [formItems, setFormItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [modalType, setModalType] = useState('download'); // 'download', 'faq', 'form'
  
  // データを読み込む
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // アクティブなタブに応じてデータを読み込む
        if (activeTab === 'downloads') {
          // Supabaseからダウンロードアイテムを取得
          const items = await downloadService.getAllItems();
          setDownloadItems(items);
        } else if (activeTab === 'forms') {
          // Supabaseからフォームアイテムを取得
          console.log('フォームデータを読み込みます');
          const formItems = await formService.getAllForms();
          console.log('取得したフォームデータ:', formItems);
          setFormItems(formItems);
        } else if (activeTab === 'faq') {
          // SupabaseからFAQを取得
          const items = await faqService.getAllFaqs();
          
          // カテゴリー情報を生成
          const categories = [
            { id: 'general', name: '一般情報' },
            { id: 'venue', name: '会場案内' },
            { id: 'registration', name: '参加登録' },
            { id: 'sponsor', name: 'スポンサー情報' },
            { id: 'speaker', name: '登壇者情報' }
          ];
          
          setFaqData({ categories, items });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('データの読み込みに失敗しました。後でもう一度お試しください。');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);
  
  // 新規アイテムの追加
  const handleAddItem = () => {
    if (activeTab === 'downloads') {
      setModalType('download');
      setEditItem({
        title: '',
        description: '',
        category: 'general',
        downloadUrl: '',
        fileType: 'PDF',
        fileSize: '1MB',
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    } else if (activeTab === 'faq') {
      setModalType('faq');
      setEditItem({
        id: '',
        category: 'general',
        question: '',
        answer: '',
        priority: 5
      });
    } else if (activeTab === 'forms') {
      setModalType('form');
      setEditItem({
        id: '',
        title: '',
        description: '',
        category: 'sponsor',
        formUrl: '',
        deadline: '',
        isRequired: true
      });
    }
    setShowModal(true);
  };
  
  // アイテムの編集
  const handleEditItem = (item) => {
    if (activeTab === 'downloads') {
      setModalType('download');
      // 必要なフィールドが存在するか確認し、存在しない場合はデフォルト値を設定
      const completeItem = {
        id: item.id || '',
        title: item.title || '',
        description: item.description || '',
        category: item.category || 'general',
        downloadUrl: item.downloadUrl || '',
        fileType: item.fileType || 'PDF',
        fileSize: item.fileSize || '1MB',
        lastUpdated: item.lastUpdated || new Date().toISOString().split('T')[0]
      };
      setEditItem(completeItem);
    } else if (activeTab === 'faq') {
      setModalType('faq');
      const completeItem = {
        id: item.id || '',
        category: item.category || 'general',
        question: item.question || '',
        answer: item.answer || '',
        priority: item.priority || 5
      };
      setEditItem(completeItem);
    } else if (activeTab === 'forms') {
      setModalType('form');
      const completeItem = {
        id: item.id || '',
        title: item.title || '',
        description: item.description || '',
        category: item.category || 'sponsor',
        formUrl: item.formUrl || '',
        deadline: item.deadline || '',
        isRequired: item.isRequired || true
      };
      setEditItem(completeItem);
    }
    setShowModal(true);
  };
  
  // アイテムの削除
  const handleDeleteItem = async (id) => {
    if (window.confirm('このアイテムを削除してもよろしいですか？')) {
      try {
        setLoading(true);
        
        if (activeTab === 'downloads') {
          // Supabaseからアイテムを削除
          await downloadService.deleteItem(id);
          
          // 画面表示も更新
          const newItems = downloadItems.filter(item => item.id !== id);
          setDownloadItems(newItems);
        } else if (activeTab === 'faq') {
          // SupabaseからFAQを削除
          await faqService.deleteFaq(id);
          
          // 画面表示も更新
          const newItems = faqData.items.filter(item => item.id !== id);
          const newFaqData = { ...faqData, items: newItems };
          setFaqData(newFaqData);
        } else if (activeTab === 'forms') {
          // Supabaseからフォームアイテムを削除
          await formService.deleteForm(id);
          
          // 画面表示も更新
          const newItems = formItems.filter(item => item.id !== id);
          setFormItems(newItems);
        }
        
        setSuccessMessage('アイテムが削除されました。');
        setTimeout(() => setSuccessMessage(''), 3000);
        setLoading(false);
      } catch (error) {
        console.error('削除エラー:', error);
        setError('アイテムの削除中にエラーが発生しました。');
        setLoading(false);
      }
    }
  };
  
  // フォーム送信処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (modalType === 'download') {
        console.log('ダウンロードアイテム処理');
        // ダウンロードアイテムの入力検証
        if (!editItem.title || !editItem.category || !editItem.downloadUrl) {
          setError('タイトル、カテゴリー、ダウンロードURLは必須項目です。');
          setLoading(false);
          return;
        }
        
        // データのコピーを作成して操作
        const itemToSave = { ...editItem };
        console.log('保存するデータ:', itemToSave);
        
        // 必要なフィールドが欠けていないか確認
        if (!itemToSave.fileType) itemToSave.fileType = 'PDF';
        if (!itemToSave.lastUpdated) itemToSave.lastUpdated = new Date().toISOString().split('T')[0];
        
        // IDが空の場合は新規作成（IDは自動生成）
        if (!itemToSave.id) {
          console.log('新規アイテムを作成します（IDは自動生成されます）:', itemToSave);
          try {
            // IDフィールドを削除して、Supabaseが自動的にUUIDを生成するようにする
            const { id, ...itemWithoutId } = itemToSave;
            // Supabaseに新規アイテムを作成
            const newItem = await downloadService.createItem(itemWithoutId);
            console.log('作成されたアイテム:', newItem);
            
            // 画面表示を更新
            setDownloadItems(prevItems => [...prevItems, newItem]);
            setSuccessMessage('新しいダウンロードアイテムが追加されました。');
            setShowModal(false); // モーダルを閉じる
          } catch (createErr) {
            console.error('アイテム作成エラー:', createErr);
            setError(`アイテムの作成に失敗しました: ${createErr.message}`);
            setLoading(false);
            return;
          }
        } else {
          console.log('既存アイテムの更新を開始 - ID:', itemToSave.id);
          
          try {
            // 更新前のデータをログ出力
            console.log('更新前の入力データ:', itemToSave);
            
            // 更新処理を実行 - 簡略化した処理
            const updatedItem = await downloadService.updateItem(itemToSave.id, itemToSave);
            console.log('更新処理完了 - 結果:', updatedItem);
            
            // 画面表示を更新
            setDownloadItems(prevItems => 
              prevItems.map(item => item.id === itemToSave.id ? updatedItem : item)
            );
            
            setSuccessMessage('ダウンロードアイテムが更新されました。');
            setShowModal(false); // モーダルを閉じる
          } catch (err) {
            console.error('ダウンロードアイテム更新エラー:', err);
            setError(`アイテムの更新中にエラーが発生しました: ${err.message}`);
            setLoading(false);
            return;
          }
        }
      } else if (modalType === 'form') {
        console.log('フォーム処理');
        // フォームアイテムの入力検証
        if (!editItem.title || !editItem.category || !editItem.formUrl) {
          setError('タイトル、カテゴリー、フォームURLは必須項目です。');
          setLoading(false);
          return;
        }
        
        // IDが空の場合は新規作成
        if (!editItem.id) {
          console.log('新規フォームを作成します:', editItem);
          try {
            // Supabaseに新規フォームを作成
            const newItem = await formService.createForm(editItem);
            console.log('作成されたフォーム:', newItem);
            
            // 画面表示を更新
            setFormItems(prevItems => [...prevItems, newItem]);
            setSuccessMessage('新しいフォームが追加されました。');
            setShowModal(false); // モーダルを閉じる
          } catch (createErr) {
            console.error('フォーム作成エラー:', createErr);
            setError(`フォームの作成に失敗しました: ${createErr.message}`);
            setLoading(false);
            return;
          }
        } else {
          console.log('既存フォームの更新を開始 - ID:', editItem.id);
          
          try {
            // 更新前のデータをログ出力
            console.log('更新前の入力データ:', editItem);
            
            // 更新処理を実行 - 簡略化した処理
            const updatedItem = await formService.updateForm(editItem.id, editItem);
            console.log('更新処理完了 - 結果:', updatedItem);
            
            // 画面表示を更新
            setFormItems(prevItems => 
              prevItems.map(item => item.id === editItem.id ? updatedItem : item)
            );
            
            setSuccessMessage('フォームが更新されました。');
            setShowModal(false); // モーダルを閉じる
          } catch (err) {
            console.error('フォーム更新エラー:', err);
            setError(`フォームの更新中にエラーが発生しました: ${err.message}`);
            setLoading(false);
            return;
          }
        }
      } else if (modalType === 'faq') {
        console.log('FAQ処理');
        // FAQアイテムの入力検証
        if (!editItem.question || !editItem.answer || !editItem.category) {
          setError('質問、回答、カテゴリーは必須項目です。');
          setLoading(false);
          return;
        }
        
        // 新規作成の場合
        if (!editItem.id) {
          try {
            // IDフィールドはSupabaseが自動生成するので削除
            console.log('新規FAQを作成します:', editItem);
            
            // Supabaseに新規 FAQ を作成
            const newItem = await faqService.createFaq(editItem);
            console.log('作成されたFAQ:', newItem);
            
            // 画面表示を更新
            const newItems = [...faqData.items, newItem];
            setFaqData({ ...faqData, items: newItems });
            setSuccessMessage('新しいFAQが追加されました。');
            setShowModal(false); // モーダルを閉じる
          } catch (createErr) {
            console.error('FAQ作成エラー:', createErr);
            setError(`FAQの作成に失敗しました: ${createErr.message}`);
            setLoading(false);
            return;
          }
        } else {
          // 既存 FAQ の更新
          try {
            console.log('既存FAQを更新します:', editItem);
            const updatedItem = await faqService.updateFaq(editItem.id, editItem);
            console.log('更新されたFAQ:', updatedItem);
            
            // 画面表示を更新
            setFaqData(prevData => ({
              ...prevData,
              items: prevData.items.map(item => 
                item.id === editItem.id ? updatedItem : item
              )
            }));
            setSuccessMessage('FAQが更新されました。');
            setShowModal(false); // モーダルを閉じる
          } catch (updateErr) {
            console.error('FAQ更新エラー:', updateErr);
            setError(`FAQの更新に失敗しました: ${updateErr.message}`);
            setLoading(false);
            return;
          }
        }
      }
      
      // フォームの状態をリセット
      setEditItem({});
      setShowModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
      setLoading(false);
    } catch (error) {
      console.error('データの保存エラー:', error);
      setError('データの保存中にエラーが発生しました。');
      setLoading(false);
    }
  };
  
  // データのエクスポート
  const handleExport = () => {
    if (activeTab === 'downloads') {
      exportCSV(downloadItems, 'downloads.csv');
    } else if (activeTab === 'faq') {
      exportCSV(faqData.items, 'faq.csv');
    } else if (activeTab === 'forms') {
      exportCSV(formItems, 'forms.csv');
    }
    setSuccessMessage('データがエクスポートされました。');
  };
  
  // 入力フィールドの変更ハンドラ
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditItem({
      ...editItem,
      [name]: value
    });
  };
  
  // モーダルを閉じる共通関数
  const handleCloseModal = () => {
    setShowModal(false);
    setEditItem({});
    setError('');
  };
  
  if (loading) {
    return (
      <AdminContainer>
        <PageTitle>管理ダッシュボード</PageTitle>
        <p>データを読み込んでいます...</p>
      </AdminContainer>
    );
  }
  
  if (error && !downloadItems.length) {
    return (
      <AdminContainer>
        <PageTitle>管理ダッシュボード</PageTitle>
        <ErrorMessage>{error}</ErrorMessage>
      </AdminContainer>
    );
  }
  
  return (
    <AdminContainer>
      <PageTitle>管理ダッシュボード</PageTitle>
      
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <TabContainer>
        <Tab 
          $active={activeTab === 'downloads'} 
          onClick={() => setActiveTab('downloads')}
        >
          <FaDownload />
          ダウンロード管理
        </Tab>
        <Tab 
          $active={activeTab === 'faq'} 
          onClick={() => setActiveTab('faq')}
        >
          <FaQuestionCircle />
          FAQ管理
        </Tab>
        <Tab 
          $active={activeTab === 'forms'} 
          onClick={() => setActiveTab('forms')}
        >
          <FaClipboardList />
          フォーム管理
        </Tab>
      </TabContainer>
      
      {activeTab === 'downloads' && (
        <>
          <Button onClick={handleAddItem}><FaPlus /> 新規ダウンロードアイテム追加</Button>
          <Button onClick={handleExport}>CSVエクスポート</Button>
          
          <Table>
            <thead>
              <tr>
                <th>タイトル</th>
                <th>説明</th>
                <th>カテゴリー</th>
                <th>URL</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {downloadItems.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.description?.substring(0, 50)}...</td>
                  <td>{item.category}</td>
                  <td>
                    <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer">
                      {item.downloadUrl?.substring(0, 30)}...
                    </a>
                  </td>
                  <td>
                    <Button onClick={() => handleEditItem(item)}><FaEdit /> 編集</Button>
                    <DeleteButton onClick={() => handleDeleteItem(item.id)}><FaTrashAlt /> 削除</DeleteButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
      
      {activeTab === 'forms' && (
        <>
          <Button onClick={handleAddItem}><FaPlus /> 新規フォーム追加</Button>
          <Button onClick={handleExport}>CSVエクスポート</Button>
          
          <Table>
            <thead>
              <tr>
                <th>タイトル</th>
                <th>説明</th>
                <th>カテゴリー</th>
                <th>フォームURL</th>
                <th>締切</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {formItems.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.description?.substring(0, 50)}...</td>
                  <td>{item.category}</td>
                  <td>
                    <a href={item.formUrl} target="_blank" rel="noopener noreferrer">
                      {item.formUrl?.substring(0, 30)}...
                    </a>
                  </td>
                  <td>{item.deadline}</td>
                  <td>
                    <Button onClick={() => handleEditItem(item)}><FaEdit /> 編集</Button>
                    <DeleteButton onClick={() => handleDeleteItem(item.id)}><FaTrashAlt /> 削除</DeleteButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
      
      {activeTab === 'faq' && (
        <>
          <Button onClick={handleAddItem}><FaPlus /> 新規FAQ追加</Button>
          <Button onClick={handleExport} style={{ marginLeft: '10px' }}>JSONエクスポート</Button>
          
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>質問</th>
                <th>カテゴリー</th>
                <th>優先度</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {faqData.items.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.question}</td>
                  <td>{getCategoryName(item.category, faqData.categories)}</td>
                  <td>{item.priority}</td>
                  <td>
                    <Button onClick={() => handleEditItem(item)}><FaEdit /> 編集</Button>
                    <DeleteButton onClick={() => handleDeleteItem(item.id)}><FaTrashAlt /> 削除</DeleteButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
      
      {showModal && (
        <Modal>
          <ModalContent>
            {modalType === 'download' && (
              <>
                <ModalHeader>
                  <h2>
                    {editItem.id ? <><FaEdit /> アイテムを編集</> : <><FaPlus /> 新規アイテムを追加</>}
                  </h2>
                  <CloseButton onClick={handleCloseModal}><FaTimes /></CloseButton>
                </ModalHeader>
                
                <form onSubmit={handleSubmit}>
                  {editItem.id && (
                    <FormGroup>
                      <Label htmlFor="id">ID</Label>
                      <Input 
                        type="text" 
                        id="id" 
                        name="id" 
                        value={editItem.id} 
                        onChange={handleInputChange}
                        disabled
                        readOnly
                      />
                      <small>IDは編集できません</small>
                    </FormGroup>
                  )}
                  
                  <FormGroup>
                    <Label htmlFor="category">カテゴリー</Label>
                    <Select 
                      id="category" 
                      name="category" 
                      value={editItem.category} 
                      onChange={handleInputChange}
                      required
                    >
                      <option value="sponsor">ブース出展者向け資料</option>
                      <option value="speaker">登壇者向け資料</option>
                      <option value="branding">ブランド資料</option>
                      <option value="press">プレス向け資料</option>
                      <option value="general">一般資料</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="title">タイトル</Label>
                    <Input 
                      type="text" 
                      id="title" 
                      name="title" 
                      value={editItem.title} 
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="description">説明</Label>
                    <Input 
                      type="text" 
                      id="description" 
                      name="description" 
                      value={editItem.description} 
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="fileType">ファイル形式</Label>
                    <Select 
                      id="fileType" 
                      name="fileType" 
                      value={editItem.fileType} 
                      onChange={handleInputChange}
                    >
                      <option value="PDF">PDF</option>
                      <option value="PPTX">PPTX</option>
                      <option value="DOCX">DOCX</option>
                      <option value="XLSX">XLSX</option>
                      <option value="ZIP">ZIP</option>
                      <option value="JPG">JPG</option>
                      <option value="PNG">PNG</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="fileSize">ファイルサイズ</Label>
                    <Input 
                      type="text" 
                      id="fileSize" 
                      name="fileSize" 
                      value={editItem.fileSize} 
                      onChange={handleInputChange}
                      placeholder="例: 2.4MB"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="downloadUrl">ダウンロードURL</Label>
                    <Input 
                      type="text" 
                      id="downloadUrl" 
                      name="downloadUrl" 
                      value={editItem.downloadUrl} 
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="lastUpdated">最終更新日</Label>
                    <Input 
                      type="date" 
                      id="lastUpdated" 
                      name="lastUpdated" 
                      value={editItem.lastUpdated} 
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  
                  <Button type="submit"><FaCheck /> 保存</Button>
                  <Button type="button" onClick={() => setShowModal(false)}><FaTimes /> キャンセル</Button>
                </form>
              </>
            )}
            
            {modalType === 'form' && (
              <>
                <ModalHeader>
                  <h2>
                    {editItem.id ? <><FaEdit /> フォームを編集</> : <><FaPlus /> 新規フォームを追加</>}
                  </h2>
                  <CloseButton onClick={handleCloseModal}><FaTimes /></CloseButton>
                </ModalHeader>
                
                <form onSubmit={handleSubmit}>
                  {editItem.id && (
                    <FormGroup>
                      <Label htmlFor="id">ID</Label>
                      <Input 
                        type="text" 
                        id="id" 
                        name="id" 
                        value={editItem.id} 
                        onChange={handleInputChange}
                        disabled
                      />
                    </FormGroup>
                  )}
                  
                  <FormGroup>
                    <Label htmlFor="title">タイトル</Label>
                    <Input 
                      type="text" 
                      id="title" 
                      name="title" 
                      value={editItem.title} 
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="description">説明</Label>
                    <textarea 
                      id="description" 
                      name="description" 
                      value={editItem.description} 
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="category">カテゴリー</Label>
                    <Select 
                      id="category" 
                      name="category" 
                      value={editItem.category} 
                      onChange={handleInputChange}
                      required
                    >
                      <option value="sponsor">各種申請</option>
                      <option value="speaker">講演者向け</option>
                      <option value="press">プレス向け</option>
                      <option value="general">一般</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="formUrl">フォームURL (Google Forms等)</Label>
                    <Input 
                      type="url" 
                      id="formUrl" 
                      name="formUrl" 
                      value={editItem.formUrl} 
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="deadline">提出期限</Label>
                    <Input 
                      type="text" 
                      id="deadline" 
                      name="deadline" 
                      value={editItem.deadline} 
                      onChange={handleInputChange}
                      placeholder="例: 2025年8月22日（金）"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>
                      <input 
                        type="checkbox" 
                        name="isRequired" 
                        checked={editItem.isRequired} 
                        onChange={(e) => setEditItem({...editItem, isRequired: e.target.checked})}
                      />
                      必須提出物
                    </Label>
                  </FormGroup>
                  
                  <Button type="submit"><FaCheck /> 保存</Button>
                  <Button type="button" onClick={() => setShowModal(false)}><FaTimes /> キャンセル</Button>
                </form>
              </>
            )}
            
            {modalType === 'faq' && (
              <>
                <ModalHeader>
                  <h2>
                    {editItem.id ? <><FaEdit /> FAQを編集</> : <><FaPlus /> 新規FAQを追加</>}
                  </h2>
                  <CloseButton onClick={handleCloseModal}><FaTimes /></CloseButton>
                </ModalHeader>
                
                <form onSubmit={handleSubmit}>
                  {editItem.id && (
                    <FormGroup>
                      <Label htmlFor="id">ID</Label>
                      <Input 
                        type="text" 
                        id="id" 
                        name="id" 
                        value={editItem.id} 
                        onChange={handleInputChange}
                        disabled
                      />
                      <small>IDは自動生成されます</small>
                    </FormGroup>
                  )}
                  
                  <FormGroup>
                    <Label htmlFor="category">カテゴリー</Label>
                    <Select 
                      id="category" 
                      name="category" 
                      value={editItem.category} 
                      onChange={handleInputChange}
                      required
                    >
                      {faqData.categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="question">質問</Label>
                    <Input 
                      type="text" 
                      id="question" 
                      name="question" 
                      value={editItem.question} 
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="answer">回答</Label>
                    <textarea 
                      id="answer" 
                      name="answer" 
                      value={editItem.answer} 
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        minHeight: '150px',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontFamily: 'inherit',
                        fontSize: '1rem'
                      }}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="priority">優先度</Label>
                    <Select 
                      id="priority" 
                      name="priority" 
                      value={editItem.priority} 
                      onChange={handleInputChange}
                    >
                      <option value="1">1 (最高)</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5 (最低)</option>
                    </Select>
                  </FormGroup>
                  
                  <Button type="submit"><FaCheck /> 保存</Button>
                  <Button type="button" onClick={() => setShowModal(false)}><FaTimes /> キャンセル</Button>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      
      {/* 秘密の部屋へのボタン */}
      <SecretRoomButton onClick={() => navigate('/admin/secret-room')}><FaLock /> 秘密の部屋</SecretRoomButton>
    </AdminContainer>
  );
};

export default Admin;
