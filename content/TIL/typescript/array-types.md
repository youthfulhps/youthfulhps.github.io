---
title: 타입스크립트의 배열 타입, 어떤 걸 써야하나
date: 2023-12-21 13:05:26
category: typescript
thumbnail: { thumbnailSrc }
description: Array<string> vs string[]
draft: true
type: TIL
---

[@Tanstack/query](https://github.com/TanStack/query)의 메인테이너인 [tkDodo](https://tkdodo.eu/blog/)가 위와 같은 결과에 대해
의견을 적은 글이 있어 정리해본다. 스치듯 고민해볼 만한 이슈에 진심인 걸 보면 배울점이 넘쳐난다.

![타입스크립트의 배열 타입 중 어떤 걸 선호하는지에 대한 투표](./images/array-types/x-poll.png)

기능적 차이는 크게 없지만, 투표 결과는 투표 결과는 `string[]`을 주로 사용하는 경우가 압도적으로 많았다. 그럼 왜 `string[]`을 많이 사용하는가?
단지 타이핑이 비교적 짧아서 일 수도 있겠다. 하지만 코드상에서 짧은 것이 좋은 것이라면, `dashboard` 보다는 `d`, `index` 보다는 `i`가 낫겠다.

## 가독성

보통 왼쪽에서 오른쪽으로 이동하며 읽기 떄문에 중요한 내용이 더 먼저 나와야 한다는 점에서 배열 타입을 나타내는 내용이 먼저 나와야 한다.

```js
```
