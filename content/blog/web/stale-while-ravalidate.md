---
title: stale-while-revalidate는 어떻게 활용되고 있을까
date: 2022-06-01 16:06:87
category: web
thumbnail: { thumbnailSrc }
draft: false
---

클라이언트를 개발하면서 [HTTP Cache-Control Extensions for Stale Content](https://datatracker.ietf.org/doc/html/rfc5861)의
`stale-while-revalidate (swr)` 확장을 기반으로한 구현체들을 많이 접하게 됩니다.

swr 전략에 대해 알아보고, 구현체들에서 어떻게 활용되고 있는 지 알아봅시다.

## stale-while-revalidate

swr 전략은 캐싱된 컨텐츠를 즉시 로드하는 즉시성과 캐싱된 컨텐츠에 대한 업데이트가
미래에 사용되도록 보장하는 균형을 유지하는 데 사용되는 디렉티브입니다.

브라우저는 기본적으로 Cache-Control의 max-age를 기준으로 캐싱된 컨텐츠의 최신 상태 여부를 판단하게 되는데,
swr은 낡은 캐싱 컨텐츠에 대한 확장된 지시를 표현합니다.

```yaml
Cache-Control: max-age=1, stale-while-revalidate=59
```

위와 같은 HTTP 해더는 캐싱된 컨텐츠에 대해 아래와 같이 지시를 따르게 됩니다.

1. HTTP 요청이 1초(max-age) 이내에 반복적으로 발생한다면, 유효성 검증 없이 캐싱된 컨텐츠를 반환합니다.

![Requests within max-age return caching data](./images/stale-while-revalidate/swr-flow-1.png)

2. HTTP 요청이 1 ~ 60초(max-age ~ swr) 사이에 반복적으로 발생할 경우,
   우선 낡은 캐싱된 컨텐츠를 반환하고, 이와 동시에 캐싱된 데이터를 새로운 값으로 채우도록 재검증 요청이 발생합니다.

![Return stale caching content for requests within swr, request re-validation](./images/stale-while-revalidate/swr-flow-2.png)

3. HTTP 요청이 60초(swr ~) 이후 시점에 발생한다면, 요청이 서버로 전달되어 컨텐츠를 반환받습니다.

## react-query, swr

[react-query](https://react-query.tanstack.com/)와 [swr](https://swr.vercel.app/ko)는 swr 전략을 취한 대표적인 데이터 패칭 도구입니다.

클라이언트에서 리덕스를 사용한다면 서버로부터 전달받은 값을 리덕스에 저장하고
최신화된 데이터로서 사용됩니다. 하지만 특정 시점의 서버 데이터를 캡쳐한 것이고,
이 데이터가 실제 최신화된 데이터라는 보장하기가 어렵습니다.

그렇다보니 페이지 전환, 유저의 인터렉션이 새롭게 발생되면 새로운 요청을 통해
리덕스 스토어의 값을 업데이트해주어야 하는 최신화에 대한 의무와 시점에 대한 고민,
그리고 중복된 디스패치에 대한 제거는 오로지 클라이언트 개발자의 몫이었습니다.

반면 react-query, swr은 주기적으로 서버의 값을 가져와 최신화된 데이터를
메모리에 캐싱하는 전략을 통해 캐싱, 업데이트 및 동기화, 에러 핸들링 등 복잡한
비동기 과정을 앱에게 책임지게 할 수 있도록 도와줍니다.

react-query의 경우, 비동기 데이터 소스에 대해 쿼리라는 고유키를 통해 관리하며
데이터 상태를 `fresh`, `fetching`, `stale`, `inactive` 로 표현합니다.

`staleTime` 을 통해 fresh한 데이터의 stale 전환 시간을 설정하고,
`cacheTime`을 통해 inactive한 데이터를 캐싱된 데이터로서 유지하는 시간을 설정할 수 있고,
부가적인 옵션을 설정하여 메모리에 캐싱된 데이터를 우아하게 관리합니다.

```js
const { data } = useQuery('users', getUsers, {
  staleTime: 5000,
  cacheTime: 1000 * 60 * 5,
})
```

## Reference

[전역 상태 관리에 대한 단상 (stale-while-revalidate)](https://jbee.io/react/thinking-about-global-state/)

[stale-while-revalidate로 최신 상태 유지](https://web.dev/i18n/ko/stale-while-revalidate/)
