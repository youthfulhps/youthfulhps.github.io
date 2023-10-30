---
title: 웹 제품을 만들기 위한 개발 환경과 기술 스택 되짚어보기
description: 개인 프로젝트 제작 AtoZ.
date: 2023-10-23 09:10:35
category: development
thumbnail: { thumbnailSrc }
draft: true
---

GitGlances라는 웹과 크롬 익스텐션 제품을 만들기 위한 개발 환경 구축과 선택한 기술 스택에 대해서 되짚어보려 한다.
이미 환경이 구축되어 있는 프로젝트에 합류해 개발하게 된 경험이 많아 직접 초기 단계부터 환경을 만들어가는 작업은 낯설기도 하면서 클라이언트 개발 환경을
다시금 공부하기 좋은 경험이었다.

## 패키지 매니저

패키지 매니저는 패키지 의존성 관리와 프로젝트의 메타데이터, 스크립트 등 관리 포인트들을 묶어 손쉽게 관리할 수 있도록 도와준다.
npm을 시작으로 yarn, pnpm 등 여러 패키지가 있지만, 프로젝트를 시작한 시점에 가장 자주 사용하고 익숙했던 yarn을 사용했다.
(현재는 pnpm을 주로 사용하곤 한다.)

yarn의 경우 깊어지는 의존성에 따라 중복 설치되는 의존성들을 호이스팅시켜 플랫하게 관리하는 컨셉을 가지고 있다. 참고로 현재는 pnpm을 주로 사용하곤 한다.
pnpm은 심링크와 하드링크를 통해 프로젝트에서 필요한 의존성을 로컬 디스크의 상위 스토어에 설치된 의존성을 가리켜 사용하는 `Content-addressable-storage`
전략을 통해 여러 프로젝트에서 중복되게 사용되는 의존성에 대한 중복 설치를 방지하고 있다. 이 컨셉이 적잖게 충격이었다.

```shell
~$ yarn init
```

```json
{
  "name": "git-glances",
  "version": "2.2.2",
  "main": "index.js",
  "repository": "git@github.com:youthfulhps/git-glances.git",
  "author": "youthfulhps <ybh942002@gmail.com>",
  "license": "MIT",
  ...
}
```

## 번들러

CommonJS와 같은 모듈 시스템 등장 이래로 규모가 큰 코드 베이스와 모듈화된 코드 파일 관리를 통해 프로젝트를 제작 및 관리한다.
여기서 모듈은 단순히 모듈화된 스크립트 뿐만 아니라 CSS, 이미지 등 웹을 구성하기 위한 모든 자원을 모듈이라 한다.

번들러는 모듈 내의 파일 단위와 변수 유효 범위를 유지한채 하나의 파일로 모듈들을 묶어 페이지 구성을 위한 모듈들을 요청함에 따라 정량적으로 늘어나는 요청 횟수를
최소화할 수 있다. 원한다면 코드 스플리팅을 통해 원하는 모듈을 따로 번들링하여 원하는 때에 로드할 수 있고 사용하지 않은 코드들을 제거(트리 쉐이킹)할 수 있다.

최근 웹팩 대비 빌드 속도가 엄청나게 개선된 esbuild가 많은 관심을 받고 있고, 최근 실무에서는 vite를 주로 사용하면서 웹팩에 비해 커스텀이나 설정이 간결해졌다는
느낌을 많이 받아 번들러 선정단계에서 많은 고민이 있었다.

하지만 결과적으로 웹팩을 결정했다. 여러 이유가 있겠지만, 최근 번들러들이 간결한 설정을 제공하는 만큼 실무에서 번들러에 문제가 생겨 건드려야 하는 일이 생기면
웹팩일 가능성이 높겠거니 싶어 개선점 적용에 부담이 적은 개인 프로젝트에서 만큼은 웹팩을 다루어보는 것도 즐겁지 않을까 싶었다.

```shell
~$ yarn add --dev webpack webpack-cli
```

웹팩의 config 파일은 다음과 같은 기본 구조를 가진다.

```js
var path = require('path');

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

### entry, output

번들링이 시작되는 진입점을 entry 포인트로 제공하고, 번들링된 결과를 output 경로에 반환하는 설정이다. 외람된 이야기지만, entry 진입점은 다중일 수 있고
멀티 페이지 앱을 만들기 위해 각각의 페이지별로 번들링 할 수 있다.

```js
entry: {
  login: './src/LoginPage.js',
  main: './src/MainPage.js'
}
```

### loader

웹팩이 모듈들을 해석할 때 자바스크립트 파일이 아닌 웹 자원(HTML, CSS, 이미지, 폰트 파일 등)을 변환할 수 있도록 각각의 모듈에 대해 로더를 지정해주어야 한다.
module이라는 프로퍼티 명을 사용한다.

```js
// ...
module: {
  rules: [
    {
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
    {
      test: /\.css?$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    },
    {
      test: /\.(webp|jpg|png|jpeg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]',
      },
    },
    {
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    },
  ];
}
```

여기서 기억해두면 좋은 것은 로더를 적용할 파일 유형이 같다면 규칙 배열에 먼저 오는 로더가 적용되고, 하나의 규칙에 여러 개의 로더를 사용할 수 있다면
use 배열에 제공되는 로더 중 가장 오른쪽 로더가 먼저 적용된다.

```js
// css-loader가 style-loader보다 우선 적용
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['css-loader'],
    },
    {
      test: /\.css$/,
      use: ['style-loader'],
    },
  ];
}
```

```js
// sass-loader -> css-loader -> style-loader 순으로 로더 적용
modules: {
  rules: [
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    },
  ];
}
```

### plugin

웹팩의 플러그인은 웹팩의 기본적인 동작에 추가적인 기능을 제공하는 데 사용된다. 로더는 자바스크립트 파일이 아닌 모듈들에 대해서 해석하고 변환할 수 있는
과정에 관여하지만, 플러그인은 해당 결과물에 대해 형태를 바꾸거나 기본적인 번들링 과정 외에 추가적인 작업을 지시할 때 사용한다.

```js
plugins: [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'public', 'index.html'),
    hash: false,
  }),
  new webpack.DefinePlugin({
    'process.env': JSON.stringify(process.env),
    'process.env.IS_WEB': JSON.stringify(isWeb),
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'public/*.png'),
        to() {
          return '[name][ext]';
        },
      },
      {
        from: path.resolve(__dirname, 'public/icons'),
        to() {
          return 'icons/[name][ext]';
        },
      },
      {
        from: path.resolve(__dirname, 'public/manifest.json'),
        to: 'manifest.json',
      },
      ...(!isWeb
        ? [
            {
              from: path.resolve(__dirname, 'public/favicon.png'),
              to: 'icons/icon16.png',
            },
          ]
        : []),
    ],
  }),
];
```

### CleanWebpackPlugin

빌드를 새롭게 진행할 때 이전 결과물을 정리해주는 플러그인이다. 기존 빌드 결과물에 해시가 따로 없어 구분이 어렵지 않도록 output 디렉토리를
정리해준다.

```js{2}
plugins: [
  new CleanWebpackPlugin(),
  ...
]
```

### HtmlWebpackPlugin

번들링이 완료된 자바스크립트 파일을 script 태그를 통해 불러오는 HTML 파일을 생성해주는 플러그인이다.

```js{3-6}
plugins: [
  ...
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'public', 'index.html'),
    hash: false,
  }),
  ...
]

```

```html
<!DOCTYPE html>'
<html>
  <head>
    ...
  </head>
  <body>
    <script defer="defer" src="main.js"></script>
  </body>
</html>
```

### CopyWebpackPlugin

원하는 모듈을 복사해서 빌드 결과물에 포함시켜주는 플러그인이다. 주로 이미지와 같은 에셋을 대상으로 사용했다.

```js
```

- CopyWebpackPlugin, 원하는 모듈을 복사해서 빌드 결과물에 포함시켜준다. 주로 에셋들을 대상으로 사용했다.'

### 부가적인 설정들

부가적으로 개발 과정에서 빌드 결과물 새로고침을 위해 webpack-dev-server를 사용했다. 코드를 수정하고 웹팩 명령어를 실행하지 않아도 빌드 후 결과물을 통해
새로고침해주는 웹팩 기반의 필수적인 기능이다.

```shell
~$ yarn add --dev webpack-dev-server
// 설정 추가 후
~$ webpack serve
```

```js
// webpack.config.js
devServer: {
  host: 'localhost',
  port: PORT,
  open: true,
  hot: true,
  compress: true,
  historyApiFallback: true,
}
```

실험적인 기능으로는 topLevelAwait를 사용했다. ES2022에 새롭게 등장한 기능인데 async로 감싼 await를 구성하기 위해 임의의 함수를 작성하지
않아도 돼서 좋은 경험이었다.

```js
experiments: {
  topLevelAwait: true,
}
```

더불어 일반적이진 않지만, 본 프로젝트는 웹과 크롬 익스텐션을 동시에 빌드할 수 있도록 구성한 프로젝트여서 번들링 과정에서 분기를 주어야 했고, 환경 변수를 통해
빌드 환경을 분기처리해서 진입점을 구분짓고, 크롬 익스텐션 빌드에 필요한 에셋을 구성할 수 있도록 했다.

```javascript{3, 8, 13}
module.exports = ({ ENV, TARGET }) => {
  const isProd = ENV === 'production';
  const isWeb = TARGET === 'web';

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'hidden-source-map' : 'source-map',
    entry: isWeb ? './src/Web.tsx' : './src/Extension.tsx',
    ...
      new CopyWebpackPlugin({
        patterns: [
          ...,
          ...(!isWeb
            ? [
              {
                from: path.resolve(__dirname, 'public/favicon.png'),
                to: 'icons/icon16.png',
              },
            ]
            : []),
        ],
      }),
```

## 트랜스컴파일러

브라우저마다 해석가능한 자바스크립트 스펙이 조금씩 다르다. 크롬에서는 동작하지만, 윈도우 익스플로워에서는 동작이 안되는 것과 같고, mdn의 자바스크립트 참고서에서
문법에 대한 [브라우저 호환성](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise#%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80_%ED%98%B8%ED%99%98%EC%84%B1)
을 제공을 해주는 이유이다.

babel은 이러한 크로스 브라우징 이슈를 해결하기 위해 브라우저에서 이해할 수 있는 스펙의 자바스크립트로 내가 작성한 코드를 적당히 트랜스파일링해준다.
일반적으로 코드를 파싱해서 추상 구문 트리로 변환하고, 추상 구문 트리를 통해 브라우저가 해석할 수 있는 적당한 스펙의 자바스크립트로 코드 재생성 과정을 진행한다.

babel은 자바스크립트 외에 react에 포함된 jsx 문법이나, 타입스크립트로 작성된 코드를 자바스크립트로 변환하기 위해 몇 가지 플러그인들을 제공했지만, 유사한 목적을
이루기 위한 플러그인들을 묶은 프리셋을 제공한다.

```js
module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    'babel-plugin-macros',
    'styled-components',
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
  ],
};
```

### babel-env

env 프리셋은 브라우저 버전을 제공해 해당 브라우저를 타겟으로 동작 가능한 코드를 재생산하고, 폴리필을 제공하는 데 사용된다.
가령 ECMAScript2015의 Promise를 babel을 통해 코드를 변환하면 다음과 같은 결과를 얻는데

```js
new Promise();
```

```js
'use strict';

new Promise();
```

여전히 Promise로 유지되는 코드는 Promise 문법을 해석할 수 없는 윈도우 익스플로어와 같은 브라우저에서 레퍼런스 에러를 던진다.
env 프리셋은 이러한 이슈에 맞서 Promise를 해석할 수 있도록 코드 조각을 제공하여 문제를 해결한다.

```javascript{4-8}
[
  "@babel/preset-env",
  {
    useBuiltIns: "usage", // 폴리필 사용 방식 지정
    corejs: {
      // 폴리필 버전 지정
      version: 2,
    },
  },
],
```

```js
'use strict';

require('core-js/modules/es6.promise');
require('core-js/modules/es6.object.to-string');

new Promise();
```

### @babel/preset-react

리엑트를 위한 프리셋도 마찬가지로 브라우저에서 리엑트에서 사용되는 구문을 해석 가능하도록 코드를 변환하는데 사용된다.

```jsx
import React from 'react';

function Component() {
  return <button>Click me!</button>;
}

export default Component;
```

```js
import React from 'react';
import { jsx as _jsx } from 'react/jsx-runtime';
function Component() {
  return /*#__PURE__*/ _jsx('button', {
    children: 'Click me!',
  });
}
export default Component;
```

### @babel/preset-typescript

```ts
const foo: number = 1;
```

```js
const foo = 1;
```

### babel-loader

babel은 일반적으로 webpack과 함께 사용한다. 개발 단계에서 트랜스파일링된 코드를 사용할 일이 크게 없기 떄문에 빌드 과정에서 적절한 스팩의 자바스크립트로 변환한 후
이를 번들링할 수 있도록 제공한다.

babel을 webpack에서 사용하기 위한 babel-loader가 제공된다. 트랜스파일링과 번들링을 마친 빌드 파일을 제공하는 패키지가 담겨있는 node_modules
은 제외시켰다.

```js{1, 6-10}
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  ..
};
```

### babel-loader와 babel.config.js

babel-loader의 옵션으로 프리셋과 플러그인들을 제공할 수 있어 babel 설정 파일을 따로 구성할 필요 없지만, 만약 프로젝트 루트 폴더에 babel 설정 파일이
존재한다면 babel-loader가 적용될 때 해당 설정을 읽어드리기 때문에 옵션과 설정을 제공하는 방법은 자유롭게 선택 가능하다.

## 테스트

테스트는 jest 환경에서 리엑트 테스트를 위해 testing-library를 사용했다. 타입스크립트 기반으로 코드가 구성되어 있기 때문에 ts-jest를 사용해
설정을 구성했다. 테스트를 진행하는데 있어 필요한 프리셋과, 테스트 환경을 지정해주었고, test-library 환경 셋업 파일을 기본적으로 제공한다.

```ts
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  ...
};

export default config;
```

부가적으로 만약 모듈을 불러오는 경로에 별칭을 부여해서 축약해 사용했다면, jest에게도 제공해주어야 했다. 웹팩의 alias 속성을 넣어주는 것과
동일하다.

```ts{3-7}
const config: JestConfigWithTsJest = {
  ...,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@layout(.*)$': '<rootDir>/src/_layout/$1',
    '^@shared(.*)$': '<rootDir>/src/_shared/$1',
  },
}
}
```

또한 타입스크립트에서 자바스크립트로 변환해 테스트할 때 변환된 결과가 개발 결과물과 동일하게 유지하기 위해 프로젝트에서 사용되는 타입스크립트 및
babel 설정 파일을 제공할 수 있다.

```ts{3-12}
const config: JestConfigWithTsJest = {
  ...,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
        babelConfig: '<rootDir>/babel.config.js',
        useESM: true,
      },
    ],
  },
}
}
```

### 순수한 함수와 섹션 통합 단위 테스트

'정령 나는 테스트 코드를 의지하고 필요로 할까, 아니면 공개된 프로젝트라서 구색 맞추기 위함인걸까?' 강한 결합들로 이루어진 코드를 작성하고
나서 테스트 코드를 작성할 때 후회하며 들었던 생각이다. 다시 한번 실패하는 테스트 코드가 구현 코드보다 먼저 작성되어야 한다는 걸 느꼈다.

100%의 테스트 커버리지를 자랑하는 것도 좋겠지만, 테스트 코드 작성 이유에 대해 경험을 통해 동의할 수 있는 부분들을 위주로 커버하려 했다.
그 시작점은 사이드 이펙트가 없는 순수한 함수 테스트이다. moment와 같은 라이브러리에서 제공하는 함수들을 사용하는 함수들의 테스트는 moment
자체적으로 잘 테스트했으리라 기대하고, 내가 작성한 유틸 함수들만 테스트했다.

급하게 구현한 유틸 함수들의 로직이 나중에 봤을 때 구구절절 불편하게 느껴질 때가 분명히 있다. 이때 테스트 코드는 리팩토링의 부담을 덜어주고
리팩토링한 결과에 대해 프로그래밍적으로 동일성 여부를 확인할 수 있다.

```ts
export const getSortedLanguageList: SortedLanguageList = mergedLanguageList => {
  return Object.entries(mergedLanguageList)
    .sort(([, a], [, b]) => Number(b) - Number(a))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
};
```

```ts
describe('...', () => {
  it('getSortedLanguageList는 병합된 언어별 사용량을 기준으로 내림차순 정렬하여 반환한다.', () => {
    expect(getSortedLanguageList({})).toStrictEqual({});
    expect(getSortedLanguageList(mockedMergedLanguageList)).toStrictEqual(
      mockedMergedLanguageList
    );
  });
});
```

그 다음으로 진행한 테스트는 섹션별 임의로 생성한 가짜 데이터로 의존성을 해결한 통합 테스트였다. 진행한 프로젝트는 섹션별로 각각의 기능을 담고 있는
구조로 구성했기 때문에 섹션 단위로 통합 테스트를 진행했다. 서버에 가져온 데이터라 가정한 가짜 데이터와 강한 결합을 이루고 있는 전역 상태를 주입해 의존성을
해결해주었다.

```tsx
import { render, screen } from '@testing-library/react';
import { ContributionsCollection } from '@shared/apis/contribution';
import Contribution from '../components';
import useContributionsCollectionQuery from '../queries/useContributionsCollectionQuery';
import { mockedContributionCollection } from './mocks';
import { RecoilRoot } from 'recoil';

const mockedUseContributionQuery = useContributionsCollectionQuery as jest.Mock<
  ContributionsCollection
>;

jest.mock('../queries/useContributionsCollectionQuery');

describe('Contribution 컴포넌트는 유저의 오늘 기여도 정보를 랜더링한다.', () => {
  beforeEach(() => {
    mockedUseContributionQuery.mockImplementation(
      () => mockedContributionCollection
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('유저의 총 기여도는 섹션 요약 정보에서 제공한다.', async () => {
    render(
      <RecoilRoot>
        <Contribution />
      </RecoilRoot>
    );
    const totalContributions = await screen.findByText('3');
    expect(totalContributions).toBeInTheDocument();
  });
});
```

## 프로젝트 구조

components, hooks, utils 별로 디렉토리를 구성하고 로직 레벨과 UI를 융합하기 위해 상단 디렉토리로 다시 거슬러 올라가 의존성을 찾아내는 경험이 어쩌면 당연시 되었다.
더불어 코드 베이스가 커지면서 원하는 의존성이 어디에 위치해 있는지 해당 의존성과 관련된 코드의 기억을 더듬어 검색해 디렉토리를 찾아내곤 한다.

```js
import { getSortedLanguageList } from '../../../../utils/language';
```

그러다 우연히 이전 회사 리드분의 프로젝트 구조를 보고선 카톡을 보내 해당 프로젝트 구조의 레퍼런스를 얻었다.
[지역성의 원칙을 고려한 패키지 구조: 기능별로 나누기](https://ahnheejong.name/articles/package-structure-with-the-principal-of-locality-in-mind/)에서
잘 설명하고 있어 레퍼런스를 읽어보면 좋다.

받아드리기 나름이지만, 개인적으로는 캐시 미스를 최소화할 수 있는 지역성이 발생하는 단위인 기능별로 프로젝트를 구성해서 기능별 맥락 블록을 머리 속 캐시에
적재한 상태로 작업하면 거대한 코드 베이스 속에서 헤매이지 않도록 프로젝트 구조에 반영했어야 했고, 마침 섹션별로 독립적인 기능을 구사하는 프로젝트에서는 맥락을
빠르게 잡는 장점과 더불어 기능 개발의 시작과 끝, 그리고 코드 수정 범위를 예상하는 데 큰 도움이 되었다.

최종적으로 마치 작은 프로젝트처럼 동작하는 기능들의 모임들로 디렉토리가 갖춰졌다.

```js
src
├─ Contribution
│  └─ components
│  └─ queries
│  └─ test
│  └─ utils
├─ Daily
├─ Language
├─ Notification
├─ Refactor
├─ ...
├─ _layout
├─ _shared
```

## react

## react-query

## recoil

## tailwindCSS

## Reference

- [프론트엔드 개발환경의 이해: Babel](https://jeonghwan-kim.github.io/series/2019/12/22/frontend-dev-env-babel.html)
- [React 개발 환경 구축하며 알게된 자잘한 것들](https://maxkim-j.github.io/posts/frontend-tooling-ideas/)
- [지역성의 원칙을 고려한 패키지 구조: 기능별로 나누기](https://ahnheejong.name/articles/package-structure-with-the-principal-of-locality-in-mind/)
