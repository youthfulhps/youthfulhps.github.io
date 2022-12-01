---
title: 나는 제네레이터를 알고 사용하는 걸까?
date: 2021-11-21 22:05:01
category: javascript
thumbnail: ./images/do-i-know-javascript-generator/intro.png
draft: false
description: 자바스크립트의 제네레이터 문법을 되새겨봅니다.
---

리덕스 사가는 ES6에 새롭게 도입된 제네레이터 (Generator) 문법을 사용하여 유용하게 비동기 처리를 할 수 있게 해줍니다.
현재 운영 중인 프러덕션 또한, 리덕스에서 사이드 이펙트가 존재할 만한 비동기적인 비지니스 로직을 관리하기 위해 리덕스 사가 미들웨어를 사용하고 있는데요.

늘 사용하고 있는 문법이고 동작 또한 해석이 되니 작업에 문제는 없지만, 제네레이터에 대한 이론적인 이해 정도를 스스로 질문했을 때
한창 공부했을 때의 이론적 대답이 쉽게 나오지 않는 걸 느끼고 다시 한번 정리를 해볼 까 합니다.

![thumbnail](./images/do-i-know-javscript-generator/thumbnail.png)

참고로, 이 글은 [이터레이션](https://poiemaweb.com/es6-iteration-for-of), [제네레이터](https://poiemaweb.com/es6-generator)의 전개와 예시가 유사합니다.
저는 바이블처럼 여기는 [PoiemaWeb](https://poiemaweb.com/) 글을 참고하여 공부하며 정리하기를 좋아합니다.

## 제네레이터, 왜 등장했을 까?

제네레이터는 ES6에서 도입된 새로운 함수입니다. 그 역할은 이터러블을 간편하게 구현할 수 있도록 고안된 함수라고 설명합니다.

그렇다면, 제네레이터를 사용하지 않고 어떻게 이터러블을 구현하는 지 알아보면, 제네레이터의 등장이 더 와닿을 수 있을 것 같은데요.

여기서 먼저 짚고 넘어가고 싶은 것은, 제네레이터를 이야기 할때면 꼭 등장하지만 늘 혼동되는 이터레이션 (iteration), 이터러블 (iterable), 이터레이터 (iterator)를 먼저 알아보고, 제네레이터를 사용하지 않고 어떻게 이터러블을 구현하는 지 알아봅시다.

## 이터레이션 프로토콜, 데이터 순회 이렇게 약속하자

ES6에서 도입된 이터레이션 프로토콜 (Iteration Protocol)은 데이터 컬렉션을 순회하기 위한 프로토콜입니다.
여기서, 이터레이션 프로토콜에는 이터러블 프로토콜 그리고, 이터레이터 프로토콜이 있습니다. 용어가 벌써 혼동되기 시작하는데,
심호흡 한번 하고 넘어가보죠.

## 이터러블, 순회할 수 있는 데이터 공급자

이터러블 프로토콜 (Iterable Protocol)을 준수한 객체를 이터러블이라고 합니다.
구현되었거나, 프로토타입 체인에 의한 상속을 통해 `Symbol.iterator` 메서드를 가지고 있는 객체를 말합니다.

이터러블은 `for...of` 문에서 순회할 수 있고, `Spread` 문법의 대상이 될 수 있습니다. 번뜩 생각나는 대표적인 객체는 배열입니다.
`for...of`, `Spread` 의 대상으로 배열을 사용할 수 있었던 근거가 여기 있었군요.

```js
const numbers = [1, 2, 3, 4, 5];

console.log(Symbol.iterator in numbers); // true

for (let number of numbers) {
  console.log(number);
}
```

반면, 일반 객체는 `Symbol.iterator` 메서드를 가지고 있지 않기 때문에 이터러블이 아닙니다. 
프로토타입 체인으로부터 `Symbol.iterator`를상속받지 못했기 때문인데요. 하지만, 구현해준다면 이터러블 프로토콜을 준수한 이터러블이 될 수 있습니다.

```js
const object = { a: 1, b: 2, c: 3 };

console.log(Symbol.iterator in object); // false

for (const property of object) {
  // TypeError: object is not iterable
  console.log(property);
}
```

## 이터레이터, 순회 데이터 공급자의 다음 엘리먼트에는 이렇게 접근하자

이터레이터 프로토콜 (iterator protocol)을 준수하는 객체를 이터레이터라고 합니다.
next 메서드를 소유하며, 호출 시 이터러블을 순회하며 `value`,` done` 프로퍼티를 갖는 이터레이터 result 객체를 반환하는 객체를 말합니다.

이터러블은 `Symbol.iterator` 메서드를 가지고 있다고 언급했는데요. 이 메서드를 호출하면 이터레이터를 반환합니다.
물론, 이터레이터 프로토콜을 준수한다면 next 메서드를 가지고 있습니다.

```js
const arr = [1, 2, 3, 4, 5];

const iterator = arr[Symbol.iterator]();

console.log("next" in iterator); // true

let resultObject = iterator.next();
console.log(resultObject); // {value: 1, done: false}
```

순회 데이터 컬렉션 엘리먼트들을 순회하기 위한 포인터 역할을 담당하는 메서드가 바로 `next` 입니다.
`next` 메서드를 호출하면 이터러블을 순차적으로 순회합니다.

```js
console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.next()); // {value: 2, done: false}
...
console.log(iterator.next()); // {value: 5, done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

## 이터레이션 프로토콜, 다양한 데이터 공급자의 약속된 순회 방식을 제공하자

이터레이션 프로토콜에 속하는 이터러블 프로토콜과 이터러블 그리고, 이터레이터 프로토콜과 이터레이터를 간단하게 알아봤는데요.
이터레이션 프로토콜이 왜 필요할까요?

`Array`, `String`, `Map`, `Set` 등 다양한 데이터 공급자들이 각각의 순회 방식을 갖고 있다면, 다양한 순회 방식을 지원하는
데이터 소비자가 필요합니다. 가령, `Array`는 `for...of`로 순회할 수 있지만, `String` 은 `String` 만의 데이터 소비자가 필요하게 되는 것이죠.

결국, 이터레이션 프로토콜이 하고자 하는 목적은 다양한 데이터 공급자인 소스들이 동일한 약속된 순회 방식을 갖도록 하여
데이터 소비자에게 일정한 인터페이스를 제공하자는 것이 목적입니다.

## 제네레이터를 사용하지 않고, 이터러블을 생성해보자

제네레이터와 관련된 프로토콜에 대한 용어 정의를 간단하게 했으니, 이제 다시 본론으로 돌아와 제네레이터를 사용하지 않고
이터레이션 프로토콜을 준수하는 이터러블을 구현해보겠습니다.

이터레이션 프로토콜인 이터러블 프로토콜을 준수하기 위해 `Symbol.iterator` 메서드를 구현하여 이터레이터를 반환해주었고,
`next` 메서드를 구현하여 이터레이터 프로토콜을 준수해 주었습니다.

```js
const arithmeticSequence = (function () {
  let cur = 0;

  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      cur += 1;
      return { value: cur, done: cur === 5 };
    },
  };
})();

for (let cur of arithmeticSequence) {
  console.log(cur); // 1, 2, 3, 4
}
```

## 제네레이터를 사용해서 이터러블을 생성해보자

위와 동일한 데이터 컬렉션을 가지는 이터러블을 제네레이터를 통해 구현해보겠습니다.
상단의 구현방법보다 훨씬 간편하게 이터러블을 생성할 수 있습니다.

```js
const arithmeticSequence = (function* () {
  let cur = 0;

  while (cur < 4) {
    cur += 1;
    yield cur;
  }
})(); //prettier issue  => }());

for (let cur of arithmeticSequence) {
  console.log(cur); // 1, 2, 3, 4
}
```

## 제네레이터, 동작 방식과 정의

제네레이터는 일반 함수와 다르게 함수의 코드 블록을 한 번에 실행하지 않고, 함수 코드 블록 실행을 잠시 멈추었다가
필요한 시점에 재시작할 수 있습니다.

일반 함수를 호출하면 return 문에서 반환하는 값을 반환받게 되는데, 제네레이터 함수를 호출하면 제네레이터를 반환받습니다.

이 제네레이터는 이터러블이면서, 이터레이터인 객체입니다. 즉, 프로토콜을 입각해 생각해보면 `Symbol.iterator` 메서드를
소유함과 동시에 `next` 메서드를 소유하는 객체를 가지고 있는 이터레이터입니다.

```js
function* counter () {
  for (const count of [1,2,3,4,5]) yield count;
}

let generator = counter();

console.log(Symbol.iterator in generator);  // true

for (const count of generator) {
  console.log(count);
}

generator = counter();

console.log('next' in generator);  // true

console.log(generator.next()); // {value: 1, done: false}
console.log(generator.next()); // {value: 2, done: false}
...
console.log(generator.next()); // {value: 5, done: false};
console.log(generator.next()); // {value: undefined, done: true}
```

## 제네레이터, 비동기 처리에 사용해보자

제네레이터를 사용하면 비동기 처리를 동기처럼 동작하도록 구현할 수 있습니다. 가령, 사이드 이펙트가 존재하는 API 함수에서
데이터를 성공적으로 전달받았을 때 혹은 실패하였는 지 결과를 기다린 후에 next 메서드를 통해 연개된 동작을 재시작할 수 있습니다.

ES7에서 도입된 `async, await` 를 통해 제네레이터보다 직관적으로 비동기 처리를 동기적으로 처리할 수 있게 됐지만, 참고할 만한 동작입니다.

```js
function getUser(generator, username) {
  fetch(`https://api.github.com/users/${username}`)
    .then((res) => res.json())
    .then((user) => generator.next({ userName: user.name, error: false }))
    .catch((error) => generator.next({ userName: "unknown", error: true }));
}

const generator = (function* () {
  let user;
  user = yield getUser(generator, "youthfulhps");
  if (user.error) {
    //...handle error
    return;
  }

  console.log(user.userName);
})();

generator.next();
```

## 마치면서

실무에서 당연하게 사용하고 있었던 리덕스 사가의 제네레이터에 대한 개념을 다시 한번 정리해서 흝어져있던
퍼즐이 다시 맞춰지는 것 같아 기분이 좋습니다. 실무에서 경험한 것들을 정리하는 위주로 블로그를 활용했었는데
종종 공부하는 글도 적는 습관을 들여야 할 것 같습니다 :)

## Reference

- [https://poiemaweb.com/es6-iteration-for-of](https://poiemaweb.com/es6-iteration-for-of)
- [https://poiemaweb.com/es6-generator](https://poiemaweb.com/es6-generator)




