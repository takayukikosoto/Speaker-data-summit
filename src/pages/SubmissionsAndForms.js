import React from 'react';
import Submissions from './Submissions';
import Forms from './Forms';

// ラッパーページ: 先に提出物一覧、続いて各種フォームを表示
const SubmissionsAndForms = () => (
  <>
    <Submissions />
    <Forms />
  </>
);

export default SubmissionsAndForms;
