require('./src/styles/global.css');
// custom typefaces
require('typeface-noto-sans-kr');

// polyfill
require('intersection-observer');

const metaConfig = require('./gatsby-meta-config');

exports.onInitialClientRender = () => {
  // 테마 초기화 - 페이지 로드 시 저장된 테마 적용
  try {
    const themeValue = localStorage.getItem('__felog_local_storage_key__/theme');
    if (themeValue !== null) {
      const isDark = JSON.parse(themeValue);
      if (isDark) {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
    }
  } catch (e) {
    // localStorage 접근 실패 시 기본값 사용
  }

  if (metaConfig.share.facebookAppId) {
    window.fbAsyncInit = function() {
      FB.init({
        appId: metaConfig.share.facebookAppId,
        xfbml: true,
        version: 'v3.2',
      });
      FB.AppEvents.logPageView();
    };
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }
};
