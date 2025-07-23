import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FormContainer,
  FormTitle,
  FormDescription,
  FormGroup,
  FormLabel,
  RequiredMark,
  FormInput,
  FormTextarea,
  FormSelect,
  SubmitButton,
  ErrorMessage,
  HelpText,
  FormSection,
  SectionTitle,
  TwoColumnLayout,
  FileUploadArea,
  FileInput,
  FileInputLabel,
  FileUploadIcon,
  FileInfo,
  DeleteButton,
  SuccessMessage
} from '../../components/FormComponents';

// Google Formsとの連携用ユーティリティをインポート
import { submitToGoogleForms, mapSessionFormData, FORM_IDS } from '../../utils/googleFormsService';
// Google認証関連の機能をインポート
import { checkAndSignIn } from '../../utils/authService';

const SessionForm = () => {
  const [formData, setFormData] = useState({
    sessionTitle: '',
    sessionType: '',
    sessionTrack: '',
    sessionLevel: '',
    sessionSummary: '',
    sessionDetail: '',
    sessionGoals: '',
    sessionKeywords: '',
    speakerName: '',
    speakerTitle: '',
    speakerCompany: '',
    speakerBio: '',
    speakerEmail: '',
    speakerPhone: '',
    coSpeakers: '',
    presentationFile: null,
    speakerPhoto: null,
    specialRequests: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ファイルアップロードの処理
  // 注意: Google Formsはファイルアップロードをサポートしていませんが、将来的に別のサービスで実装するために残しておきます
  const handleFileUpload = (e, name) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        [name]: file
      });
    }
  };

  // ページ読み込み時にGoogleログイン状態を確認
  useEffect(() => {
    // 認証機能が実装されるまでコメントアウト
    // checkAndSignIn();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // エラーをクリア
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      
      // エラーをクリア
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null
        });
      }
    }
  };
  
  const removeFile = (name) => {
    setFormData({
      ...formData,
      [name]: null
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // 必須フィールドの検証
    if (!formData.sessionTitle.trim()) {
      newErrors.sessionTitle = 'セッションタイトルは必須です';
    }
    
    if (!formData.sessionType) {
      newErrors.sessionType = 'セッションタイプは必須です';
    }
    
    if (!formData.sessionTrack) {
      newErrors.sessionTrack = 'セッショントラックは必須です';
    }
    
    if (!formData.sessionSummary.trim()) {
      newErrors.sessionSummary = 'セッション概要は必須です';
    } else if (formData.sessionSummary.length > 300) {
      newErrors.sessionSummary = '300文字以内で入力してください';
    }
    
    if (!formData.speakerName.trim()) {
      newErrors.speakerName = '講演者名は必須です';
    }
    
    if (!formData.speakerCompany.trim()) {
      newErrors.speakerCompany = '会社/組織名は必須です';
    }
    
    if (!formData.speakerEmail.trim()) {
      newErrors.speakerEmail = 'メールアドレスは必須です';
    } else if (!/\S+@\S+\.\S+/.test(formData.speakerEmail)) {
      newErrors.speakerEmail = '有効なメールアドレスを入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Google Formsにデータを送信
        const mappedData = mapSessionFormData(formData);
        const success = await submitToGoogleForms(FORM_IDS.session, mappedData);
        
        if (success) {
          console.log('Form data submitted to Google Forms:', formData);
          
          // 送信成功
          setSubmitted(true);
          
          // フォームをリセット
          setFormData({
            sessionTitle: '',
            sessionType: '',
            sessionTrack: '',
            sessionLevel: '',
            sessionSummary: '',
            sessionDetail: '',
            sessionGoals: '',
            sessionKeywords: '',
            speakerName: '',
            speakerTitle: '',
            speakerCompany: '',
            speakerBio: '',
            speakerEmail: '',
            speakerPhone: '',
            coSpeakers: '',
            presentationFile: null,
            speakerPhoto: null,
            specialRequests: ''
          });
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('フォームの送信中にエラーが発生しました。再度お試しください。');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // エラーがある場合は最初のエラー要素にスクロール
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const errorElement = document.querySelector(`[name="${firstError}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };
  
  if (submitted) {
    return (
      <FormContainer>
        <SuccessMessage>
          <h3>セッション情報が送信されました</h3>
          <p>ご提出ありがとうございます。内容を確認し、後ほどメールでご連絡いたします。</p>
        </SuccessMessage>
        <Link to="/forms" style={{ display: 'block', textAlign: 'center', marginTop: '2rem' }}>
          フォーム一覧に戻る
        </Link>
      </FormContainer>
    );
  }
  
  return (
    <FormContainer>
      <FormTitle>セッション情報フォーム</FormTitle>
      <FormDescription>
        講演内容、セッションタイトル、概要などの情報を登録してください。
        <br />
        <strong>※</strong> マークの項目は必須です。
      </FormDescription>
      
      <form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>セッション情報</SectionTitle>
          
          <FormGroup>
            <FormLabel htmlFor="sessionTitle">
              セッションタイトル <RequiredMark>※</RequiredMark>
            </FormLabel>
            <FormInput
              type="text"
              id="sessionTitle"
              name="sessionTitle"
              value={formData.sessionTitle}
              onChange={handleChange}
              placeholder="例：データ分析による業務効率化の実践例"
              maxLength={100}
            />
            {errors.sessionTitle && <ErrorMessage>{errors.sessionTitle}</ErrorMessage>}
            <HelpText>100文字以内で入力してください</HelpText>
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel htmlFor="sessionType">
                セッションタイプ <RequiredMark>※</RequiredMark>
              </FormLabel>
              <FormSelect
                id="sessionType"
                name="sessionType"
                value={formData.sessionType}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                <option value="presentation">プレゼンテーション（30分）</option>
                <option value="workshop">ワークショップ（60分）</option>
                <option value="panel">パネルディスカッション（45分）</option>
                <option value="case_study">ケーススタディ（30分）</option>
                <option value="lightning">ライトニングトーク（10分）</option>
              </FormSelect>
              {errors.sessionType && <ErrorMessage>{errors.sessionType}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="sessionTrack">
                セッショントラック <RequiredMark>※</RequiredMark>
              </FormLabel>
              <FormSelect
                id="sessionTrack"
                name="sessionTrack"
                value={formData.sessionTrack}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                <option value="data_analytics">データ分析・可視化</option>
                <option value="ai_ml">AI・機械学習</option>
                <option value="data_infrastructure">データ基盤・アーキテクチャ</option>
                <option value="data_governance">データガバナンス・セキュリティ</option>
                <option value="business_strategy">ビジネス戦略・活用事例</option>
                <option value="future_trends">未来動向・イノベーション</option>
              </FormSelect>
              {errors.sessionTrack && <ErrorMessage>{errors.sessionTrack}</ErrorMessage>}
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel htmlFor="sessionLevel">
              対象レベル
            </FormLabel>
            <FormSelect
              id="sessionLevel"
              name="sessionLevel"
              value={formData.sessionLevel}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              <option value="beginner">初級（基礎知識がある方向け）</option>
              <option value="intermediate">中級（実務経験がある方向け）</option>
              <option value="advanced">上級（専門知識がある方向け）</option>
              <option value="all">全レベル（幅広い層向け）</option>
            </FormSelect>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="sessionSummary">
              セッション概要 <RequiredMark>※</RequiredMark>
            </FormLabel>
            <FormTextarea
              id="sessionSummary"
              name="sessionSummary"
              value={formData.sessionSummary}
              onChange={handleChange}
              placeholder="セッションの概要を簡潔に記載してください"
              rows={3}
              maxLength={300}
            />
            {errors.sessionSummary && <ErrorMessage>{errors.sessionSummary}</ErrorMessage>}
            <HelpText>300文字以内で入力してください（プログラムに掲載されます）</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="sessionDetail">
              セッション詳細
            </FormLabel>
            <FormTextarea
              id="sessionDetail"
              name="sessionDetail"
              value={formData.sessionDetail}
              onChange={handleChange}
              placeholder="セッションの詳細な内容を記載してください"
              rows={6}
            />
            <HelpText>アジェンダ、取り上げるトピック、参加者が得られる知見などを記載してください</HelpText>
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel htmlFor="sessionGoals">
                セッションのゴール
              </FormLabel>
              <FormTextarea
                id="sessionGoals"
                name="sessionGoals"
                value={formData.sessionGoals}
                onChange={handleChange}
                placeholder="参加者が得られる知見や学びを記載してください"
                rows={4}
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="sessionKeywords">
                キーワード
              </FormLabel>
              <FormTextarea
                id="sessionKeywords"
                name="sessionKeywords"
                value={formData.sessionKeywords}
                onChange={handleChange}
                placeholder="関連するキーワードをカンマ区切りで入力してください"
                rows={4}
              />
              <HelpText>例：データ分析, ビジュアライゼーション, ダッシュボード</HelpText>
            </FormGroup>
          </TwoColumnLayout>
        </FormSection>
        
        <FormSection>
          <SectionTitle>講演者情報</SectionTitle>
          
          <FormGroup>
            <FormLabel htmlFor="speakerName">
              講演者名 <RequiredMark>※</RequiredMark>
            </FormLabel>
            <FormInput
              type="text"
              id="speakerName"
              name="speakerName"
              value={formData.speakerName}
              onChange={handleChange}
              placeholder="例：山田 太郎"
            />
            {errors.speakerName && <ErrorMessage>{errors.speakerName}</ErrorMessage>}
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel htmlFor="speakerTitle">
                役職
              </FormLabel>
              <FormInput
                type="text"
                id="speakerTitle"
                name="speakerTitle"
                value={formData.speakerTitle}
                onChange={handleChange}
                placeholder="例：データサイエンティスト"
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="speakerCompany">
                会社/組織名 <RequiredMark>※</RequiredMark>
              </FormLabel>
              <FormInput
                type="text"
                id="speakerCompany"
                name="speakerCompany"
                value={formData.speakerCompany}
                onChange={handleChange}
                placeholder="例：株式会社プライムナンバー"
              />
              {errors.speakerCompany && <ErrorMessage>{errors.speakerCompany}</ErrorMessage>}
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel htmlFor="speakerBio">
              略歴
            </FormLabel>
            <FormTextarea
              id="speakerBio"
              name="speakerBio"
              value={formData.speakerBio}
              onChange={handleChange}
              placeholder="講演者の経歴や実績を記載してください"
              rows={4}
            />
            <HelpText>プログラムに掲載される可能性があります</HelpText>
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel htmlFor="speakerEmail">
                メールアドレス <RequiredMark>※</RequiredMark>
              </FormLabel>
              <FormInput
                type="email"
                id="speakerEmail"
                name="speakerEmail"
                value={formData.speakerEmail}
                onChange={handleChange}
                placeholder="例：taro.yamada@example.com"
              />
              {errors.speakerEmail && <ErrorMessage>{errors.speakerEmail}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="speakerPhone">
                電話番号
              </FormLabel>
              <FormInput
                type="tel"
                id="speakerPhone"
                name="speakerPhone"
                value={formData.speakerPhone}
                onChange={handleChange}
                placeholder="例：03-1234-5678"
              />
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel htmlFor="coSpeakers">
              共同講演者
            </FormLabel>
            <FormTextarea
              id="coSpeakers"
              name="coSpeakers"
              value={formData.coSpeakers}
              onChange={handleChange}
              placeholder="共同講演者がいる場合は、氏名、役職、会社/組織名を記載してください"
              rows={3}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="speakerPhoto">
              講演者写真
            </FormLabel>
            <FileUploadArea>
              {formData.speakerPhoto ? (
                <FileInfo>
                  <span>{formData.speakerPhoto.name}</span>
                  <DeleteButton type="button" onClick={() => removeFile('speakerPhoto')}>
                    削除
                  </DeleteButton>
                </FileInfo>
              ) : (
                <>
                  <FileInputLabel htmlFor="speakerPhoto">
                    <FileUploadIcon />
                    ファイルを選択
                  </FileInputLabel>
                  <FileInput
                    type="file"
                    id="speakerPhoto"
                    name="speakerPhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </>
              )}
            </FileUploadArea>
            <HelpText>JPG、PNG形式で3MB以内のファイルをアップロードしてください</HelpText>
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>その他</SectionTitle>
          
          <FormGroup>
            <FormLabel htmlFor="presentationFile">
              プレゼンテーション資料（ドラフト）
            </FormLabel>
            <FileUploadArea>
              {formData.presentationFile ? (
                <FileInfo>
                  <span>{formData.presentationFile.name}</span>
                  <DeleteButton type="button" onClick={() => removeFile('presentationFile')}>
                    削除
                  </DeleteButton>
                </FileInfo>
              ) : (
                <>
                  <FileInputLabel htmlFor="presentationFile">
                    <FileUploadIcon />
                    ファイルを選択
                  </FileInputLabel>
                  <FileInput
                    type="file"
                    id="presentationFile"
                    name="presentationFile"
                    accept=".pdf,.ppt,.pptx"
                    onChange={handleFileChange}
                  />
                </>
              )}
            </FileUploadArea>
            <HelpText>PDF、PowerPoint形式で10MB以内のファイルをアップロードしてください</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="specialRequests">
              特別な要望
            </FormLabel>
            <FormTextarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="機材や環境設定など、特別な要望があれば記載してください"
              rows={4}
            />
          </FormGroup>
        </FormSection>
        
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '送信中...' : 'フォームを送信する'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default SessionForm;
