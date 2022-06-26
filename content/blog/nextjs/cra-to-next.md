---
title: CRA 프로젝트를 next.js로 전환해보자
date: 2021-12-26 21:05:09
category: nextjs
thumbnail: ./images/cra-to-next/thumbnail.png
draft: false
---

웹 개발을 하면서 개인적으로 정량적인 지표를 보는 게 엄청난 동기를 부여합니다.
최근 [Lighthouse](https://developers.google.com/web/tools/lighthouse)로
프러덕션의 사용자 경험에 대한 점수가 여럿 빨간불을 켜고 있는 것을 보고는
이제 더 이상 최적화를 미룰 수 없겠다는 생각이 들게 되었는데요.

현재 프러덕션은 CSR 방식으로 구성된 프로젝트였기 때문에 SEO에 취약하다는 단점이 존재했고,
웹 사용자 경험 지표인 Web Vital Score가 검색 엔진 최적화 영역에 들어온 시점에서
아무래도 SSR로 전환을 해야겠다는 생각이 들게 되었습니다.

![thumbnail](./images/cra-to-next/thumbnail.png)

CSR 방식으로 구성된 프로젝트에서 SSR를 지원해주는 넥스트로의 전환기 '빌드만 되게 해주세요' 편을 정리해볼 까 합니다.

이 글에서는 넥스트를 통해 기존 CRA 프로젝트 빌드를 진행하는 단계까지만
수행합니다. 즉, 초기 데이터 요청 등 고도화 작업은 추후 글에서 정리할
에정입니다.

## 의존성 업데이트

이제, 넥스트로 빌드를 하기 위해 넥스트를 설치해주어야 합니다. `react-scripts` 와
`react-router-dom` 은 이제 제거해도 좋습니다.

```json //package.json

"next": "12.0.4", //resolve
"react-scripts": "4.0.3", //remove
"react-router-dom": "^5.2.0", //remove

"scripts": {
"start:dev": "craco start", //remove
"start:dev": "next dev", //resolve
}

```

## 환경 변수 업데이트

다음으로, 환경 변수의 접두어(?)를 변경해주어야 합니다. CRA 프로젝트는 환경 변수 앞에 `REACT_APP` 을 붙인다면,
넥스트는 `NEXT_PUBLIC` 이라는 접두어를 사용합니다.

```

//.env

REACT_APP_BASE_PATH=https://dev.api-v2.moye.kr //remove
NEXT_PUBLIC_BASE_PATH=https://dev.api-v2.moye.kr //add

```

## 에셋을 위한 넥스트 환경 설정

여러 파일에서 에셋들이 임포트되어 사용되고 있기 때문에 기존 프로젝트 설정과 같이
svg 파일의 아이콘을 사용하기 위한 설정을 해주어야 합니다.

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

## App to \_app 마이그레이션

넥스트 프레임워크를 사용하기 위해서는 넥스트에서 지정한 프로젝트 구조를 따라주어야 합니다.
때문에 아래와 같은 프로젝트 구조 변경이 필요합니다.

우선, **프로젝트 컴포넌트 레벨의 최상단이 되는 `App.tsx` 파일을 `_app.tsx` 로
변경해주어야 합니다.** CNA(`create next app`)를 사용해서 넥스트 초기 프로젝트를 구성해보면,
아래와 같이 `_app.tsx` 파일이 구성되는데요. 이제, 기존 프로젝트 `App.tsx`에 덧붙여진 모듈이나, 구성 요소들을
동일하게 추가해주시면 됩니다.

추가적인 정보는 [\_app.tsx에 대한 넥스트 공식 문서](https://nextjs.org/docs/advanced-features/custom-app)
를 참고하면 좋습니다.

```tsx
//src/pages/_app.tsx

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

## \_document 생성

다음으로, **`_document.tsx` 파일을 구성**해주어야 합니다.
도큐먼트 파일에는 기본적으로 `html` 및 `body` 태그를 보강하는 데 사용되며
`meta`, `link`, `script`와 같은 `html` 구성 요소들이 추가됩니다.

CNA(`create next app`)를 사용해서 넥스트 초기 프로젝트를 구성해보면, 아래와 같이 `_document.tsx` 파일이 구성되는데요.
위와 같이 기존 프로젝트 퍼블릭 폴더의 `index.html`에 구성되어 있는 요소들을 추가해주면 됩니다.

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

주위하실 점은, `head` 태그에 들어가는 `title`, `link`, `viewport` 관련 메타 태그들은
`_app.tsx` 에 선언되어야 한다고 합니다. 만약, `_document.tsx` 에 추가하셨다면,
빌드 시 이러한 [경고 로그](https://nextjs.org/docs/messages/no-document-viewport-meta)를 보게 됩니다.

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

## 페이지 디렉토리를 통한 경로 설정

넥스트 프레임워크에서 각각의 페이지는 페이지 파일 이름을 기반으로 연결됩니다.
또한, `path params` 을 전달받는 페이지의 경우는 아래와 같이 페이지 디렉토리, 파일 이름으로 구성해줄 수 있습니다.

이 단계에서, `react-router-dom` 에서 제공하는 `<Route />` 컴포넌트를 통해 특정 페이지 경로와 컴포넌트를 대응시켜준
`<RootRouter />` 파일은 이제 제거해도 좋습니다.

```
src/pages/me/index.tsx => example.com/me
src/pages/project/[projectId].tsx => example.com/project/{projectId}
```

## 라우팅 관련 모듈 대체

컴포넌트 레벨에서 라우팅을 담당하는 컴포넌트나,라우팅으로 이어지는 로직들이 있다면,
`react-router-dom` 에서 제공하는 `<Link />` 컴포넌트나, `useHistory` 훅을 통해
구현되어 있을텐데요. 이를 넥스트에서 CSR 라우팅 동작을 가능하게 도와주는 `next/router`, `next/link` 로 대체해주어야 합니다.

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

function Header({  children, router }: HeaderProps) {
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

또한, `react-router-dom` 을 통해 `match.params` 으로 접근했던 경로 파라미터들은 이제 `router` 를 통해 참조할 수 있습니다.

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

서버에서 랜더링할 때는 `window` 객체를 참조할 수 없기 때문에 마운트 이후 시점이 보장되지 않는 곳에서
`window` 객체에 접근한 코드는 마운트 이후 시점이 보장되는 로직 전개로 처리해주어야 합니다.

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

가령, `styled-components` 를 통해 css-in-js 문법을 사용하고 있다면,
초기 랜더링 이후 자바스크립트 코드 내 css 스타일이 적용되는 이슈를 육안으로 확인할 수 있습니다.

랜더링 이후 스타일 변화로 인해 레이아웃이 변경되거나, 스타일이 수정되는 것은 UX측면에서 좋지 않기 때문에
다음과 같이 서버사이드에서 css-in-js 문법에서 정의된 스타일들이 적용될 수 있도록 설정해주어야 합니다.

다음 예시는 `styled-components` 만 적용되며 추가적인 정보는
[styled-components](https://styled-components.com/docs/advanced#nextjs)를 참고하면 좋습니다.

```json
//package.json

"babel-plugin-styled-components": "^2.0.1",  //resolve
```

```
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

CRA 프로젝트에서 넥스트 프레임워크로 전환하는 작업 중 당연하게도 많은 빌드 실패를 겪었는데요. 일단, '빌드만 성공해보자'
라는 생각으로 작업을 진행했던 내용들을 정리해보았습니다.

`next/image` 적용을 통해 이미지 지연 로딩, 페이지 초기 데이터 패칭을 `getStaticProps` 정의, 서버사이드에서 디스패치된
액션으로 인해 리덕스 상태값이 변화된 것을 어떻게 클라이언트에서 이어서 상태 관리를 할 수 있는 지에 대한 정리도 이어서 작성해보려 합니다.

더 나아가 넥스트로 이관하게 된 궁극적인 목표인 검색 엔진 최적화 작업이나, Web Vital Score를 향상시키기 위한 작업들에 대한 정리도
이어질 예정입니다. 개발자로서 최적화 작업을 진행한다는 것은 상당히 설레는 일인데, 얼른 사용자 경험 지표에 빨간불이 꺼졌으면 좋겠습니다:)