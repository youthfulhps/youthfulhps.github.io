---
title: 정규 표현식을 알아보자
date: 2022-12-07 15:12:26
category: development
thumbnail: { thumbnailSrc }
draft: true
description: 멈춰 짜집기
---

최근 정규 표현식을 마주하는 일이 잦아진 것 같습니다. 주로 문자열의 유효성 검사를
위해 작성되었던 정규 표현식들과, 에디터에서 특정 문자열 검색을 위해 정규식 검색을
사용하곤 합니다.

사실 정규 표현식을 사용할때면, 이미 작성되어 있는 표현식들을 짜집어 사용하거나,
구글링해야 하는 경우가 부지기수였는데요. 이번 기회에 생각하는대로 표현식을 작성
할 수 있도록 공부한 내용을 정리해보려 합니다.

## 정규 표현식

정규 표현식(Regular Expression)은 특정 규칙을 가진 문자열의 집합을 표현하고자
고안된 형식 언어입니다. 대부분의 텍스트 에디터, 프로그래밍 언어에서 문자열의 검색과
치환을 위해 정규 표현식을 문법으로 내장하고 있거나, 표준 라이브러리를 제공합니다.

자바스크립트는 정규 표현식의 문법을 구현체에 담아 RegExp 객체로 제공하고 있는데요.
이는 정규 표현식의 패턴을 사용해 텍스트를 판별할 때 사용할 수 있습니다.

간단한 예제부터 살펴봅시다. 다음은 특정 문자열에서 'Hello' 라는 단어를 찾고자
작성된 정규 표현식입니다.

![Introduction regular expression example](./images/regular-expression/intro-regex-example.png)

문자열에서 'Hello'가 하이라이팅된 것을 확인할 수 있습니다. 그렇다면, 정규 표현식이
어떻게 구성되어 있는 지 알아봅시다.

## 정규 표현식의 구성

정규 표현식은 크게 패턴(Pattern)과 플래그(Flag)로 구성되어 있는데요. 패턴의 시작과
끝을 `/` 로 구분짓고, 그 뒤로 플래그가 붙게 됩니다.

![Regular expression composition](./images/regular-expression/regex-composition.png)

패턴은 일치하는 텍스트가 준수해야 하는 '패턴'을 표현하기 위해 사용하고, 우리가 흔히
사용하는 **문자 그대로의 정규 문자와, 특별한 의미를 담는 메타 문자로서 패턴을 표현**
할 수 있습니다.

그 다음으로 플래그는 옵션입니다. 즉 사용하지 않아도 되며, 이 때는 문자열 내 검색
매칭 대상의 첫 번째 매칭 대상을 찾게되면 검색을 종료하고 이를 반환합니다.

```javascript
const target = '가장 큰 약점은 약점을 보일 것에 대한 두려움이다.';

const regexr = /약점/;
console.log(target.match(regexr)); // ['약점', 5, '가장 큰 약점은...'];
```

만약 문자열 내 패턴에 일치하는 대상을 모두 반환하고 싶다면, `g` 플래그를 사용할 수
있습니다.

```javascript
const target = '가장 큰 약점은 약점을 보일 것에 대한 두려움이다.';
const regexr = /약점/g;

console.log(target.match(regexr)); // ['약점', '약점'];
```

참고로, 자바스크립트의 `String.prototype.match()` 메서드는 정규 표현식에
`g`가 포함되어 있지 않다면 첫 번째 매칭대상과 함께 index, input을 함께 반환하며,
반대로 `g`가 포함되어 있다면 일치하는 모든 대상을 포함하는 배열을 반환합니다.

또한 플래그는 다중으로 사용할 수 있는데요. 영문을 패턴으로 검색할 때 대소문자 구분없이
모든 대상을 반환받고 싶다면, 대소문자 구분을 무시하라는 의미의 `i`와 모든 대상 검색을
의미하는 `g` 플래그를 함께 사용하여 표현할 수 있습니다.

```javascript
const target = 'The biggest weakness is the fear of showing weakness.';
const regexr = /The/g;
const regexrWithIgnoreCase = /The/gi;

console.log(target.match(regexr)); // ['The']
console.log(target.match(regexrWithIgnoreCase)); // ["The", "the"]
```

개인적으로 가장 많이 사용하는 `g`, `i` 플래그들과 함께 자바스크립트가 지원하는
플래그 6개들은 다음과 같습니다.

- i, 대소문자 구분을 무시하고 검색합니다.
- g, 패턴과 일치하는 모든 대상을 검색합니다.
- m, 다중 행 모드로 검색합니다.
- s, 메타문자 `.`이 개행 문자 `\n`도 포함하는 'dotall' 모드로 검색합니다.
- u, 유티코드 전체를 지원하여 검색합니다.
- y, 문자 내 특정 위치에서 검색을 진행하는 'sticky' 모드로 검색합니다.

몇 가지 추가적인 플래그들이 존재합니다.

위 hello 예시에서 정규식은 어떤 문법을 통해 구성되어 있는지?

문법에 대한 하나하나 설명

## Reference

- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/match
