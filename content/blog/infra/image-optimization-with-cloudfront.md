---
title: 온디멘드 이미지 리사이징을 위한 인프라 구성
date: 2022-05-31 14:05:04
category: infra
thumbnail: ../../../public/banner.png
draft: true
---

[사용자 경험 품질 향상을 위한 이미지 최적화](https://youthfulhps.dev/web/image-optimization/)에서 온디멘드 이미지 리사이징 
에 대한 이야기를 공유해드렸습니다. 이번 글에서는 CloudFront에서 `lambda@edge` 를 통해 직접 구현해본 과정을 정리해보려 합니다.
## TL;DR

1. S3 버킷을 생성하고 이미지를 업로드합니다.
2. CloudFront를 통해 S3 컨텐츠를 배포합니다.
3. 라시아징, webp 파일 형식 변환을 위한 노드 환경 람다 함수를 구현합니다.
4. 버킷 접근 권한 및 역할을 담은 IAM을 정의하고 람다 함수에 부여합니다.
5. CloudFront의 오리진 응답 엣지에 람다 함수를 연동합니다.

## S3, 샘플 이미지 업로드

일반적으로 사용되는 S3 버킷을 생성하는 과정과 동일합니다. `모든 퍼블릭 엑세스 차단이 비활성화` 가 선택된
버킷을 생성하고 샘플 이미지 객체를 업로드해주세요.

![create s3 bucket](./images/image-optimization-with-cloudfront/s3-bucket.png)

## CloudFront, S3 컨텐츠 배포

CloudFront 배포를 생성합니다. 기본적으로 CloudFront는 쿼리 문자열을 무시하게 되는데,
쿼리 문자열 파라미터 기반의 컨텐츠 캐싱이 가능하도록 `캐시 키 및 원본 요청`
에서 `Lagacy cache settings` 를 선택하여 컨텐츠 캐싱에 사용할 `쿼리 문자열을 설정` 해줍니다.

쿼리 문자열은 이미지 변환에 대한 설정을 전달하기 위한 역할로서
`너비, 높이, 이미지 핏, webp 변환` 에 대한 설정값을 담을 수 있습니다.

또한, `쿼리 문자열 파라미터 기반의 컨텐츠 캐싱` 이라는 특징에 따라, 동일한 쿼리 조합의 요청에 대한
리사이징된 컨텐츠가 CloudFront에 캐싱되어 있다면, S3까지 오리진 요청이 전달되지 않고,
CloudFront에서 뷰어 응답으로 빠르게 컨텐츠를 전달합니다.

```
https://...cloudfront/sample-image.jpg?w=500&h=300
```

![cloudFront](./images/image-optimization-with-cloudfront/cloudFront.png)

## 람다 함수에 부여할 IAM 역할 생성

람다 함수에 권한을 부여해야 합니다. 

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

람다 함수를 생성합니다. 이때, 람다 트리거를 CloudFront로 설정할 수 있는 지역은 
`버지니아 북부` 만 가능하기 때문에 지역을 변경하고 람다 함수를 생성해주세요.

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
