require('./src/styles/global.css');
// custom typefaces
require('typeface-noto-sans-kr');

// polyfill
require('intersection-observer');

const metaConfig = require('./gatsby-meta-config');

exports.onInitialClientRender = () => {
  // 다크모드 고정
  document.body.classList.add('dark');
  document.body.classList.remove('light');

  // 기존 테마 설정 제거
  try {
    localStorage.removeItem('__felog_local_storage_key__/theme');
  } catch (e) {
    // localStorage 접근 실패 시 무시
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
