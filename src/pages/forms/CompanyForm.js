import React, { useState } from 'react';
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
  SuccessMessage,
  CheckboxContainer,
  FormCheckbox
} from '../../components/FormComponents';

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyNameEn: '',
    industry: '',
    companySize: '',
    website: '',
    postalCode: '',
    address: '',
    description: '',
    productInfo: '',
    primaryContactName: '',
    primaryContactTitle: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    secondaryContactName: '',
    secondaryContactEmail: '',
    secondaryContactPhone: '',
    logo: null,
    companyImage: null,
    socialMedia: {
      twitter: '',
      facebook: '',
      linkedin: '',
      instagram: ''
    },
    exhibitPurpose: [],
    exhibitCategory: '',
    additionalNotes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
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
  
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      socialMedia: {
        ...formData.socialMedia,
        [name]: value
      }
    });
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    let updatedPurposes = [...formData.exhibitPurpose];
    
    if (checked) {
      updatedPurposes.push(name);
    } else {
      updatedPurposes = updatedPurposes.filter(purpose => purpose !== name);
    }
    
    setFormData({
      ...formData,
      exhibitPurpose: updatedPurposes
    });
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
  
  const removeFile = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: null
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // 必須フィールドの検証
    if (!formData.companyName.trim()) {
      newErrors.companyName = '会社名は必須です';
    }
    
    if (!formData.industry) {
      newErrors.industry = '業種は必須です';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '会社概要は必須です';
    } else if (formData.description.length > 500) {
      newErrors.description = '500文字以内で入力してください';
    }
    
    if (!formData.primaryContactName.trim()) {
      newErrors.primaryContactName = '担当者名は必須です';
    }
    
    if (!formData.primaryContactEmail.trim()) {
      newErrors.primaryContactEmail = 'メールアドレスは必須です';
    } else if (!/\S+@\S+\.\S+/.test(formData.primaryContactEmail)) {
      newErrors.primaryContactEmail = '有効なメールアドレスを入力してください';
    }
    
    if (!formData.primaryContactPhone.trim()) {
      newErrors.primaryContactPhone = '電話番号は必須です';
    }
    
    if (!formData.logo) {
      newErrors.logo = '企業ロゴは必須です';
    }
    
    if (!formData.exhibitCategory) {
      newErrors.exhibitCategory = '出展カテゴリは必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // フォーム送信処理（APIリクエストなど）
      console.log('Form submitted:', formData);
      
      // 送信成功
      setSubmitted(true);
      
      // フォームをリセット
      setFormData({
        companyName: '',
        companyNameEn: '',
        industry: '',
        companySize: '',
        website: '',
        postalCode: '',
        address: '',
        description: '',
        productInfo: '',
        primaryContactName: '',
        primaryContactTitle: '',
        primaryContactEmail: '',
        primaryContactPhone: '',
        secondaryContactName: '',
        secondaryContactEmail: '',
        secondaryContactPhone: '',
        logo: null,
        companyImage: null,
        socialMedia: {
          twitter: '',
          facebook: '',
          linkedin: '',
          instagram: ''
        },
        exhibitPurpose: [],
        exhibitCategory: '',
        additionalNotes: ''
      });
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
          <h3>企業情報が送信されました</h3>
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
      <FormTitle>企業情報フォーム</FormTitle>
      <FormDescription>
        出展企業の基本情報、ロゴ、会社概要などを登録してください。
        <br />
        <strong>※</strong> マークの項目は必須です。
      </FormDescription>
      
      <form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>基本情報</SectionTitle>
          
          <FormGroup>
            <FormLabel>会社名<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="例：株式会社サンプル"
            />
            {errors.companyName && <ErrorMessage>{errors.companyName}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>会社名（英語表記）</FormLabel>
            <FormInput
              type="text"
              name="companyNameEn"
              value={formData.companyNameEn}
              onChange={handleChange}
              placeholder="例：Sample Corporation"
            />
            <HelpText>英語での表記が必要な場合に使用します。</HelpText>
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>業種<RequiredMark>※</RequiredMark></FormLabel>
              <FormSelect
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                <option value="manufacturing">製造業</option>
                <option value="it">情報通信業</option>
                <option value="finance">金融・保険業</option>
                <option value="retail">小売業</option>
                <option value="construction">建設業</option>
                <option value="transportation">運輸・物流業</option>
                <option value="energy">エネルギー・資源</option>
                <option value="healthcare">医療・ヘルスケア</option>
                <option value="education">教育</option>
                <option value="consulting">コンサルティング</option>
                <option value="other">その他</option>
              </FormSelect>
              {errors.industry && <ErrorMessage>{errors.industry}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>企業規模</FormLabel>
              <FormSelect
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                <option value="small">小規模（50名未満）</option>
                <option value="medium">中規模（50～300名未満）</option>
                <option value="large">大規模（300～1000名未満）</option>
                <option value="enterprise">超大規模（1000名以上）</option>
              </FormSelect>
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel>ウェブサイトURL</FormLabel>
            <FormInput
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="例：https://www.example.com"
            />
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>郵便番号</FormLabel>
              <FormInput
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="例：123-4567"
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>住所</FormLabel>
              <FormInput
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="例：東京都千代田区○○町1-2-3"
              />
            </FormGroup>
          </TwoColumnLayout>
        </FormSection>
        
        <FormSection>
          <SectionTitle>会社概要</SectionTitle>
          
          <FormGroup>
            <FormLabel>会社概要<RequiredMark>※</RequiredMark></FormLabel>
            <FormTextarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="会社の概要、ビジョン、ミッションなどを500文字以内で入力してください。"
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
            <HelpText>残り{500 - formData.description.length}文字（ウェブサイトやプログラムに掲載されます）</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>製品・サービス情報</FormLabel>
            <FormTextarea
              name="productInfo"
              value={formData.productInfo}
              onChange={handleChange}
              placeholder="展示予定の製品・サービスについて説明してください。"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>企業ロゴ<RequiredMark>※</RequiredMark></FormLabel>
            <FileUploadArea>
              <FileInput
                type="file"
                id="logo"
                name="logo"
                accept="image/*,.ai,.eps"
                onChange={handleFileChange}
              />
              <FileInputLabel htmlFor="logo">
                <FileUploadIcon>🖼️</FileUploadIcon>
                <p>クリックしてロゴをアップロード</p>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>PNG、JPG、AI、EPS形式（推奨サイズ：300dpi以上）</p>
              </FileInputLabel>
            </FileUploadArea>
            {formData.logo && (
              <FileInfo>
                <span>{formData.logo.name}</span>
                <DeleteButton type="button" onClick={() => removeFile('logo')}>
                  ✕
                </DeleteButton>
              </FileInfo>
            )}
            {errors.logo && <ErrorMessage>{errors.logo}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>会社イメージ画像</FormLabel>
            <FileUploadArea>
              <FileInput
                type="file"
                id="companyImage"
                name="companyImage"
                accept="image/*"
                onChange={handleFileChange}
              />
              <FileInputLabel htmlFor="companyImage">
                <FileUploadIcon>🏢</FileUploadIcon>
                <p>クリックして画像をアップロード</p>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>PNG、JPG形式（推奨サイズ：1200x800px以上）</p>
              </FileInputLabel>
            </FileUploadArea>
            {formData.companyImage && (
              <FileInfo>
                <span>{formData.companyImage.name}</span>
                <DeleteButton type="button" onClick={() => removeFile('companyImage')}>
                  ✕
                </DeleteButton>
              </FileInfo>
            )}
            <HelpText>ウェブサイトやプログラムに掲載される可能性があります。</HelpText>
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>担当者情報</SectionTitle>
          
          <FormGroup>
            <FormLabel>主担当者名<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="primaryContactName"
              value={formData.primaryContactName}
              onChange={handleChange}
              placeholder="例：山田 太郎"
            />
            {errors.primaryContactName && <ErrorMessage>{errors.primaryContactName}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>役職</FormLabel>
            <FormInput
              type="text"
              name="primaryContactTitle"
              value={formData.primaryContactTitle}
              onChange={handleChange}
              placeholder="例：マーケティング部長"
            />
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>メールアドレス<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="email"
                name="primaryContactEmail"
                value={formData.primaryContactEmail}
                onChange={handleChange}
                placeholder="例：sample@example.com"
              />
              {errors.primaryContactEmail && <ErrorMessage>{errors.primaryContactEmail}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>電話番号<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="tel"
                name="primaryContactPhone"
                value={formData.primaryContactPhone}
                onChange={handleChange}
                placeholder="例：03-1234-5678"
              />
              {errors.primaryContactPhone && <ErrorMessage>{errors.primaryContactPhone}</ErrorMessage>}
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel>副担当者名</FormLabel>
            <FormInput
              type="text"
              name="secondaryContactName"
              value={formData.secondaryContactName}
              onChange={handleChange}
              placeholder="例：佐藤 花子"
            />
            <HelpText>主担当者が不在の場合の連絡先です。</HelpText>
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>副担当者メールアドレス</FormLabel>
              <FormInput
                type="email"
                name="secondaryContactEmail"
                value={formData.secondaryContactEmail}
                onChange={handleChange}
                placeholder="例：sample2@example.com"
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>副担当者電話番号</FormLabel>
              <FormInput
                type="tel"
                name="secondaryContactPhone"
                value={formData.secondaryContactPhone}
                onChange={handleChange}
                placeholder="例：03-1234-5678"
              />
            </FormGroup>
          </TwoColumnLayout>
        </FormSection>
        
        <FormSection>
          <SectionTitle>ソーシャルメディア</SectionTitle>
          
          <FormGroup>
            <FormLabel>Twitter</FormLabel>
            <FormInput
              type="text"
              name="twitter"
              value={formData.socialMedia.twitter}
              onChange={handleSocialMediaChange}
              placeholder="例：https://twitter.com/username"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Facebook</FormLabel>
            <FormInput
              type="text"
              name="facebook"
              value={formData.socialMedia.facebook}
              onChange={handleSocialMediaChange}
              placeholder="例：https://facebook.com/pagename"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>LinkedIn</FormLabel>
            <FormInput
              type="text"
              name="linkedin"
              value={formData.socialMedia.linkedin}
              onChange={handleSocialMediaChange}
              placeholder="例：https://linkedin.com/company/companyname"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Instagram</FormLabel>
            <FormInput
              type="text"
              name="instagram"
              value={formData.socialMedia.instagram}
              onChange={handleSocialMediaChange}
              placeholder="例：https://instagram.com/username"
            />
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>出展情報</SectionTitle>
          
          <FormGroup>
            <FormLabel>出展目的（複数選択可）</FormLabel>
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="purpose-branding"
                name="branding"
                checked={formData.exhibitPurpose.includes('branding')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="purpose-branding">ブランディング・認知度向上</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="purpose-leads"
                name="leads"
                checked={formData.exhibitPurpose.includes('leads')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="purpose-leads">リード獲得</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="purpose-sales"
                name="sales"
                checked={formData.exhibitPurpose.includes('sales')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="purpose-sales">製品・サービスの販売促進</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="purpose-networking"
                name="networking"
                checked={formData.exhibitPurpose.includes('networking')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="purpose-networking">ネットワーキング</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="purpose-recruitment"
                name="recruitment"
                checked={formData.exhibitPurpose.includes('recruitment')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="purpose-recruitment">採用活動</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="purpose-research"
                name="research"
                checked={formData.exhibitPurpose.includes('research')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="purpose-research">市場調査</label>
            </CheckboxContainer>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>出展カテゴリ<RequiredMark>※</RequiredMark></FormLabel>
            <FormSelect
              name="exhibitCategory"
              value={formData.exhibitCategory}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              <option value="data_analysis">データ分析ソリューション</option>
              <option value="ai_ml">AI・機械学習</option>
              <option value="iot">IoT・センサー技術</option>
              <option value="cloud">クラウドサービス</option>
              <option value="security">セキュリティソリューション</option>
              <option value="automation">業務自動化</option>
              <option value="erp">ERP・基幹システム</option>
              <option value="consulting">コンサルティングサービス</option>
              <option value="education">教育・トレーニング</option>
              <option value="hardware">ハードウェア</option>
              <option value="other">その他</option>
            </FormSelect>
            {errors.exhibitCategory && <ErrorMessage>{errors.exhibitCategory}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>追加情報</FormLabel>
            <FormTextarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="その他、出展に関する要望や質問があれば入力してください。"
            />
          </FormGroup>
        </FormSection>
        
        <SubmitButton type="submit">送信する</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default CompanyForm;
