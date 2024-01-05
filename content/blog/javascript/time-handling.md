---
title: 자바스크립트와 시간에 대한 이런저런 이야기
date: 2023-12-23 19:12:36
category: javascript
thumbnail: { thumbnailSrc }
description: 9시간을 빼라구요? 아니아니 더하라구요?
draft: true
---

개인적으로 기술적이라기보단 궁금해서 찾아본 시간에 대한 이야기.

## 기준시와 타임존

타임존 (TimeZone)은 로컬 시간이 동일한 지역을 일컫는 말이다. 국가별로 타임존을 가지고 있고, 면적이 넓은 국가의 경우 지역별로 여러 타임존을 가지고 있는 경우도 있다.
그나저나 타임존도 기준이 필요하다. 지구의 자전에 의해 지역별로 낮과 밤이 생겨나는데, 거리가 먼 지역 간 시간에 대한 이야기를 나눌 수 있도록 기준이 되는 0시가
있어야 시간차를 통해 각각의 타임존을 결정할 수 있다.

이를 위해 본초 자오선 (Prime Meridian)을 결정해야 했다. 지구 표면상 북극점과 남극점의 최단 거리로 이었을 때 그려지는 세로 선을 자오선이라 하는데,
모든 자오선에서 경도 0도, 즉 모든 자오선들의 경도를 결정하는 기준이 되는 자오선을 말한다.

18세기 영국, 프랑스, 독일, 덴마크 등 각국에서는 자국의 수도를 지나는 자오선을 모든 자오선들의 기준으로 정해 사용해 오다가, 1884년 워싱턴 D.C에서 열린 국제
자오선 회의에서 영국 그리니치 천문대를 지나는 자오선이 본초 자오선으로 채택되었다.

![그리니치 천문대의 본초 자오선](images/time-handling/royal-greenwich-observatory.png)

[이미지 출처](https://m.post.naver.com/viewer/postView.naver?volumeNo=32031087&memberNo=39920442)

이를 토대로 세계의 0시가 결정되었고 이를 **그리니치 평균시 (Greenwich Mean Time, GMT)**로 칭하고, 지구의 자전으로 인해 지역 사이에 생기는 낮과 밤의
차이를 인위적으로 조정하기 위해 고안된 시간의 구분선인 타임존의 기준시가 된다.

그러다 지구 자전이 조금씩 늦어지는 영향으로 인해 시간의 미세한 차이가 발생하기 시작했고, 보다 정확한 시간 기준을 위해 1972년부터 전 세계 50개 국가 실험실에서
보유한 400개 이상의 세슘 시계를 기반으로 하는 **협정 세계시 (Coordinated Universal Time, UTC)**가 국제 협정시로 사용되기 시작했다.
GMT과 UTC는 소숫점 단위의 미세한 시간차밖에 없어 혼용되곤 하지만, 소프트웨어상에서는 UTC를 사용한다는 표현이 적절하다고 한다.

시간의 표준이 되는 표준시로부터 각각의 타임존의 시간차는 오프셋 (Offset)으로 표현한다. 가령 한국 표준 시간(Korea Standard Time, KST)의 경우 UTC+09:00로
표기되는데, 이는 표준시보다 9시간이 빠르다는 의미이다. UTC 기준 오전 12시라면 한국은 오전 9시가 된다.

전세계 타임존은 다음과 같이 영국의 런던에 위치하는 그리니치 천문대를 중심으로 그려낼 수 있다.

![세계 타임존](./images/time-handling/world-time-zones-map.png)

[이미지 출처](https://ko.wikipedia.org/wiki/%EC%8B%9C%EA%B0%84%EB%8C%80)

## 오프셋의 변동

기준시와의 시간차를 통해 각 지역의 타임존과 해당 타임존의 오프셋을 지정했지만, 오프셋이 영구적으로 고정되는 것은 아니다. 타임존은 각국에서 법적으로 결정하고 있는데,
이는 국가의 정치적 혹은 경제적인 이유로 변할 수 있다. 여러 이유 중에서 타임존의 오프셋이 변하는 가장 일반적인 원인은 일광 시간 절약제 (Daylight Saving Time, DST)의
시행과 해제이다.

흔히 서머 타임 (Summer Time)이라 불리는 DST는 표준시를 원래 시간보다 한 시간 앞당긴 시간을 사용하는 것을 말한다. 가령 0시에 DST를 시행된다면, 시행된 시간이
1시로 조정되는 것이다. 미국 주식 시장이 3월부터 11월까지 오후 10시 30분에 개장하는 것도 해당 기간에 DST가 시행된 사례이다.
여름에는 일조 시간이 길어 활동을 보다 일찍 시작하여 외부 활동에 더 밝은 상태의 시간을 활용하여 경제적인 이점을 얻고자 제안된 정책이다.

한국에서도 88 서울 올림픽 중계를 위해 30분을 앞당긴 서머 타임을 적용한 전례가 있는데, 생활 리듬을 깨고 혼란스럽다는 비난 여론으로 인해 올림픽이 끝난 이후로는
시행되지 않았다.

![88올림픽 일광 시간 절약제에 대한 인터뷰](./images/time-handling/88-dst.png)

[이미지 출처](https://www.youtube.com/watch?v=8jOQGVmTNw4)

이처럼, 영구적일 것만 같던 타임존의 오프셋은 여러 이유로 변경될 수 있기 때문에 이를 시스템화 하려면 현재 표준시와 DST 시행 내역, 그리고
역사적인 변경 내역 또한 기록되고 공유되어야 한다.

오늘 날 소프트웨어상에서 해당 정보들을 다루고 관리하기 위해 데이터베이스 기반으로 시스템화 되어 있는데, 그 중 [IANA 타임존 데이터베이스](https://www.iana.org/time-zones)가
리눅스, 유닉스, 자바 등에서 내부적으로 사용하고 있는 데이터베이스로, 타임존에 대한 기록 중 가장 신뢰받고 있다. 유닉스 (UNIX) 시간 이후의 데이터를 정확하게
보장되는 타임존 정보를 대륙 혹은 대양명과 (국가명이 아닌) 도시명으로 조합한 규칙으로 명명하여 관리한다. 예로 서울의 타임존은 Asia/Seoul이다.

## 시간의 표현

시간의 기준이 생겼고, 타임존을 구분지었다. 더불어 이를 데이터베이스로 관리하여 소프트웨어상에서 관리할 수 있게 되었다. 그렇다면 API 상에서 시간 데이터는 어떻게 표현하여
주고 받을 수 있을까. 가령 각각의 타임존을 가지는 클라이언트들에서 서버로 시간을 전달하거나, 시간 데이터 생성자의 클라이언트 타임존이 변경되면 이에 따라 사용자에게 보여지는 시간 또한
타임존의 오프셋에 맞게 조작되어 보여져야 한다.

결론적으로 타임존에 의존하여 서버로 전달하는 시간의 표현을 담은 데이터는 사용자 타임존의 오프셋을 담고 있거나, 타임존 정보까지 포함되어 있어야 한다.
일반적으로 이러한 시간의 표현은 UTC를 기준으로 하는 유닉스 시간이나 오프셋 정보가 포함된 ISO-8601와 같은 표준 포맷에 맞춰 교환한다.

### 유닉스 시간

1970년 1월 1일 00:00:00 UTC를 기준으로 경과한 시간을 초로 환산하여 정수로 나타내 시간을 표현한다. 자바스크립트 `Date` 객체의 `getTime()` 메서드를 통해
구해낼 수 있다.

```js
const current = new Date();
console.log(current.getTime()); // 1704210993948
```

여담으로, 유닉스 시간은 [2038년 문제](https://ko.wikipedia.org/wiki/2038%EB%85%84_%EB%AC%B8%EC%A0%9C)라고 불리는 문제와 점점 가까워지고 있다.
32비트 시스템에서 초 시간을 저장하기 위해 32비트 정수형 자료 형식을 사용하는데, 이 형식이 표현할 수 있는 최후의 시각은 2038년 1월 19일 화요일 03:14:07 UTC 이다.
1970년 1월 1일 자정을 기준으로 2147483647초가 흐른 시각인데, 이 시각 이후의 시각은 범위를 초과하여 내부적으로 음수로 표현되어 문제를 야기한다.

부호 없는 32비트나 64비트, 혹은 태양의 수명보다 훨씬 긴 시간을 표현할 수 있는 128비트로 대체하면 해결된다곤 하지만 아직 이 문제의 간단한 해결책은 아직 없다고 한다.

### ISO-8601

[ISO-8601](https://ko.wikipedia.org/wiki/ISO_8601)은 날짜와 시간과 관련된 데이터 교환을 다루는 국제 표준으로 1988년에 처음으로 공개되었다.
시간 작성에 있어 다른 관례를 가진 나라들간의 데이터가 오갈때 발생하는 잡음을 없애고자 만들어진 표준으로 시간 단위의 가장 큰 것부터 작은 것으로 정렬하여 표기한다.
소프트웨어상에서 자주 접하는 표준 표기는 다음과 같다.

| 조합             | 표기                                            |
| ---------------- | ----------------------------------------------- |
| 날짜             | 2023-01-02                                      |
| UTC 날짜 및 시간 | 2023-01-02T17:13:40+00:00, 2023-01-02T17:13:40Z |

위처럼 UTC 시간인 경우, 시간 뒤에 빈칸없이 Z를 추가해주어야 한다. 여기서 Z는 오프셋이 0인 UTC를 위한 지역 지정자로 "+00:00"를 표현한다.
만약 타임존의 시간이 UTC보다 한 시간 앞선다면, "+01:00"을 빈칸없이 표기해야 한다.

## 자바스크립트와 타임존

자바스크립트에서는 일반적으로 클라이언트가 동작하는 OS의 설정된 타임존을 따르게 되어 있고, 명시적으로 타임존을 변경할 수 없다. 타임존 데이터베이스에 대한 명세
또한 명확하게 기술되어 있지 않다. 이로 인해 자바스크립트에서 날짜와 시간을 처리하기 위한 네이티브 객체인 `Date`를 통한 연산들이 브라우저마다 다르게 동작하는 경우도 발생한다.

더불어 자바스크립트에서 날짜와 시간을 처리하기 위해 설계된 네이티브 객체인 `Date`는 제공하는 기능이 복잡한 연산을 하기엔 아쉬운 부분들이 많아 자연스럽게 [moment.js](https://momentjs.com/)를 찾게 된다.

그도 그럴것이 자바스크립트의 창시자인 [Brendan Eich](https://ko.wikipedia.org/wiki/%EB%B8%8C%EB%A0%8C%EB%8D%98_%EC%95%84%EC%9D%B4%ED%81%AC)에게
자바스크립트 언어를 작성하고 이를 Netscape에 적용하는 데 단 10일밖에 주어지지 않아 프로그래밍 언어의 필수적인 요소라고 할 수 있는 날짜 처리와 관련된 구현체를
구조적으로 설계하기엔 일정이 짧았다고 한다. 해서 그 당시 많은 인기를 얻고 있었던 'Java처럼 만들라.'는 요구에 `java.Util.Date`를 모방하여 자바스크립트에 구현체를 완성했다고 한다.

그러나 모방에 대상이었던 `java.Util.Date`의 메서드들은 1997년 Java 1.1 릴리즈에서 더 이상 사용되지 않고 대체되었지만, 자바스크립트에서는 여전히 모방된 Date API를 사용하고 있다.
조금 더 깊게 문제를 살펴보기 위해 위에서 잠깐 언급한 `moment.js`의 메인테이너 중 한명이자 TC39에서 [Temporal](https://tc39.es/proposal-temporal/docs/)을
제안한 [Maggie Pint](https://twitter.com/maggiepint)가 개인 블로그에 나열한 `Date` 객체의 문제점들을 살펴보자.

1. No support for time zones other than the user’s local time and UTC
2. Parser behavior so unreliable it is unusable
3. Date object is mutable
4. DST behavior is unpredictable
5. Computation APIs are unwieldy
6. No support for non-Gregorian calendars

물론 타임존 지원 부족에 대한 문제는 새로운 기능을 추가하여 완화할 수 있고, 그레고리력 (Gregorian calendar, 양력)만 지원하는 문제 또한 개선할 수 있다.

```js
// Mitigate support for time zone
var zonedDate = Date.inZone(zoneIdentifier, dateString);

// support non-Gregorian calendars
var calendarDate = Date.withCalendar('Hijri', dateString);
```

더불어 `Date`의 API를 추가하여 날짜 계산을 더 쉽게 만들 수도 있다.

```js
var myDate = new Date();
myDate.setDate(myDate.getDate() + 7);
myDate.addDays(7);
```

예측할 수 없는 DST 동작에 대한 완화 또한 TC39 [#778](https://github.com/tc39/ecma262/pull/778)에 의해 언급되고 병합되었다.

하지만 현재 `Date`를 개선한다고 해서 해결할 수 없는 문제가 있다. 이는 자바스크립트를 지속적으로 개선하기 위한 TC39 구성원들이 지속적으로 염두에 두고 지켜야 하는
두 가지 성질 때문이다.

> Web Compatibility – No change made to ECMAScript can be incompatible with the existing behavior of ECMAScript

> Web Reality – If code currently behaves a certain way, future versions of the spec should continue to have it behave that way – even if the behavior present is not described in the spec.

이는 자바스크립트에서 현실적으로 기존 동작과 호환성을 유지하도록 하여 현재 동작하고 있는 웹에 문제가 생기지 않도록 하는 것을 목적으로 두고 있는데, 위에서 언급한
문제들 중 현재 웹을 손상시키지 않고는 고칠 수 없는 문제들이 존재한다. Maggie Pint가 Temporal이라는 새로운 API를 제안한 이유일 것이다.

### 가변성

![모질라 문서 Date 챕터의 Temporal API에 대한 언급](./images/time-handling/temporal-api-note.png)

최근 TC39에서 새롭게 제안된 [Temporal API](https://tc39.es/proposal-temporal/docs/)는
