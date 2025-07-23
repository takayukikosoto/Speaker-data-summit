import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ページ遷移時に自動的にページトップにスクロールするコンポーネント
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // ページ遷移時にウィンドウを一番上にスクロール
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
