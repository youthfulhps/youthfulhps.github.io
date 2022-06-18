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
  // ~~~~ Type ... is not assignable to type 'TState'
  //      Object literal may only specify known properties, and
  //     'organization' does not exist in type 'TState'
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

반대로 말하면, **any는 더 구체적인 타입으로 대체할 수 있는
가능성 또한 높습니다.** 가령, 함수의 매개변수가 객체이긴 하지만
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

## 7. '잉여 속성 체크'와 '할당 가능 검사'는 별도 과정이다

타입이 명시되어 있는 변수에 객체 리터럴을 할당한다면
타입스크립트는 해당 타입의 속성이 있는 지, 그리고
'그 외의 속성은 없는지' 확인합니다.

타입이 명시되어 있는 변수에 명명된 속성의 매개변수 외의
속성을 할당하려 한다면 오류가 발생합니다.

```ts
interface Room {
  numDoors: number
  ceilingHeightFt: number
}
const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
  // ~~~~ Object literal may only specify known properties,
  //      and 'elephant' does not exist in type 'Room'
}
```

하지만, 구조적 타이핑 관점으로 생각해보면
r은 구조적으로 Room 타입에 해당하는 속성을 모두
가지고 있기 때문에 오류가 발생하지 않아야 합니다.

다른 예시로, 임시 변수를 도입하여 Room 타입에 할당한다면
오류가 발생하지 않습니다.

```ts
interface Room {
  numDoors: number
  ceilingHeightFt: number
}
const obj = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: 'present',
}
const r: Room = obj // OK
```

타입스크립트는 **타입 시스템의 구조적 본질을 해치지 않으면서,
알 수 없는 객체 리터럴의 속성을 허용하지 않도록 하여
구조적 타입 시스템에서 발생할 수 있는 중요한 오류를 잡을 수
있도록 조건적으로 '잉여 속성 체크'를 진행합니다.**

두 예제에 대입하여 생각해보면, 첫번 째 명명된 타입에 객체의 속성을 할당하는 경우
구조적 시스템 관점에서 오류를 잡기 위해 '잉여 속성 체크' 가 수행되었지만,
두 번째 예시의 경우 조건에 따라 '잉여 속성 체크'가 수행되지 않았습니다.

'잉여 속성 체크'는 구조적 타이핑 시스템에서 허용되는
속성 이름의 오타 같은 실수를 잡아내고, 선택적 필드를
포함하는 타입에 특히 유용하지만, 적용 범위도 매우 제한적이고
오직 객체 리터럴에서만 수행합니다.

즉, '할당 가능 검사'와 조건적으로 동작하는 '잉여 속성 체크'는
별도의 과정이라는 것을 인지하고 있어야 합니다.

## 8. 타입 선언도 DRY 원칙을 준수해야 한다

코드에서 반복되고 공유된 패턴을 제거하여 DRY(don’t repeat yourself)
원칙을 준수하려고 노력합니다. 반면 타입 중복은 코드에 비해
흔한 일입니다. **타입 간에 매핑하는 방법을 익혀
타입 정의에서도 DRY 원칙을 준수해야 합니다.**

간단하게 타입의 이름을 붙이는 것으로 반복을 줄일 수 있습니다.
이는 상수를 정의하고 사용하는 것과 동일합니다.

```ts
function getDistance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

=>

interface Point2D {
  x: number;
  y: number;
}

function getDistance(a: Point2D, b: Point2D) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
```

타입 시그니처가 동일하다면, 시그니처 또한 명명된 타입으로 정의하여
공유할 수 있습니다.

```ts
type HTTPFunction = (url: string, opts: Options) => Promise<Response>;

const get: HTTPFunction = (url, options) => { ... }
const post: HTTPFunction = (url, options) => { ... }
```

이미 존재하는 인터페이스를 확장해서 반복을 제거할 수 있습니다.

```ts
interface Person {
  firstName: string
  lastName: string
}

interface PersonWithBirthDate extends Person {
  birth?: Date
}

type PersonWithBirthDate = Person & { birth?: Date }
```

제너릭 타입을 사용하여 중복을 제거할 수 있습니다.
타입스크립트는 자주 사용되는 타입 변환을 모델링하여
[유틸리티 타입](https://www.typescriptlang.org/ko/docs/handbook/utility-types.html)
을 제공합니다.

가령 다수의 중복된 속성을 가진 두 타입이 있다면,
State의 속성을 인덱싱하여 topNavState를 정의할 수 있습니다.

```ts
interface State {
  userId: string
  pageTitle: string
  recentFiles: string[]
  pageContents: string
}
interface TopNavState {
  userId: string
  pageTitle: string
  recentFiles: string[]
}
```

```ts
type TopNavState = {
  userId: State['userId']
  pageTitle: State['pageTitle']
  recentFiles: State['recentFiles']
}
```

하거나, 여전히 남아있는 중복은 매핑된 타입으로
중복을 제거할 수 있습니다. 이러한 패턴은 중복 제거에
자주 등장하는 패턴이며 이를 모델링하여 타입스크립트는
유틸리티 제너릭 타입 [Pick](https://www.typescriptlang.org/ko/docs/handbook/utility-types.html#picktype-keys)
을 제공합니다.

```ts
type TopNavState = {
  [k in 'userId' | 'pageTitle' | 'recentFiles']: State[k]
}

type TopNavState = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>
```

반복적인 작업을 줄이기 위해 노력하는 만큼, 타입의 공간에서
또한 반복을 주의해야 합니다.

## 9. 객체의 숫자 키를 허용하고 문자열 키와 다르게 인식한다

자바스크립트의 객체는 키와 값의 모음입니다. 키는 일반적으로 문자열이고
값은 어떤 것이든 될 수 있습니다. 여기서, 일반적으로 문자열이라는
것은 더 복잡한 객체를 키로 사용해도 문제가 되지 않음을 이야기합니다.

```js
const x = {}
x[[1, 2, 3]] = 2
console.log(x) // {'1,2,3': 2};
```

자바스크립트는 '해시 기능' 객체라는 표현이 없기 때문에 만약, **문자열이
아닌 더 복잡한 객체를 키로 사용하려 한다면, 내부적으로 toString 메서드가
호출되어 객체를 문자열로 반환하여 키로 사용합니다.**

물론 객체의 키를 숫자로 사용한다면, 문자열로 변환되며
숫자로 인덱싱하는 배열 또한 객체로서 배열의 모든 숫자 인덱스들은
문자열로 변환되어 사용됩니다.

```js
const x = {
  1: 2,
  3: 4,
}
console.log(x) // {'1': 2, '3': 4};

console.log(typeof []) // 'object'
const x = [1, 2, 3]
console.log(x[0]) // 1
console.log(x['1']) // 2
console.log(Object.keys(x)) // ['0', '1', '2']
console.log(typeof Object.keys(x)[0]) // 'string'
```

타입스크립트는 **혼란스러운 자바스크립트의 동작을 그대로 모델링하지 않고,
숫자 키를 허용하며 문자열 키와는 다른 것으로 인식합니다.**

```ts
// lib.es5.d.ts

interface Array<T> {
  ...
  [n: number]: T;
}
```

```ts
const xs = [1, 2, 3]
const x0 = xs[0] // OK
const x1 = xs['1']
// ~~~~ Element implicitly has an 'any' type
//      because index expression is not of type 'number'
```

숫자 키와 문자열 키를 다른 것으로 보는 타입스크립트의 동작은
타입 체크 단계에서만 유효한 런타임에는 모두 제거되는 가상의 동작입니다.
그럼에도 타입 체크 단계에서 혼란스러운 자바스크립트의 동작을 오류로
잡을 수 있어 충분히 유용합니다.

## 10. 인덱스 시그니처는 동적 데이터에만 사용되어야 한다

CSV 파일을 파싱하여 행과 열을 값으로 매칭하는 객체로
나타내고 싶은 경우, 객체의 프로퍼티 스펙을 명확히
알 수 없는 경우에 대해 미리 동적 데이터에 대한 타입을
지정해야 한다면, 키와 값 쌍의 타입 시그니처인
인덱스 시그니처를 사용할 수 있습니다.

```ts
type TestScore = { [property: string]: number }
const testScore: TestScore = {
  math: 90,
  english: 85,
}
```

하지만, **인덱스 시그니처는 동적 데이터에 대한 타입을 지정할 때만
사용되어야 하며 객체의 가능한 필드가 제한되어 있는 경우라면 인덱스
시그니처로 모델링하지 말아야 합니다.**
객체 키의 string 타입은 매우 넓은 값을 포함하는 타입이기 때문에
잘못된 키를 포함한 모든 문자열 키를 허용하는 위험이 있으며, 객체의
키값에 대한 자동완성 기능을 제공받지 못하게 됩니다.

만약 데이터의 키가 한정적이지만 존재 여부를 몰라 인덱스 시그니처를
사용했다면, 선택적 필드를 사용하거나 유니온 타입으로 모델링할 수 있습니다.

```ts
interface Row1 {
  a: number
  b?: number
  c?: number
  d?: number
}

type Row2 =
  | { a: number }
  | { a: number; b: number }
  | { a: number; b: number; c: number }
  | { a: number; b: number; c: number; d: number }
```

이러한 방법이 번거롭다면, 키 타입에 유연성을 부여하는 [Record](https://www.typescriptlang.org/ko/docs/handbook/utility-types.html#recordkeystype)
제너릭 타입을 사용할 수도 있습니다.

```ts
type Vec3D = Record<'x' | 'y' | 'z', number>
// Type Vec3D = {
//   x: number;
//   y: number;
//   z: number;
// }
```

키마다 별도의 타입을 사용해야 한다면, 매핑된 타입을 사용할 수 있습니다.

```ts
type ABC = { [k in 'x' | 'y' | 'z']: k extends 'y' ? string : number }
// Type ABC = {
//   a: number;
//   y: string;
//   c: number;
// }
```

## 11. 타입 단언보다는 타입 선언을 하는 것이 낫다

변수가 값을 할당하고 타입을 부여하려면 변수에 타입을 선언하여
그 값이 선언된 타입임을 명시하거나,
타입을 단언하여 타입스크립트가 추론한 타입이 있더라도
단언한 타입으로 간주하는 두 방법을 사용합니다.

```ts
interface Person {
  name: string
}

const alice: Person = { name: 'Alice' }
const bob = { name: 'Bob' } as Person
```

타입 선언은 할당되는 값이 해당 타입을 만족하는 지
검사하지만, 타입 단언은 타입을 강제로 단언하여
타입 체커에게 타입 오류가 있지만, 강제하여 무시하도록 합니다.

```ts
const alice: Person = {
  name: 'Alice',
  occupation: 'Typescript developer',
  // ~~~~~ Object literal may only specify known properties
  //       and 'occupation' does not exist in type 'Person'
}

const bob = {
  name: 'Bob',
  occupation: 'Javascript developer',
} as Person //No error
```

타입 단언을 사용하면 문제가 해결되는 것처럼 보이지만
런타임에 문제가 발생할 수 있습니다.

```ts
interface Person {
  name: string
}

const people = ['alice', 'bob', 'jan'].map(name => ({} as Person))
//No error
```

일반적으로 단언문을 사용하지 않는 것이 변수를 선언하는 것이
가장 직관적이며 타입 단언은 타입 체커가 추론한 타입보다
개발자가 판단하는 타입이 더 정확할 때 유효합니다.

```ts
document.querySelector('#myButton').addEventListener('click', e => {
  e.currentTarget //타입은 EventTarget;
  const button = e.currentTarget as HTMLButtonElement
  button //타입은 HTMLButtonElement;
})
```
