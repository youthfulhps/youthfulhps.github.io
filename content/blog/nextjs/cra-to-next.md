---
title: CRA 프로젝트를 next.js로 전환해보자
date: 2021-12-26 21:05:09
category: nextjs
thumbnail: ./images/cra-to-next/thumbnail.png
draft: false
---

웹 개발을 하면서 정량적인 지표를 보는 것에 재미가 들린 요즘, 지표는
엄청난 동기를 부여하곤 합니다.
최근 [Lighthouse](https://developers.google.com/web/tools/lighthouse)로
프러덕션의 사용자 경험에 대한 점수가 여럿 빨간불을 켜고 있는 것을 보고는
이제 더 이상 최적화를 미룰 수 없겠다는 생각이 들게 되었는데요.

현재 프러덕션은 클라이언트 사이드에서 랜더링을 담당하고 있기 때문에
검색 엔진 최적화 측면에서 취약하다는 단점이 존재했고, 사용자 경험 지표를
챙겨 검색 엔진에게 예쁨 받을 수 있는 프러덕션이 되기 위해
랜더링 동작을 서버 사이드에서 담당할 수 있도록 전환하고자 했습니다.

![thumbnail](./images/cra-to-next/thumbnail.png)

이번 글에서는 next.js를 통해 서버 사이드 랜더링 방식으로 전환하는 과정에
대해서 정리해볼까 하는데요. 아무래도 기저에 있는 프러덕션 프레임워크를
변경하는 작업이다 보니, 우선 문제없이 빌드가 되는 단계까지 정리해보고자
합니다.

참고로 next.js는 클라이언트, 서버 사이드 랜더링을 혼용하여 사용할 수
있기 때문에 랜더링 이전에 데이터를 패칭하거나, 특정 액션을 수행하기 위해
getServerSideProps 등의 함수를 사용하지 않는 이상 여전히
클라이언트 사이드 랜더링으로 동작하게 됩니다.

## 의존성 업데이트

next.js를 설치해주어야 합니다. `react-scripts` 와
`react-router-dom` 은 이제 제거해도 좋습니다.

```json
//package.json

"next": "12.0.4", //resolve
"react-scripts": "4.0.3", //remove
"react-router-dom": "^5.2.0", //remove

"scripts": {
  "start:dev": "craco start", //remove
  "start:dev": "next dev", //add
}
```

## 환경 변수 업데이트

환경 변수의 접두어를 변경해주어야 합니다. CRA 프로젝트는 REACT\_APP 이라는 접두어를
사용하는 반면, [next.js](https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser)는 NEXT\_PUBLIC 이라는 접두어를 사용합니다.

```shell
//.env

REACT_APP_BASE_PATH=https://... //remove
NEXT_PUBLIC_BASE_PATH=https://... //add

```

## 에셋을 위한 넥스트 환경 설정

기존 프로젝트에서 사용 중인 에셋 파일들을 유지하고 사용하기 위해
로더가 필요합니다.

```json
//package.json

"@svgr/webpack": "^6.0.0",   //resolve
```

```js
//next.config.js

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}
```

```tsx
import Icon from '@assets/icons/Icon.svg'
```

## \_app 생성

next.js를 사용할 때는 지정된 프로젝트 구조를 따라주어야 합니다.
CRA 프로젝트에서 애플리케이션 최상단의 App을 `_app.tsx` 으로
변경해주어야 합니다.

next.js의 \_app 파일의 기본 구조는 다음 코드와 같고,
이하 기존 프로젝트에서 사용 중이던 모듈들을
동일하게 추가해주면 됩니다. 추가적인 정보는 [\_app.tsx](https://nextjs.org/docs/advanced-features/custom-app)
문서를 참고해 주세요.

```tsx
//src/pages/_app.tsx

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

## \_document 생성

`_document.tsx` 파일을 생성해주어야 합니다.
도큐먼트 파일은 도큐먼트의 최상단 태그들을 보강하는 데 사용되며,
meta, script 와 같은 태그들이 추가됩니다.

\_document 파일의 기본 구조는 다음 코드와 같고, 기존 프로젝트의
`index.html` 파일에 구성되어 있는 요소들을 하나 씩 옮겨주시면 됩니다.

```tsx
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

주위하실 점은 head 태그에 추가되는 title, link, viewport 와 같은 태그들은
\_app 에 선언되어야 한다고 합니다. 만약, \_document 에 추가하면
[경고](https://nextjs.org/docs/messages/no-document-viewport-meta)를 받게 됩니다.

```tsx
import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Porject title</title>
        <link rel="shortcut icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        ...
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

## 페이지 디렉토리를 통한 라우팅 적용

next.js에서 각각의 페이지는 pages 폴더의 파일 혹은 폴더명을 기반으로
라우팅됩니다. path params을 전달받는 페이지 또한 다음과 같이 구성할 수 있고,
기존 프로젝트에서 사용된 라우터들은 이제 제거해도 좋습니다.

```shell
src/_app.tsx => https://.../
src/pages/me/index.tsx => https://.../me
src/pages/project/[projectId].tsx => https://.../project/{projectId}
```

## 라우팅 모듈 대체

컴포넌트 레벨에서 라우팅을 담당하는 컴포넌트나 페이지 전환이 이루어지는 로직이 있다면
`react-router-dom`의 Link 컴포넌트나, `useHistory`를 통해
구현되어 있을텐데요.

next.js에서 클라이언트 라우팅 동작을 도와주는
`next/router`, `next/link` 로 대체할 수 있습니다.
추가적인 정보는 [next/link](https://nextjs.org/docs/api-reference/next/link),
[next/router](https://nextjs.org/docs/api-reference/next/router)를 참고하면 좋습니다.

```tsx
import React from 'react';
// import { Link } from "react-router-dom";
import Link from 'next/link';
import { withRouter, NextRouter } from 'next/router';

type HeaderProps = {
  children: React.ReactNode;
  router: NextRouter;
} & with;

function Header({ children, router }: HeaderProps) {
  return (
    <header className={className}>
      ...
      <Link {...} href={to}>
        <a>{children}</a>
      </Link>
    </header>
  );
}

export default withRouter(NavLink);  //hoc
```

```tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import { Link, useHistory } from 'react-router-dom';

type HeaderProps = {
  children: React.ReactNode;
};

function Header({  children }: HeaderProps) {
  // const history = useHistory();
  const router = useRouter();

  const handleLogoClick = () => {
    // history.push('/');
    router.push('/');
  }

  return (
    <header className={className}>
      ...
      <Logo onClick={handleLogoClick}/>
      <Link {...} href={to}>
        <a>{children}</a>
      </Link>
    </header>
  );
}
```

또한, path params은 router를 통해 참조할 수 있습니다.

```tsx
import React from 'react';
import { useRouter } from 'next/router';

function ProjectPage() {
  ...

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const {projectId} = router.query;
    ...
  },[router.isReady])
}
```

## 마운트 이후 시점이 보장되지 않는 window 객체 참조 처리

서버에서 랜더링할 때는 window 객체를 참조할 수 없기 때문에
마운트 이후 시점이 보장되지 않는 곳에서 window 객체에 접근한
코드는, 마운트 이후 시점이 보장되는 로직 전개로 처리해주어야 합니다.

```tsx
import React, { useEffect, useRef } from 'react';

function MainPage() {
  const isMobile = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      isMobile.current = window.innerWidth <= 450;
    }
  },[]);

  return ...
}
```

## 서버사이드에서 JS 내부 CSS 스타일 적용

`styled-components` 를 통해 컴포넌트를 스타일링한다면,
바벨 플러그인을 통해 서버 사이드에서 정의된 스타일이 적용된 후
랜더링될 수 있도록 설정해주어야 합니다.
추가적인 내용은 [styled-components](https://styled-components.com/docs/advanced#nextjs) 를 참고하시면 좋습니다.

```json
//package.json

"babel-plugin-styled-components": "^2.0.1",  //resolve
```

```shell
//.babelrc
{
   "presets": ["next/babel"],
   "plugins": [
     [
       "styled-components",
       {
         "ssr": true,
         "displayName": true,
         "preprocess": false
       }
     ]
   ]
 }
```

```tsx
//_document.tsx

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

## 마치면서

next.js를 적용하면서 당연하게도 많은 빌드 문제를 겪었는데요.
'빌드만 성공해보자' 라는 생각으로 작업을 진행했던 기억이 나는데요.
최근 다수의 프로젝트들이 next.js를 적용하려는 작업들이 진행 중인 만큼
next.js는 [codemods](https://nextjs.org/docs/advanced-features/codemods)
를 지원하여 CRA 애플리케이션을 자동으로 변환하는 도구를 제공하고 있으니
살펴 보시면 좋을 것 같습니다.

추가적으로 서버 사이드 리덕스 스토어 관리나, 페이지 초기 데이터 패칭을
위한 정의 등 많은 이슈들을 만나게 될텐데, 궁금하신 점, 잘못된 부분이
있다면 언제든 지적해주시면 감사하겠습니다.
