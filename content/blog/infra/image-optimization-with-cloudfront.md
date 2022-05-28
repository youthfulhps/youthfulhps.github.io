---
title: 사용자 경험 품질 향상을 위한 이미지 최적화 (feat. Lambda@Edge)
date: 2022-01-21 14:05:04
category: infra
description: test
thumbnail: ../../../public/banner.png
draft: true
---

많은 이미지를 다루는 페이지의 경우, 이미지 최적화에 신경쓰지 않으면 사용자 경험 지표에서 많은 감점을 받기 쉽습니다.
사용자 경험 지표를 측정해보면, 이미지 관련된 감점 요소들이 정말 많은데요.

- **Properly size images**
- **Serve images in next-gen formats**
- **Defer offscreen images**
- **Image elements do not have explicit width and height**
- ...

어떻게 하면 유저 경험 측면에서 사랑받을 수 있는 이미지를 랜더링할 수 있을 지에 대해 고민하고 작업한 내용들을 기록해볼 까 합니다.

## 이미지 요소의 속성을 이해하자

`<img />`는 필수 속성인 `src`를 포함하여 옵션으로 설정하는 속성들 또한 중요한 역할을 맡고 있습니다.

**`alt`** 속성은 대체 텍스트로서, 이슈로 인해 이미지 랜더링이 어려울 때 이미리를 대신하여 대체 텍스트를 랜더링하는 역할 외에도,
이미지 묘사의 목적으로 사용되는 텍스트로서 스크린 리더에게 전달되어 이미지 대신 낭독되어 접근성을 높일 수 있습니다.

또한, 검색 엔진이 사이트를 크롤링하고 색인을 생성할 때 이미지 해석을 위한 용도로 사용됩니다.

```html
<img src="/images/NYCpark.png" alt="Aerial view of Central Park in New York" />
```

**`width, height`** 는 이미지의 치수를 나타내는 속성이지만, 리플로우(reflow)를 방지할 수 있도록
브라우저에게 이미지의 치수를 전달하여 이미지가 로드되는 동안 적절한 공간을 할당할 수 있도록 도와줍니다.

만약 뷰포트 기반 반응형 스타일을 위해 CSS를 통해 치수를 정의했다면, `aspect-ratio` 스타일 속성을
추가하여 레이아웃 시프트를 방지하여 [Cumulative Layout Shift](https://web.dev/i18n/ko/cls/) 의 감점 요소를 제거할 수 있습니다.

```html
<img src="/images/NYCpark.png" width="640" height="360" alt="Aerial view ..." />
```

**`srcset`** 은 동일한 비율의 다양한 사이즈를 가지는 이미지 소스의 세트입니다. 단일 사이즈라면 `src`를 사용하고,
다양한 이미지 소스를 가지고 있을 때 사용합니다.

이미지 소스와 그에 따른 원본 사이즈를 명시해주면, 이미지 소스의 선택권을 브라우저에게 위임할 수 있으며
브라우저 스스로 현재 뷰포트에 최적화된 이미지를 선택할 수 있도록 합니다.

```html
<img
  srcset="
    images/NYCpark_small.png   400w,
    images/NYCpark_medium.png  700w,
    images/NYCpark_large.png  1000w
  "
/>
```

**`sizes`** 는 미디어조건(선택적)과 그에 따라 최적화되어 출력될 이미지 크기를 지정합니다. 이 또한
브라우저에게 이미지 크기 선택을 위임할 수 있습니다.

```html
<img
  sizes="
    (max-width: 500px) 444px, 
    (max-width: 800px) 777px, 
    1222px
  "
/>
```

## webp 이미지 포맷을 사용하자

`webp`는 이미지 압축 효과를 강점으로 이미지로 인해 발생하는 웹 사이트의 트래픽을 감소시키고,
로딩 시간을 단축하는 데 중점을 두고 있습니다. `JPEG` 와 유사한 손실 압축 포맷이지만,
화질 저하를 최소화하면서 파일 크기를 `JPEG` 대비 10~80% 정도까지 압축이 가능한 포맷입니다.

만약 정적 이미지 파일에 대한 접근이 문제가 없다면, 단순히 이미지 포맷을 변경해도 좋고
`next` 와 함께 사용할 수 있는 [next-optimized-images](https://github.com/cyrilwanner/next-optimized-images)와 같은 라이브러리를 사용해서 이미지의 확장자를 `webp` 로 쉽게 변환할 수 있습니다.

```shell
~$ yarn add next-optimized-images webp-loader
```

```js
// next.config.js

const withOptimizedImages = require('next-optimized-images')

module.exports = withOptimizedImages({...})
```

```jsx
<picture style={{ objectFit: 'cover' }}>
  <source srcSet={require('../public/NYCpark.png?webp')} type="image/webp" />
  <img src="/NYCpark.png" />
</picture>
```

## 적절한 이미지 사이즈를 사용하자

적절한 이미지 사이즈를 사용해야 하는 이유는 상당히 직관적입니다. 데스크탑에서 사용되는 이미지를 모바일에서
제공하면 2~4배의 데이터를 소비하게 되니, 다양한 장치를 위한 다양한 사이즈의 이미지를 제공해야 한다는 것인데요.

이에 대한 지표로서, `Lighthouse` 에서는 랜더링된 이미지보다 실제 이미지 사이즈가 크기 않은 것을 이상적인 케이스로
삼고 이에 대한 점수를 부여합니다.

적절한 이미지 사이즈를 사용하기 위해서는 결국 다양한 사이즈의 물리적인 이미지를 제공하는 것이 해결책이며,
노드 환경에서 사용할 수 있는 [sharp.js](https://web.dev/serve-responsive-images/)를 통해
리사이징된 이미지를 만들어 위에서 언급한 `srcset` 속성을 통해 제공해주어야 합니다.

```html
<!-- before -->
<img src="NYCpark-large.jpg" />

<!-- after -->
<img
  src="NYCpark-large.jpg"
  srcset="NYCpark-small.jpg 480w, NYCpark-large.jpg 1080w"
  sizes="50vw"
/>
```

## 온디멘드 이미지 리사이징 (feat. Lambda@Edge)

위에서 이미지를 최적화할 수 있는 코드레벨적으로, 물리적으로의 최적화할 수 있는 방안들을 정리해보았는데요.
하지만, 실무에서 경험상 `webp` 포맷과 다양한 사이즈의 이미지를 제공하지 않거나, 못하겠다 생각한 경우가 많았습니다.

가령, 유저 혹은 컨텐츠 제공자가 직접 이미지를 업로드하는 경우 확장자를 제한하거나 변환 과정을 거쳐야 하며,
회사 규모에 따라 S3와 같은 클라우드에 업로드 되어 있는 객체에 대해 마음껏 접근하기가 어려운 경우가 많고,
만약 가능하다고 해도 확장자와 이미지 사이즈를 메뉴얼하게 변경한다는 것은 하루 아침에 해결될 문제가 아닙니다.

## TL;DR

1. S3 버킷 생성, 샘플 이미지 업로드
2. CloudFront로 S3버킷 가리키기
3. 람다 함수에 부여할 IAM 역할 생성
4. 온디멘드 이미지, WebP 파일 형식 변환을 위한 Lambda 함수 생성 (w/ sharp.js)
5. Lambda@edge 트리거로 CloudFront Origin response 설정

## S3 버킷 생성, 샘플 이미지 업로드

버킷 생성 단계는 별 다른 주의사항 없이 **모든 퍼블릭 액세스 차단이 비활성화**된 S3 버킷을 생성하고,
생성한 버킷에 샘플 이미지를 업로드한다.

![s3-bucket](./images/image-optimization-with-cloudfront/s3-bucket.png)

## CloudFront로 S3버킷 가리키기

CloudFront 배포를 생성한다. CloudFront에서 쿼리 문자열 파라미터 기반의 콘텐츠 캐싱이 가능하도록
**캐시 키 및 원본 요청**에서 Legacy cache settings 선택, 콘텐츠 캐싱에 사용할 **쿼리 문자열을 설정**한다.

![cloudFront](./images/image-optimization-with-cloudfront/cloudFront.png)

## 람다 함수에 부여할 IAM 역할 생성

람다 함수에 권한을 부여해야 한다. **IAM 콘솔에서 역할을 생성**한다. AWS 서비스 / Lambda를 선택하고 다음 단계로 넘어간다.

![create-iam](./images/image-optimization-with-cloudfront/create-iam.png)

다음 단계에서, **정책 생성**을 클릭하고, JSON 편집을 통해 아래와 같은 정책을 부여한다.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "iam:CreateServiceLinkedRole",
        "lambda:GetFunction",
        "lambda:EnableReplication",
        "cloudfront:UpdateDistribution",
        "s3:GetObject",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
      ],
      "Resource": "*"
    }
  ]
}
```

정책 이름을 설정하고, 정책 생성을 완료한다. 완료 후 다시 IAM 역할 생성으로로 돌아가, **생성한 정책을 연결**한다.

![connect-policy](./images/image-optimization-with-cloudfront/connect-policy.png)

역할에 신뢰관계를 추가한다. **역할 / 신뢰 관계/ 신뢰 관계 편집**을 선택하고, JSON을 편집한다.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": ["edgelambda.amazonaws.com", "lambda.amazonaws.com"]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

## 온디멘드 이미지, WebP 파일 형식 변환을 위한 Lambda 함수 생성 (w/ sharp.js)

람다 함수를 생성할 때, 람다 트리거를 CloudFront로 설정하기 위해 지역은 **버지니아 북부**로 설정하여 생성한다.

![create-lambda](./images/image-optimization-with-cloudfront/create-lambda.png)

권한 설정에서 기존에 생성한 역할을 설정한다.

![set-policy](./images/image-optimization-with-cloudfront/set-policy.png)

이후 생성된 람다에 코드 업로드한다. 코드는 [AWS Lambda@Edge에서 실시간 이미지 리사이즈 & WebP 형식으로 변환](https://medium.com/daangn/lambda-edge%EB%A1%9C-%EA%B5%AC%ED%98%84%ED%95%98%EB%8A%94-on-the-fly-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%A6%AC%EC%82%AC%EC%9D%B4%EC%A7%95-f4e5052d49f3)
를 참고하여 구현하고 zip파일로 압축 후 업로드한다.

![upload-code](./images/image-optimization-with-cloudfront/upload-code.png)

람다 함수 상단 메뉴 작업 / Lambda@edge 배포를 선택한다. 오리진 응답으로 설정하는 이유는
클라이언트에서 들어온 요청이 CloudFront로 전달되고, 이 때 요청된 쿼리에 대한 콘텐츠가 캐싱되어 있지 않으면,
S3로 Origin Request가 전달되고, S3에서 응답받은 이미지를 통해 전처리가 필요하기 때문에 Origin response로 설정한다.

![distribution-lambda](./images/image-optimization-with-cloudfront/distribution-lambda.png)

## 테스트 클라이언트 구성

[image-ondemand-resizing](https://github.com/youthfulhps/image-ondemand-resizing)

## Reference

https://velog.io/@hustle-dev/웹-성능을-위한-이미지-최적화
https://heropy.blog/2019/06/16/html-img-srcset-and-sizes/
https://ko.wikipedia.org/wiki/WebP
https://web.dev/uses-responsive-images/
https://web.dev/serve-responsive-images/
