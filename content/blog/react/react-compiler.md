---
title: 리엑트 컴파일러
date: 2025-11-24 16:11:15
category: react
description: 엄격한 규칙 부여와 그에 따른 성능 최적화의 자동화
thumbnail: { thumbnailSrc }
draft: true
---

[리엑트 컴파일러가 안정한 버전으로 출시](https://react.dev/blog/2025/10/07/react-compiler-1)되었다. 리엑트는 앱의 성능을 개선하기 위한
메모이제이션 API를 제공하여 선택적으로 최적화할 수 있도록 도왔다. 하지만 올바르게 사용하기 어렵다. 오히려 남용으로 인해 디버깅이 필요한
코드를 양산하게 되고, 리엑트라는 도구를 접하는 사용자 접근성에 허들이 된다.

리엑트 컴파일러는 순수한 랜더 함수와 훅 규칙과 같은 관용적인 리엑트 패턴이 적용된 코드의 메모이제이션 기능 적용 가능성을
판단하여 메모이제이션 기능을 주입해 최적화된 성능을 제공하는 코드를 생산한다. 이는 개발자가 선언적이고 단순한 코드에 집중할 수 있도록 돕는 새로운 개념이다.

리엑트 컴파일러는 바벨 플러그인으로 제공되어 컴파일 단계에 적용되고, 코드 작성 단계에서 리엑트 컴파일러의 관용적인 패턴을 검증하기 위한 eslint 플러그인을 제공한다.

```shell
~$ npm install -D babel-plugin-react-compiler@latest
~$ npm install -D eslint-plugin-react-hooks@latest
```
