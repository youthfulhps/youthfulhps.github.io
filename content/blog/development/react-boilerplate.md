---
title: 리엑트 개발 환경 구축기
date: 2022-10-21 00:10:16
category: development
thumbnail: { thumbnailSrc }
draft: true
description: 늦었다고 생각해서 늦은 리엑트 개발 환경을 직접 구축해봅니다. 굿바이 CRA!
---

> _실무에서 create-react-app 사용하나요?_

최근에 우연히 프론트엔드 개발자를 준비하시는 지인분께서 하신 질문인데, 생각보다 개운하게
답변드리지 못했는데요. 질문을 _'제품을 개발하기 위한 환경 구축을 밑바닥부터 스크래치 하는 지?'_
로 생각해보면 사실 경험이 적었다는 걸 스스로 느꼈던 것 같아요.

주로 다루어왔던 next.js 프로젝트의 경우 어느정도 구조 컨벤션이 정해져 있는터라,
감사하게 `create-next-app` 을 기꺼이 사용해왔던 것 같고, `create-react-app` 을 통해
프로젝트를 생성하면, 꽤나 큰 보일러플레이트 덩치와 설정을 커스텀하기 불편하다는 걸 직접 느낀
경험이 없는 걸 보면 아직 멀었다 싶기도 하면서, 어떤 불편함인지 궁금하기도 했습니다.

> _create-react-app 없이도 프로젝트를 설계하실 수 있으면 좋지 않을까요?_

이왕 이렇게 대답한 김에 저도 희미해진 개발 환경 구축에 대한 기억들을 한곳에
모아두고자 리엑트 개발 환경을 밑바닥부터 스크래치해보고 글로 정리해두려 합니다.
겸사겸사 개인 보일러플레이트도 만들어두고 싶으신 분들께 도움이 되셨으면 좋겠습니다.

## 자바스크립트 패키지 관리 환경

프로젝트에서 노드 런타임에서 동작하는 패키지들을 관리하기 위해 yarn을 사용하려 합니다.
yarn으로 관리되는 프로젝트를 초기화하기 위해 다음과 같은 명령어를 사용해봅시다.

```shell
~$ yarn init -y
```

패키지 json의 등장

```json
// package.json
{
  "name": "react-boilerplate",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "git@github.com:youthfulhps-tutorial/react-boilerplate.git",
  "author": "youthfulhps <ybh942002@gmail.com>",
  "license": "MIT"
}
```

## 리엑트 의존성 설치

```shell
~$ yarn add react react-dom
```

package.json에서 dependencies 추가됨
짚고 넘어가자면, 빌드시에 패키지가 필요한가? 라는 질문이 필요하다.
타입스크립트의 타입 선언문은 런타임에서 모두 제거가 되고, 마찬가지로 빌드 단계에서
모두 제거된다. 즉, 타입 선언 패키지의 경우 devDependencies에 포함되어야 한다.

```json
// package.json
{
  ...
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

## 타입스크립트

설정한번 들쳐보면 좋을 듯??

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "sourceMap": true,
    "isolatedModules": true,
    "strict": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "noEmit": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "typeRoots": ["node_modules/@types"],
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## 타입 선언 패키지 의존성 추가

```shell
~$ yarn add --dev typescript @types/react @types/react-dom
```

## 긴장되는 웹팩 설정

웹팩 번들러를 사용하기 위한 의존성 추가

```shell
~$ yarn add --dev webpack webpack-cli webpack-dev-server
```

웹 구성에 사용되는 모든 자원을 웹팩에서는 모듈이라 부르며, 빌드 단계에서
각각의 모듈에 맞게 개별 파일들을 불러와 파싱할 수 있도록 관련 로더들을 추가한다.

```shell
~$ yarn add --dev ts-loader css-loader style-loader file-loader html-webpack-plugin
```

프로젝트에서 활용되는 환경변수 관리를 위해

```shell
~% yarn add dotenv
```

webpack.config.js 파일 작성

```js
require('dotenv').config();

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? 'hidden-source-map' : 'source-map',
  entry: './src/index.tsx',
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/dist'),
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: !isProd,
        },
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(webp|jpg|png|jpeg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      hash: true,
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    host: 'localhost',
    port: PORT,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
    overlay: true,
    stats: 'errors-only',
  },
};
```
