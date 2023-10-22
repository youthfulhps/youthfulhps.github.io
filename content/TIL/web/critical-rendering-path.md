---
title: 중요 랜더링 경로
date: 2023-10-22 13:05:26
category: web
thumbnail: { thumbnailSrc }
description: 단골 질문
draft: false
type: TIL
---

중요 랜더링 경로(Critical Rendering Path)는 브라우저가 HTML, CSS, Javascript를 화면에 픽셀로 변환하는 일련의 과정을 말한다.

## 중요 랜더링 경로

### 1. HTML을 통해 DOM 트리를 생성한다.

![DOM 트리 생성 과정](./images/critical-rendering-path/dom-construction-process.png)

[이미지 출처](https://web.dev/articles/critical-rendering-path/constructing-the-object-model?hl=ko)

**1. 변환**

브라우저의 랜더링 엔진은 요청을 통해 전달받은 HTML의 원시 바이트를 읽은 후 파일의 지정된 인코딩 (UTF-8)에 따라 개별 문자로 변환한다.

**2. 토큰화**

브라우저는 [W3C HTML5 표준](https://html.spec.whatwg.org/multipage/)에 따라 지정된 대로 문자열을 개별 토큰으로 변환하고,
꺽쇄 괄호로 묶인 기타 문자열을 반환한다. 각 토큰에는 각각의 고유한 규칙과 의미를 가진다. 즉 개별 문자열에서 HTML5 표준에 입각해서 작성된
문자열 묶음을 찾아 토큰화한다.

**3. 렉싱**

추출된 각각의 토큰은 해당 토큰이 가지는 속성과 규칙을 정의하는 객체(DOM 트리를 구성하는 각각의 노드)로 변환된다.

**4. DOM 생성**

HTML 마크업이 정의한 대로 여러 태그 간의 관계를 따라 렉싱 단계에서 생성된 객체를 트리 구조로 연결한다.

![DOM 트리 예시](./images/critical-rendering-path/dom-tree.png)

[이미지 출처](https://web.dev/articles/critical-rendering-path/constructing-the-object-model?hl=ko)

### 2. CSS를 통해 CSSOM를 생성한다.

DOM 트리가 문서 마크업의 속성과 관계를 캡처하지만, 요소가 랜더링될 때 어떻게 표시되어야 하는지에 대한 정보를 CSSOM로 구성한다.
브라우저가 페이지의 DOM을 생성하는 동안 문서의 헤드 섹션에서 외부 CSS 스타일시트를 참조하는 링크를 만나면 페이지 랜더링 과정에서
해당 자원이 필요하다고 판단하고 즉시 해당 자원에 대한 요청을 보내 CSS를 반환받는다.

CSSOM 트리가 생성되는 과정은 DOM 트리 생성 과정과 동일하게 변환, 토큰화, 렉싱 과정을 걸쳐 CSSOM 트리를 구축한다.

![CSSOM 트리 예시](./images/critical-rendering-path/dom-tree.png)

[이미지 출처](https://web.dev/articles/critical-rendering-path/constructing-the-object-model?hl=ko)

CSS는 가장 일반적인 스타일 규칙이 적용되고 더 구체적인 규칙을 적용하는 하향식이기 때문에 CSSOM 또한 트리 구조를 띄고 있다.

### 3. DOM 트리와 CSSOM 트리를 결합해 랜더트리를 생성한다.

![랜더트리 예시](./images/critical-rendering-path/dom-cssom-are-combined.png)

[이미지 출처](https://web.dev/articles/critical-rendering-path/render-tree-construction?hl=ko)

브라우저는 DOM과 CSSOM을 결합하여 페이지에 표시되는 DOM 컨텐츠와 해당 노드에 대한 CSSOM 스타일 정보를 캡처하는 랜더 트리를 구축한다.

DOM 트리의 루트 노드부터 시작해서 각각의 노드를 순회한다. 이떄 랜더링에 표시되지 않는 script, meta와 같은 태그는 생략되며,
해당 DOM에 대한 CSSOM 스타일 정보 중 `display: none`이 포함되어 있다면 해당 노드 또한 생략된다.

이후 CSSOM 스타일 규칙을 찾아 적용하고, 컨텐츠와 계산된 스타일이 함께 표시된 랜더트리의 노드를 반환한다.

### 4. 레이아웃 (리플로우)

랜더트리가 준비되면 레이아웃 단계를 진행한다. 화면에 표시해야 할 노드와 스타일을 통해 기기의 영역 내에서 노드의 정확한 위치와
크기를 결정하는 단계이다.

레이아웃 단계의 출력은 상자 모델로, 표시 영역 내 각 요소들의 정확한 위치와 크기를 캡처한다. 가령 %와 같은 상대적인 값은 절대적인
픽셀로 반환된다.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Critial Path: Hello world!</title>
  </head>
  <body>
    <div style="width: 50%">
      <div style="width: 50%">Hello world!</div>
    </div>
  </body>
</html>
```

![레이아웃 계산](./images/critical-rendering-path/calculating-layout-inform.png)

[이미지 출처](https://web.dev/articles/critical-rendering-path/render-tree-construction?hl=ko)

### 5. 페인트

레이아웃 단계가 완료되면 페인트 단계를 진행한다. 계산된 박스 모델들의 위치와 크기를 기반으로 실제 화면에 그려낸다.

## 중요 랜더링 경로에서 기억해둘 것들

### 1. CSS 자원은 랜더링을 차단한다.

CSS는 일반적으로 랜더링을 차단하는 리소스이다. CSSOM이 구성이 되어야 레이아웃과 페인트 단계에서 입력으로 사용되는 랜더트리를 생성할 수 있고,
DOM이 없다는 것은 랜더링 할 것이 없다는 명확한 결과가 있지만, CSS 경우 불명확하다. 즉 CSS는 최대한 빨리 제공되어야 한다. (css 링크가 head에 있는 이유)
만약, CSS를 차단하지 않고 랜더링하는 경우 일시적으로 스타일이 적용되지 않은 상태로 랜더링되어 버리는 FOUC (Flash of Unstyled Content)가 발생한다.

여기서 미디어 유형 및 쿼리를 사용해서 CSS 자원이 랜더링을 차단하지 않도록 지시할 수 있다. 하지만, 초기 랜더링 시에 긴급하게 적용 여부만 나타낼 뿐, 비차단 자원의
우선순위가 낮더라도 브라우저는 모든 CSS 자원을 다운로드한다.

```html
<!--모든 조건에 랜더링을 차단한다.-->
<link href="style.css" rel="stylesheet" />
<!--모든 조건에 랜더링을 차단한다.-->
<link href="style.css" rel="stylesheet" media="all" />
<!--화면이 portrait 모드일 때만 랜더링을 차단한다. 만약 Landscape(가로) 모드라면 비차단.-->
<link href="portrait.css" rel="stylesheet" media="orientation:portrait" />
<!--웹을 인쇄할 때만 적용되기 때문에 초기 랜더링 시 비차단으로 다운로드된다.-->
<link href="print.css" rel="stylesheet" media="print" />
<!--쿼리로 전달된 조건에 일치하는 경우 랜더링을 차단한다.-->
<link href="other.css" rel="stylesheet" media="(min-width: 40em)" />
```

### 2. script 태그는 페이지 하단에 위치하는 것이 좋다.

script 태그를 통해 얻는 자바스크립트 자원은 컨텐츠, 스타일, 상호작용에 대한 응답 등 페이지의 모든 측면에 변경을 가할 수 있다.
즉, 브라우저는 스크립트가 페이지에서 무엇을 하려고 하는 지 알지 못하기 때문에 최악의 시나리오를 가정하고 파서를 중단하고 자바스크립트 엔진에게
제어권을 넘겨 스크립트를 파싱하고 실행한다. 이는 초기 랜더링에 지연을 발생시킬 뿐 아니라 스크립트에서 아직 생성되지 않은 DOM을 쿼리할 여지가
있기 때문에 script 태그는 페이지 구성요소 최하단에 위치하는 것이 좋다.

추가적으로 인라인 스크립트가 아닌 외부의 자바스크립트 자원을 불러오는 경우 자원이 모두 다운로드될 때까지 밀리초 단위의 지연이 발생한다.
자원의 다운로드가 지연을 불러오는 이슈를 막기 위해 스크립트가 사용 가능해질 때까지 DOM 생성을 차단하지 않도록 브라우저에게 지시할 수 있다.

### 3. 리플로우, 리페인트

(작성중...)

```html
<!--스크립트가 사용 가능해질 떄까지 DOM 생성을 차단하지 않고 이어간다. 이후 스크립트가 사용가능해지면 중단되고 스크립트를 실행한다.-->
<script src="app.js" async></script>
<!--스크립트가 사용 가능해질 때까지 DOM 생성을 차단하지 않고 이어간다. 이후 페이지 구성이 모두 완료되면 스크립트를 실행한다.-->
<script src="app.js" defer></script>
```

## Reference

- [주요 랜더링 경로](https://web.dev/articles/critical-rendering-path?hl=ko)
