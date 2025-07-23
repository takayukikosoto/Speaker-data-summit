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
  RadioContainer,
  RadioOption,
  FormRadio,
  CheckboxContainer,
  FormCheckbox,
  SuccessMessage,
  TwoColumnLayout
} from '../../components/FormComponents';

const SponsorForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyId: '',
    sponsorshipLevel: '',
    additionalOptions: [],
    paymentMethod: '',
    billingAddress: '',
    billingPostalCode: '',
    billingContactName: '',
    billingContactEmail: '',
    billingContactPhone: '',
    invoiceRequirements: '',
    logoDisplay: 'yes',
    advertisingRequirements: '',
    presentationSlot: 'no',
    presentationTopic: '',
    presentationSpeaker: '',
    specialRequests: '',
    termsAccepted: false
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
  
  const handleRadioChange = (e) => {
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
  
  const handleCheckboxChange = (e) => {
    const { name, checked, value } = e.target;
    
    if (name === 'termsAccepted') {
      setFormData({
        ...formData,
        [name]: checked
      });
      
      // エラーをクリア
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null
        });
      }
      return;
    }
    
    const arrayFieldName = e.target.getAttribute('data-field');
    
    if (arrayFieldName) {
      let updatedArray = [...formData[arrayFieldName]];
      
      if (checked) {
        updatedArray.push(value);
      } else {
        updatedArray = updatedArray.filter(item => item !== value);
      }
      
      setFormData({
        ...formData,
        [arrayFieldName]: updatedArray
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // 必須フィールドの検証
    if (!formData.companyName.trim()) {
      newErrors.companyName = '会社名は必須です';
    }
    
    if (!formData.companyId.trim()) {
      newErrors.companyId = '企業IDは必須です';
    }
    
    if (!formData.sponsorshipLevel) {
      newErrors.sponsorshipLevel = 'スポンサーシップレベルは必須です';
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = '支払い方法は必須です';
    }
    
    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = '請求先住所は必須です';
    }
    
    if (!formData.billingPostalCode.trim()) {
      newErrors.billingPostalCode = '郵便番号は必須です';
    }
    
    if (!formData.billingContactName.trim()) {
      newErrors.billingContactName = '請求先担当者名は必須です';
    }
    
    if (!formData.billingContactEmail.trim()) {
      newErrors.billingContactEmail = 'メールアドレスは必須です';
    } else if (!/\S+@\S+\.\S+/.test(formData.billingContactEmail)) {
      newErrors.billingContactEmail = '有効なメールアドレスを入力してください';
    }
    
    if (!formData.billingContactPhone.trim()) {
      newErrors.billingContactPhone = '電話番号は必須です';
    }
    
    if (formData.presentationSlot === 'yes' && !formData.presentationTopic.trim()) {
      newErrors.presentationTopic = 'プレゼンテーションのトピックは必須です';
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = '利用規約に同意する必要があります';
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
        companyId: '',
        sponsorshipLevel: '',
        additionalOptions: [],
        paymentMethod: '',
        billingAddress: '',
        billingPostalCode: '',
        billingContactName: '',
        billingContactEmail: '',
        billingContactPhone: '',
        invoiceRequirements: '',
        logoDisplay: 'yes',
        advertisingRequirements: '',
        presentationSlot: 'no',
        presentationTopic: '',
        presentationSpeaker: '',
        specialRequests: '',
        termsAccepted: false
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
  
  // スポンサーシッププランの価格情報
  const sponsorshipPrices = {
    platinum: '1,000,000円',
    gold: '700,000円',
    silver: '500,000円',
    bronze: '300,000円'
  };
  
  // 追加オプションの価格情報
  const additionalOptionPrices = {
    logo_program: '50,000円',
    ad_program: '100,000円',
    bag_insert: '80,000円',
    lanyard: '200,000円',
    reception: '250,000円'
  };
  
  if (submitted) {
    return (
      <FormContainer>
        <SuccessMessage>
          <h3>スポンサー申し込みが送信されました</h3>
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
      <FormTitle>スポンサー申し込みフォーム</FormTitle>
      <FormDescription>
        スポンサーシッププランの選択、支払い情報などを登録してください。
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
            <FormLabel>企業ID<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              placeholder="例：C-123"
            />
            {errors.companyId && <ErrorMessage>{errors.companyId}</ErrorMessage>}
            <HelpText>企業情報フォーム送信後に発行されたIDを入力してください。</HelpText>
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>スポンサーシッププラン</SectionTitle>
          
          <FormGroup>
            <FormLabel>スポンサーシップレベル<RequiredMark>※</RequiredMark></FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="sponsor-platinum"
                  name="sponsorshipLevel"
                  value="platinum"
                  checked={formData.sponsorshipLevel === 'platinum'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="sponsor-platinum">
                  プラチナスポンサー（{sponsorshipPrices.platinum}）
                </label>
              </RadioOption>
              <HelpText>特典：メインステージでの講演枠（45分）、ブース（大）、ロゴ掲載（大）、参加者リスト、懇親会招待10名</HelpText>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="sponsor-gold"
                  name="sponsorshipLevel"
                  value="gold"
                  checked={formData.sponsorshipLevel === 'gold'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="sponsor-gold">
                  ゴールドスポンサー（{sponsorshipPrices.gold}）
                </label>
              </RadioOption>
              <HelpText>特典：セッション枠（30分）、ブース（中）、ロゴ掲載（中）、参加者リスト、懇親会招待5名</HelpText>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="sponsor-silver"
                  name="sponsorshipLevel"
                  value="silver"
                  checked={formData.sponsorshipLevel === 'silver'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="sponsor-silver">
                  シルバースポンサー（{sponsorshipPrices.silver}）
                </label>
              </RadioOption>
              <HelpText>特典：ブース（小）、ロゴ掲載（小）、懇親会招待3名</HelpText>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="sponsor-bronze"
                  name="sponsorshipLevel"
                  value="bronze"
                  checked={formData.sponsorshipLevel === 'bronze'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="sponsor-bronze">
                  ブロンズスポンサー（{sponsorshipPrices.bronze}）
                </label>
              </RadioOption>
              <HelpText>特典：ロゴ掲載（小）、懇親会招待2名</HelpText>
            </RadioContainer>
            {errors.sponsorshipLevel && <ErrorMessage>{errors.sponsorshipLevel}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>追加オプション（複数選択可）</FormLabel>
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="option-logo"
                name="option-logo"
                value="logo_program"
                data-field="additionalOptions"
                checked={formData.additionalOptions.includes('logo_program')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="option-logo">
                プログラム冊子へのロゴ掲載（{additionalOptionPrices.logo_program}）
              </label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="option-ad"
                name="option-ad"
                value="ad_program"
                data-field="additionalOptions"
                checked={formData.additionalOptions.includes('ad_program')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="option-ad">
                プログラム冊子への広告掲載（{additionalOptionPrices.ad_program}）
              </label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="option-insert"
                name="option-insert"
                value="bag_insert"
                data-field="additionalOptions"
                checked={formData.additionalOptions.includes('bag_insert')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="option-insert">
                参加者バッグへの資料封入（{additionalOptionPrices.bag_insert}）
              </label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="option-lanyard"
                name="option-lanyard"
                value="lanyard"
                data-field="additionalOptions"
                checked={formData.additionalOptions.includes('lanyard')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="option-lanyard">
                ネックストラップスポンサー（{additionalOptionPrices.lanyard}）
              </label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="option-reception"
                name="option-reception"
                value="reception"
                data-field="additionalOptions"
                checked={formData.additionalOptions.includes('reception')}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="option-reception">
                懇親会スポンサー（{additionalOptionPrices.reception}）
              </label>
            </CheckboxContainer>
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>支払い情報</SectionTitle>
          
          <FormGroup>
            <FormLabel>支払い方法<RequiredMark>※</RequiredMark></FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="payment-bank"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={formData.paymentMethod === 'bank_transfer'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="payment-bank">銀行振込</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="payment-credit"
                  name="paymentMethod"
                  value="credit_card"
                  checked={formData.paymentMethod === 'credit_card'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="payment-credit">クレジットカード</label>
              </RadioOption>
            </RadioContainer>
            {errors.paymentMethod && <ErrorMessage>{errors.paymentMethod}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>請求先住所<RequiredMark>※</RequiredMark></FormLabel>
            <FormTextarea
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              placeholder="例：東京都千代田区○○町1-2-3 ○○ビル5階"
            />
            {errors.billingAddress && <ErrorMessage>{errors.billingAddress}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>郵便番号<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="billingPostalCode"
              value={formData.billingPostalCode}
              onChange={handleChange}
              placeholder="例：123-4567"
            />
            {errors.billingPostalCode && <ErrorMessage>{errors.billingPostalCode}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>請求先担当者名<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="billingContactName"
              value={formData.billingContactName}
              onChange={handleChange}
              placeholder="例：山田 太郎"
            />
            {errors.billingContactName && <ErrorMessage>{errors.billingContactName}</ErrorMessage>}
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>メールアドレス<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="email"
                name="billingContactEmail"
                value={formData.billingContactEmail}
                onChange={handleChange}
                placeholder="例：sample@example.com"
              />
              {errors.billingContactEmail && <ErrorMessage>{errors.billingContactEmail}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>電話番号<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="tel"
                name="billingContactPhone"
                value={formData.billingContactPhone}
                onChange={handleChange}
                placeholder="例：03-1234-5678"
              />
              {errors.billingContactPhone && <ErrorMessage>{errors.billingContactPhone}</ErrorMessage>}
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel>請求書に関する要件</FormLabel>
            <FormTextarea
              name="invoiceRequirements"
              value={formData.invoiceRequirements}
              onChange={handleChange}
              placeholder="請求書に関する特別な要件があれば記入してください。"
            />
            <HelpText>発行時期、宛名、部署名、発注書番号など</HelpText>
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>広告・宣伝</SectionTitle>
          
          <FormGroup>
            <FormLabel>ロゴの掲載</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="logo-yes"
                  name="logoDisplay"
                  value="yes"
                  checked={formData.logoDisplay === 'yes'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="logo-yes">ロゴを掲載する</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="logo-no"
                  name="logoDisplay"
                  value="no"
                  checked={formData.logoDisplay === 'no'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="logo-no">ロゴを掲載しない</label>
              </RadioOption>
            </RadioContainer>
            <HelpText>ロゴは企業情報フォームでアップロードしたものを使用します。</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>広告に関する要件</FormLabel>
            <FormTextarea
              name="advertisingRequirements"
              value={formData.advertisingRequirements}
              onChange={handleChange}
              placeholder="広告掲載に関する特別な要件があれば記入してください。"
            />
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>プレゼンテーション</SectionTitle>
          
          <FormGroup>
            <FormLabel>プレゼンテーション枠の利用</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="presentation-yes"
                  name="presentationSlot"
                  value="yes"
                  checked={formData.presentationSlot === 'yes'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="presentation-yes">プレゼンテーション枠を利用する</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="presentation-no"
                  name="presentationSlot"
                  value="no"
                  checked={formData.presentationSlot === 'no'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="presentation-no">プレゼンテーション枠を利用しない</label>
              </RadioOption>
            </RadioContainer>
            <HelpText>プラチナ・ゴールドスポンサーのみ利用可能です。</HelpText>
          </FormGroup>
          
          {formData.presentationSlot === 'yes' && (
            <>
              <FormGroup>
                <FormLabel>プレゼンテーショントピック<RequiredMark>※</RequiredMark></FormLabel>
                <FormInput
                  type="text"
                  name="presentationTopic"
                  value={formData.presentationTopic}
                  onChange={handleChange}
                  placeholder="例：データ活用による業務効率化の実践例"
                />
                {errors.presentationTopic && <ErrorMessage>{errors.presentationTopic}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <FormLabel>講演者</FormLabel>
                <FormInput
                  type="text"
                  name="presentationSpeaker"
                  value={formData.presentationSpeaker}
                  onChange={handleChange}
                  placeholder="例：山田 太郎（最高技術責任者）"
                />
                <HelpText>詳細はセッション情報フォームで登録していただきます。</HelpText>
              </FormGroup>
            </>
          )}
        </FormSection>
        
        <FormSection>
          <SectionTitle>その他</SectionTitle>
          
          <FormGroup>
            <FormLabel>特別なリクエスト</FormLabel>
            <FormTextarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="その他、スポンサーシップに関する特別なリクエストがあれば記入してください。"
            />
          </FormGroup>
          
          <FormGroup>
            <CheckboxContainer>
              <FormCheckbox
                type="checkbox"
                id="terms"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="terms">
                <RequiredMark>※</RequiredMark> スポンサーシップの<a href="#" target="_blank">利用規約</a>を読み、同意します
              </label>
            </CheckboxContainer>
            {errors.termsAccepted && <ErrorMessage>{errors.termsAccepted}</ErrorMessage>}
          </FormGroup>
        </FormSection>
        
        <SubmitButton type="submit">送信する</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default SponsorForm;
