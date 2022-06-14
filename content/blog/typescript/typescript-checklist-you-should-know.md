---
title: typescript-checklist-you-should-know
date: 2022-06-14 10:06:39
category: typescript
thumbnail: { thumbnailSrc }
draft: true
---

단순히 자바스크립트에 타입을 명시한다고 해서 타입스크립트 개발자라고
치환되면 안된다 라고 생각합니다.

## 1. 코드 생성과 타입 체크는 독립적이다

타입스크립트 컴파일러는 크게 두 가지 역할을 합니다. 최신 자바스크립트
/ 타입스크립트를 브라우저에서 동작할 수 있도록 구 버전의 자바스크립트로
트랜스파일하고, 코드의 타입 오류를 체크하는 역할을 합니다.

여기서, **타입스크립트 컴파일러의 두 가지 역할은 서로 완벽히 독립적입니다.**
타입스크립트가 자바스크립트로 변환될 때 타입에는 영향을 주지 않으며
반대로, 타입은 자바스크립트 런타임에 영향을 미치지 않습니다.

아래의 코드는 타입 체커에게 다음과 같은 지적을 받지만,
자바스크립트 코드로서 문법적 오류가 없다면, 문제없이 컴파일됩니다.

```ts
// main.ts
let greetings = 'hello'
greetings = 1234
```

```shell
~$ tsc main.ts
main.ts:2:1 -error ... '1234' 형식은 'string' 형식에 할당할 수 없습니다.
```

타입 체크에는 문제가 있지만, 컴파일이 수행되는 타입스크립트의
독립적 기능 수행은 타입 체크의 오류 여부와 상관없이 컴파일된
결과를 만들어낼 수 있다는 점에서 어플리케이션 운영 단계에서
도움이 됩니다.

## 2. 런타임에서 타입 구문은 '제거 가능' 하다

타입 구문은 자바스크립트로 컴파일되는 과정에서 모두 제거됩니다.
즉, **런타임에는 타입 체크가 불가능하며 타입은 런타임에 아무런
영향을 끼치지 않습니다.**

아래의 코드에서 `instanceof` 체크는 런타임에 일어나지만,
`Rectangle`은 타입이기 때문에 런타임 시점에 아무런 역할을
할 수 없습니다.

```ts
interface Square {
  width: number
}

interface Rectangle extends Square {
  height: number
}

type Shape = Square | Rectangle

function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) {
    return shape.width * shape * height
  } else {
    return shape.width * shape.width
  }
}
```

런타임에 타입 정보를 유지하고자 한다면 속성의 존재 여부를
알아보거나, 런타임에 접근 가능한 접근 정보를 명시하는
'태그' 기법을 활용합니다.

```ts
function calculateArea(...) {
  if ('height' in shape) { ... }
}
```

```ts
interface Square {
  kind: "square";  //tag
  width: number;
}

interface Rectangle extends Square {
  kind: "rectangle";  //tag
  height: number;
}

type Shape = Square | Rectangle;

function calculateArea(...) {
  if (shape.kind === 'rectangle') { ... }
}
```

클래스 문법은 자바스크립트 런타임에서 동작하는 실제 함수이지만,
타입으로도 사용할 수 있습니다.

```ts
class Square {
  constructor(public width: number) {}
}

class Rectangle extends Square {
  constructor(public width: number, public height: number) {
    super(width)
  }
}

type Shape = Square | Rectangle

function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) {
    return shape.width * shape * height
  } else {
    return shape.width * shape.width
  }
}
```

## 3. 덕 타이핑 기반 자바스크립트를 모델링한다

타입스크립트는 덕 타이핑(duck typing) 기반 자바스크립트를
모델링하기 위해 구조적 타이핑을 사용합니다. 여기서
[덕 타이핑](https://ko.wikipedia.org/wiki/%EB%8D%95_%ED%83%80%EC%9D%B4%ED%95%91)은
동적 타이핑의 한 종류로, 객체의 변수 및 메서드의 집합이
객체의 타입을 결정하는 것을 말합니다.

아래의 코드는 타입스크립트의 구조적 타이핑을 나타내는 예시입니다.
`Rectangle`과 `NamedRectangle`는 서로 무관하지만,
`calculateArea`의 매개변수로 `NamedRectangle` 타입을
사용해도 정상적으로 동작합니다.

```ts
interface Square {
  width: number
}

interface Rectangle extends Square {
  height: number
}

interface NamedRectangle {
  name: string
  width: number
  height: number
}

function calculateArea(rectangle: Rectangle) {
  return rectangle.width * rectangle.height
}

const rectangle: NamedRectangle = {
  name: 'namedRectangle',
  width: 3,
  height: 4,
}

calculateArea(rectangle)
```

즉 같은 메서드와 맴버변수를 포함하고 있는 동일한 구조의 두 타입은
같은 것으로 취급됩니다.

이러한 관점에서 함수를 작성할 때 호출에 사용되는 매개변수의 속성들이
선언된 타입에 국한되어 있지 않고 '열려 (open)' 있음을 인지해야
합니다.

## 4. type, interface의 차이를 이해하고 일관성을 유지해야 한다

type, interface를 통해 명명된 타입을 정의할 수 있으며,
일반적으로 두 방법 모두 사용가능합니다. 하지만, 그 차이점을
이해하고 일관성을 유지하도록 노력해야 합니다.

```ts
type TState = {
  name: string
  age: number
}

type IState = {
  name: string
  age: number
}
```

type과 interface 모두 추가적인 속성을 할당하면 동일한
오류가 발생합니다.

```ts
const foo: TState = {
  name: 'foo',
  age: 29,
  organization: 'fastfive',
  // ~~~~~~~~~~~~~~~~~~ Type ... is not assignable to type 'TState'
  //                    Object literal may only specify known properties, and
  //                    'organization' does not exist in type 'TState'
}

type TDict = { [key: string]: string }
interface IDict {
  [key: string]: string
}
```

두 방법 모두 인덱스 시그니처, 함수 타입, 제너릭이 가능합니다.

```ts
//index signature
type TDict = { [key: string]: string }
interface IDict {
  [key: string]: string
}

//function type
type TFn = (x: number) => string
interface IFn {
  (x: number): string
}

//generic
type TPair<T> = {
  first: T
  second: T
}
interface IPair<T> {
  first: T
  second: T
}
```

반면에 type과 interface는 서로 확장 가능하나,
인터페이스는 복잡한 타입(유니온 타입, 원시값, 템플릿 리터럴,
튜플 등)은 확장하지 못합니다.
복잡한 타입을 확장하고 싶다면 타입과 &(intersection)을 사용해야 합니다.

```ts
type AorB = 'A' | 'B'

type Input = {
  /* ... */
}
type Output = {
  /* ... */
}
interface VariableMap {
  [name: string]: Input | Output
}

type NamedVariable = (Input | Output) & { name: string }
```

type은 튜플과 배열 타입도 간결하게 표현할 수 있습니다.
물론 interface로도 구현이 가능하지만, 튜플에서
사용할 수 있는 concat과 같은 메서드를 사용할 수 없게 됩니다.
즉, 튜플은 type을 통해 구현하는 것이 낫습니다.

```ts
type Pair = [number, number]
type StringList = string[]
type NamedNums = [string, ...number[]]
```

반면 인터페이스는 속성을 확장하는 '선언 병합'
을 통해 보강이 가능합니다.

```ts
interface IState {
  name: string
  age: number
}
interface IState {
  organization: string
}
const foo: IState = {
  name: 'foo',
  age: 29,
  organization: 'fastfive',
} // OK
```

선언 병합은 주로 타입 선언 파일에서 사용됩니다.
예를 들어, _lib.es5.d.ts_ 에 선언되어 있는 Array 인터페이스가
_lib.es2015.d.ts_ 에 선언된 인터페이스를 병합하여
보강될 수 있도록 하기 위함입니다. 결과적으로
각 선언이 병합되어 전체 메서드를 가지는 하나의
Array 타입을 얻게 됩니다.

결론적으로, 복잡한 타입이라면 타입 별칭을 사용합니다. 그러나
두 가지 방법으로 모두 표현할 수 있다면 일관성과 보강의 관점에서
고려해봐야 합니다. 또한 합류하게 된 프로젝트의 코드 베이스의
일관성을 지키기 위해 선택되어도 좋습니다.

## 5. any 타입은 타입 시스템을 무력화 시킨다

any 타입은 점진적이며 선택적인 타입스크립트의 특성을 위한
핵심 타입이지만, 타입 안정성이 없으며 설계를 감추고
언어 서비스 또한 제공받지 못하게 만드는 강력한 힘을 가지고 있고,
자바스크립트에서 표현할 수 있는 모든 값을 아우르는 매우
큰 범위의 타입입니다.

반대로 말하면, 더 구체적인 타입으로 대체할 수 있는
가능성 또한 높습니다. 가령, 함수의 매개변수가 객체이긴 하지만
값을 알 수 없다면 인덱스 시그니처를 사용하거나, 열거가
가능한 객체임을 표현할 수 있습니다.

```yaml
any -> {[key: string]: any};
any -> any[];
```

부득이하게 any를 사용해야 한다면, any 타입의 영향력이
퍼져나가지 않도록 주의해야 합니다. 아래의 코드처럼
`expressionReturningFoo`의 반환값을 `processBar` 의 매개변수로
전달하기 위해 any를 사용한다면, any로 명시하는 것 보다는
차라리 f2 처럼 사용처에서 단언하여 사용하는 것이 낫습니다.

```ts
interface Foo {
  foo: string
}
interface Bar {
  bar: string
}
declare function expressionReturningFoo(): Foo

function processBar(b: Bar) {
  /* ... */
}

//// Don't do this
function f1() {
  const x: any = expressionReturningFoo()
  processBar(x)
}

// Prefer this
function f2() {
  const x = expressionReturningFoo()
  processBar(x as any)
}
```

f1에서 x 타입은 `processBar` 호출 이후에도 여전히 any 타입인
반면, f2는 사용처 영역에서만 any 타입으로 단언되어 호출 이후
x 타입은 `Foo` 가 됩니다.

만약 f1이 x를 반환하는 구조의 함수라면, any 타입의 영향력은
함수 내부 뿐만 아니라 외부까지 퍼져나가게 되기 때문에
any 타입의 적용 범위를 좁게 제한해야 합니다.

## 6. 타입스크립트 기본형 타입과 객체 래퍼 타입은 다르다

자바스크립트는 일곱 가지 기본 타입(number, boolean, null,
undefined, symbol, bigint)이 있습니다. 기본형들은
불변이고 메서드를 가지고 있지 않다는 점에서 객체와 구분됩니다.

하지만 기본형인 string은 메서드가 호출이 되어 마치 메서드를
가지고 있는 것 처럼 보이지만, string의 메서드가 아닙니다.

```js
'string'.charAt(3) //"i"
```

자바스크립트는 기본형과 객체 타입을 서로 자유롭게 변환하여
기본형에서 charAt에 접근할 때, 자바스크립트는 **기본형을
String 객체로 래핑하고 메서드를 호출하고 래핑한 객체를
버립니다.** 이러한 동작으로 아래의 코드처럼 혼란을 가져오기도 합니다.

```js
const foo = 'foo'
foo.bar = 'hi'
console.log(foo.bar) //undefined
```

타입스크립트는 이러한 자바스크립트 동작을 위해
기본형 타입과 객체 래퍼 타입을 구분지어 모델링합니다.
즉, 기본형 타입과 객체 래퍼 타입은 다릅니다.

하지만 string을 String으로 잘못 타이핑하기 쉽고, 실수를
하더라도 아래의 코드처럼 잘 동작하는 것처럼 보일 수 있습니다.

```ts
function getStringLength(foo: String) {
  return foo.length
}

getStringLen('hello') // OK
getStringLen(new String('hello')) // OK
```

그러나, string은 String에 할당할 수 있지만, String은
string에 할당할 수 없습니다.

```ts
function isSubString(subString: String) {
  return 'hello'.includes(subString)
  //Argument of type 'String' is not assignable to parameter of type 'string'.
}
```

타입스크립트가 제공하는 타입 선언은 전부 기본형 타입으로
되어 있기 때문에 기본형 타입과 객체 래퍼 타입을
혼동해서는 안되며, 기본형 타입을 사용해야 합니다.
