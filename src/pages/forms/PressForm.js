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

const PressForm = () => {
  const [formData, setFormData] = useState({
    mediaName: '',
    mediaType: '',
    mediaOther: '',
    websiteUrl: '',
    circulation: '',
    firstName: '',
    lastName: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Japan',
    coverageType: [],
    coveragePlan: '',
    interviewRequest: 'no',
    interviewTarget: '',
    photographyRequired: 'no',
    videoRequired: 'no',
    equipmentDetails: '',
    attendanceDate: [],
    pressReleaseRequired: 'yes',
    additionalRequests: '',
    previousCoverage: '',
    termsAgreed: false
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
    const { name, value, checked } = e.target;
    
    if (name === 'termsAgreed') {
      setFormData({
        ...formData,
        [name]: checked
      });
      
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null
        });
      }
      return;
    }
    
    // 複数選択の場合（配列）
    let updatedSelection = [...formData[name]];
    
    if (checked) {
      updatedSelection.push(value);
    } else {
      updatedSelection = updatedSelection.filter(item => item !== value);
    }
    
    setFormData({
      ...formData,
      [name]: updatedSelection
    });
    
    // エラーをクリア
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // 必須フィールドの検証
    if (!formData.mediaName.trim()) {
      newErrors.mediaName = 'メディア名は必須です';
    }
    
    if (!formData.mediaType) {
      newErrors.mediaType = 'メディアタイプは必須です';
    }
    
    if (formData.mediaType === 'other' && !formData.mediaOther.trim()) {
      newErrors.mediaOther = 'その他のメディアタイプを入力してください';
    }
    
    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = 'ウェブサイトURLは必須です';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = '名は必須です';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = '姓は必須です';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = '役職は必須です';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '電話番号は必須です';
    }
    
    if (formData.coverageType.length === 0) {
      newErrors.coverageType = '少なくとも1つの取材形式を選択してください';
    }
    
    if (!formData.coveragePlan.trim()) {
      newErrors.coveragePlan = '取材予定内容は必須です';
    }
    
    if (formData.interviewRequest === 'yes' && !formData.interviewTarget.trim()) {
      newErrors.interviewTarget = 'インタビュー希望対象者を入力してください';
    }
    
    if (formData.attendanceDate.length === 0) {
      newErrors.attendanceDate = '少なくとも1つの参加日を選択してください';
    }
    
    if (!formData.termsAgreed) {
      newErrors.termsAgreed = '利用規約に同意してください';
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
        mediaName: '',
        mediaType: '',
        mediaOther: '',
        websiteUrl: '',
        circulation: '',
        firstName: '',
        lastName: '',
        position: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Japan',
        coverageType: [],
        coveragePlan: '',
        interviewRequest: 'no',
        interviewTarget: '',
        photographyRequired: 'no',
        videoRequired: 'no',
        equipmentDetails: '',
        attendanceDate: [],
        pressReleaseRequired: 'yes',
        additionalRequests: '',
        previousCoverage: '',
        termsAgreed: false
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
          <h3>プレス登録が完了しました</h3>
          <p>ご登録ありがとうございます。内容を確認し、プレス証の発行など詳細について後ほどメールでご連絡いたします。</p>
        </SuccessMessage>
        <Link to="/forms" style={{ display: 'block', textAlign: 'center', marginTop: '2rem' }}>
          フォーム一覧に戻る
        </Link>
      </FormContainer>
    );
  }
  
  return (
    <FormContainer>
      <FormTitle>プレス登録フォーム</FormTitle>
      <FormDescription>
        メディア関係者の方は、このフォームから取材申請を行ってください。
        <br />
        <strong>※</strong> マークの項目は必須です。
      </FormDescription>
      
      <form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>メディア情報</SectionTitle>
          
          <FormGroup>
            <FormLabel>メディア名<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="mediaName"
              value={formData.mediaName}
              onChange={handleChange}
              placeholder="例：テックニュース"
            />
            {errors.mediaName && <ErrorMessage>{errors.mediaName}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>メディアタイプ<RequiredMark>※</RequiredMark></FormLabel>
            <FormSelect
              name="mediaType"
              value={formData.mediaType}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              <option value="newspaper">新聞</option>
              <option value="magazine">雑誌</option>
              <option value="tv">テレビ</option>
              <option value="radio">ラジオ</option>
              <option value="online">オンラインメディア</option>
              <option value="blog">ブログ</option>
              <option value="youtube">YouTubeチャンネル</option>
              <option value="other">その他</option>
            </FormSelect>
            {errors.mediaType && <ErrorMessage>{errors.mediaType}</ErrorMessage>}
          </FormGroup>
          
          {formData.mediaType === 'other' && (
            <FormGroup>
              <FormLabel>その他のメディアタイプ<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="text"
                name="mediaOther"
                value={formData.mediaOther}
                onChange={handleChange}
                placeholder="メディアタイプを入力してください"
              />
              {errors.mediaOther && <ErrorMessage>{errors.mediaOther}</ErrorMessage>}
            </FormGroup>
          )}
          
          <FormGroup>
            <FormLabel>ウェブサイトURL<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="例：https://www.example.com"
            />
            {errors.websiteUrl && <ErrorMessage>{errors.websiteUrl}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>発行部数/視聴者数/月間PV数</FormLabel>
            <FormInput
              type="text"
              name="circulation"
              value={formData.circulation}
              onChange={handleChange}
              placeholder="例：月間10万部、月間PV100万など"
            />
            <HelpText>おおよその数字で構いません</HelpText>
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>担当者情報</SectionTitle>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>名<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="例：太郎"
              />
              {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>姓<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="例：山田"
              />
              {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel>役職<RequiredMark>※</RequiredMark></FormLabel>
            <FormInput
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="例：記者、編集者、カメラマン"
            />
            {errors.position && <ErrorMessage>{errors.position}</ErrorMessage>}
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>メールアドレス<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="例：sample@example.com"
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>電話番号<RequiredMark>※</RequiredMark></FormLabel>
              <FormInput
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="例：090-1234-5678"
              />
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel>住所</FormLabel>
            <FormInput
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="例：東京都千代田区丸の内1-1-1"
            />
          </FormGroup>
          
          <TwoColumnLayout>
            <FormGroup>
              <FormLabel>市区町村</FormLabel>
              <FormInput
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="例：千代田区"
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>郵便番号</FormLabel>
              <FormInput
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="例：100-0001"
              />
            </FormGroup>
          </TwoColumnLayout>
          
          <FormGroup>
            <FormLabel>国</FormLabel>
            <FormSelect
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="Japan">日本</option>
              <option value="China">中国</option>
              <option value="Korea">韓国</option>
              <option value="USA">アメリカ</option>
              <option value="Other">その他</option>
            </FormSelect>
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>取材情報</SectionTitle>
          
          <FormGroup>
            <FormLabel>取材形式<RequiredMark>※</RequiredMark></FormLabel>
            <CheckboxContainer>
              <div>
                <FormCheckbox
                  type="checkbox"
                  id="coverage-article"
                  name="coverageType"
                  value="article"
                  checked={formData.coverageType.includes('article')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="coverage-article">記事</label>
              </div>
              
              <div>
                <FormCheckbox
                  type="checkbox"
                  id="coverage-interview"
                  name="coverageType"
                  value="interview"
                  checked={formData.coverageType.includes('interview')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="coverage-interview">インタビュー</label>
              </div>
              
              <div>
                <FormCheckbox
                  type="checkbox"
                  id="coverage-photo"
                  name="coverageType"
                  value="photo"
                  checked={formData.coverageType.includes('photo')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="coverage-photo">写真撮影</label>
              </div>
              
              <div>
                <FormCheckbox
                  type="checkbox"
                  id="coverage-video"
                  name="coverageType"
                  value="video"
                  checked={formData.coverageType.includes('video')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="coverage-video">動画撮影</label>
              </div>
              
              <div>
                <FormCheckbox
                  type="checkbox"
                  id="coverage-live"
                  name="coverageType"
                  value="live"
                  checked={formData.coverageType.includes('live')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="coverage-live">ライブ配信</label>
              </div>
              
              <div>
                <FormCheckbox
                  type="checkbox"
                  id="coverage-news"
                  name="coverageType"
                  value="news"
                  checked={formData.coverageType.includes('news')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="coverage-news">ニュース</label>
              </div>
            </CheckboxContainer>
            {errors.coverageType && <ErrorMessage>{errors.coverageType}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>取材予定内容<RequiredMark>※</RequiredMark></FormLabel>
            <FormTextarea
              name="coveragePlan"
              value={formData.coveragePlan}
              onChange={handleChange}
              placeholder="取材の目的や内容、掲載/放送予定などを具体的に記入してください。"
            />
            {errors.coveragePlan && <ErrorMessage>{errors.coveragePlan}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>インタビュー希望</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="interview-yes"
                  name="interviewRequest"
                  value="yes"
                  checked={formData.interviewRequest === 'yes'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="interview-yes">希望する</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="interview-no"
                  name="interviewRequest"
                  value="no"
                  checked={formData.interviewRequest === 'no'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="interview-no">希望しない</label>
              </RadioOption>
            </RadioContainer>
          </FormGroup>
          
          {formData.interviewRequest === 'yes' && (
            <FormGroup>
              <FormLabel>インタビュー希望対象者<RequiredMark>※</RequiredMark></FormLabel>
              <FormTextarea
                name="interviewTarget"
                value={formData.interviewTarget}
                onChange={handleChange}
                placeholder="インタビューを希望する人物や企業名を記入してください。"
              />
              {errors.interviewTarget && <ErrorMessage>{errors.interviewTarget}</ErrorMessage>}
              <HelpText>希望に添えない場合もありますのでご了承ください。</HelpText>
            </FormGroup>
          )}
          
          <FormGroup>
            <FormLabel>写真撮影</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="photo-yes"
                  name="photographyRequired"
                  value="yes"
                  checked={formData.photographyRequired === 'yes'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="photo-yes">予定あり</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="photo-no"
                  name="photographyRequired"
                  value="no"
                  checked={formData.photographyRequired === 'no'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="photo-no">予定なし</label>
              </RadioOption>
            </RadioContainer>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>動画撮影</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="video-yes"
                  name="videoRequired"
                  value="yes"
                  checked={formData.videoRequired === 'yes'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="video-yes">予定あり</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="video-no"
                  name="videoRequired"
                  value="no"
                  checked={formData.videoRequired === 'no'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="video-no">予定なし</label>
              </RadioOption>
            </RadioContainer>
          </FormGroup>
          
          {(formData.photographyRequired === 'yes' || formData.videoRequired === 'yes') && (
            <FormGroup>
              <FormLabel>使用機材詳細</FormLabel>
              <FormTextarea
                name="equipmentDetails"
                value={formData.equipmentDetails}
                onChange={handleChange}
                placeholder="使用予定の撮影機材について記入してください。"
              />
              <HelpText>大型機材や特殊な機材がある場合は必ず記入してください。</HelpText>
            </FormGroup>
          )}
          
          <FormGroup>
            <FormLabel>参加予定日<RequiredMark>※</RequiredMark></FormLabel>
            <CheckboxContainer>
              <div>
                <FormCheckbox
                  type="checkbox"
                  id="date-day1"
                  name="attendanceDate"
                  value="2025-06-11"
                  checked={formData.attendanceDate.includes('2025-06-11')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="date-day1">2025年6月11日（水）</label>
              </div>
              
              <div>
                <FormCheckbox
                  type="checkbox"
                  id="date-day2"
                  name="attendanceDate"
                  value="2025-06-12"
                  checked={formData.attendanceDate.includes('2025-06-12')}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="date-day2">2025年6月12日（木）</label>
              </div>
            </CheckboxContainer>
            {errors.attendanceDate && <ErrorMessage>{errors.attendanceDate}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>プレスリリース送付希望</FormLabel>
            <RadioContainer>
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="press-release-yes"
                  name="pressReleaseRequired"
                  value="yes"
                  checked={formData.pressReleaseRequired === 'yes'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="press-release-yes">希望する</label>
              </RadioOption>
              
              <RadioOption>
                <FormRadio
                  type="radio"
                  id="press-release-no"
                  name="pressReleaseRequired"
                  value="no"
                  checked={formData.pressReleaseRequired === 'no'}
                  onChange={handleRadioChange}
                />
                <label htmlFor="press-release-no">希望しない</label>
              </RadioOption>
            </RadioContainer>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>追加リクエスト</FormLabel>
            <FormTextarea
              name="additionalRequests"
              value={formData.additionalRequests}
              onChange={handleChange}
              placeholder="その他のリクエストがあれば記入してください。"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>過去の取材実績</FormLabel>
            <FormTextarea
              name="previousCoverage"
              value={formData.previousCoverage}
              onChange={handleChange}
              placeholder="関連するイベントや技術分野での過去の取材実績があれば記入してください。"
            />
            <HelpText>URLがあれば記載いただくとスムーズです。</HelpText>
          </FormGroup>
        </FormSection>
        
        <FormGroup>
          <CheckboxContainer>
            <div>
              <FormCheckbox
                type="checkbox"
                id="terms-agreed"
                name="termsAgreed"
                checked={formData.termsAgreed}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="terms-agreed">
                <span>プレス取材規約に同意します<RequiredMark>※</RequiredMark></span>
              </label>
            </div>
          </CheckboxContainer>
          {errors.termsAgreed && <ErrorMessage>{errors.termsAgreed}</ErrorMessage>}
          <HelpText>
            プレス取材規約の詳細は<Link to="/press-terms" target="_blank">こちら</Link>をご確認ください。
          </HelpText>
        </FormGroup>
        
        <SubmitButton type="submit">送信する</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default PressForm;
