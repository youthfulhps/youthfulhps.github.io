---
title: 비로소 알게된 리엑트 메모이제이션
date: 2022-09-21 11:09:83
category: react
thumbnail: { thumbnailSrc }
draft: true
---

보통 어플리케이션에서 최적화를 위해 메모이제이션 기법을 통해 이전에 계산한 값을 메모리에
저장해두고, 동일하게 다시 사용할 수 있는 곳에서 재사용하여 반복적으로 발생하는 계산의
리소스를 줄이는 기법을 사용하곤 합니다.

리엑트에서도 메모이제이션을 쉽게 구현할 수 있도록 도와주는 API들이 존재하는데요.
리엑트 공식문서에서 우리가 잘 알고 있는 [useMemo](https://ko.reactjs.org/docs/hooks-reference.html#usememo)
에 대해 다음과 같이 설명하고 있습니다.

_“생성(create)” 함수와 그것의 의존성 값의 배열을 전달하세요. useMemo는 의존성이
변경되었을 때에만 메모이제이션된 값만 다시 계산 할 것입니다. 이 최적화는 모든 렌더링 시의
고비용 계산을 방지하게 해 줍니다._

사실, useMemo를 포함해서 useCallback과 React.memo에 대한 의론적인 배움을 얻고
사용해왔지만 최근 다시금 공식 문서를 읽었을 때, 문서에서 말하는 고비용의 기준은 무엇인지,
사용할 수는 있지만 보장되어 있지 않다는 문구의 의미는 무엇인지 등등, 역시 명확한 기준을 제공하지
않는 모습을 보면서 내가 적절하게 잘 이해하고 적재적소에 사용하고 있고, 실질적인 성능 최적화를
이루고 있는 건가에 대한 의구심이 들었습니다.

이 글은 갑자기 낯설게 느껴지는 리엑트 메모이제이션에 대한 찝찝함을 이겨내고자 조금 더 깊게
알아보고, 가능하면 최적화에 대한 스스로의 기준도 정해보려 합니다. 비슷한 고민을 하시는 분들에게
도움이 될 수 있으면 좋겠습니다.

## useMemo, 메모이제이션된 값을 반환한다

우선 우리가 잘 알고 있는 리엑트의 메모이제이션을 위한 API를 살펴봅시다. 그 첫 번째로 useMemo는
값을 메모이제이션합니다. 같은 말로, 메모이제이션된 값을 반환합니다.

리엑트에서 사용되는 훅들은 [HookDispatcher](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.new.js#L2599)
라는 이름으로 내부에서 공유되는데, 여기서 useMemo를 찾아볼 수 있습니다.

```ts
const HooksDispatcher...: Dispatcher = {
  ...
  useMemo: updateMemo,
}
```

_onMount, onRerender, onUpdate에 따라 사용되는 HooksDispatcher 객체가 각각 구현되어 있어
변수명에 (...)을 표기하였습니다._

여기서 useMemo는 updateMemo 라는 함수로 그 구현체가 정의되고 있는데요. 우리가 이해하고 있는
useMemo의 역할을 코드로 확인해봅시다.

```ts
function updateMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null,
): T {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;

  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }

  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];

  return nextValue;
}
```

먼저 updateMemo()의 파라미터 nextCreate, deps는 우리가 사용하는 useMemo에서
메모이제이션할 값을 연산하기 위한 콜백 함수, 그리고 특정값이 변할 때만 새롭게 메모이제이션
될 수 있도록 전달하는 deps와 대응됩니다.

```ts
function updateMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null,
): T {
  ...
}
```

함수 내부에서는 로직 전개를 위해 활용될 세 가지의 변수를 가지고 있는데, 여기서 hook
에는 어떤 값이 할당될까요?

위에서 봤던 리엑트의 Dispatcher 객체와 마찬가지로, 훅은 [Hook](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.new.js#L159)
이라는 인터페이스를 가진 객체로 되는데, updateWorkInProgressHook()은
훅으로 관리하고자 하는 값에 대해 직전 랜더링 환경에서 대응되는 훅 객체를 반환하고,
대응되는 훅 객체가 없다면 새로운 훅 객체를 생성하여 반환합니다.

nextDeps는 파라미터로 전달받은 deps를, prevState는 직전 랜더링 환경에서 메모이제이션되어
있던 값을 참조합니다.

```ts
export type Hook = {
  memoizedState: any,
  baseState: any,
  baseQueue: Update<any, any> | null,
  queue: any,
  next: Hook | null,
};
```

```ts
  ...
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  ...
```

결국, useMemo는 직전 훅 객체에 메모이제이션된 값과 전달된 deps가 null이
아니라면, deps로 전달받은 값들이 변경되지 않았음을 검증하는 단계를 거쳐
메모제이션된 값을 반환합니다.
_[areHookInputsEqual()](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.new.js#L343)은 여기서!_

```ts
  ...
  if (prevState !== null) {
    if (nextDeps !== null) {
      // 여기서 prevState는 [value, deps]의 형태
      const prevDeps: Array<mixed> | null = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  ...
```

분기 검증에 실패했다면, 값을 얻기 위한 콜백 함수인 nextCreate()를 통해 값을 구하고,
현재 새로운 훅 객체의 memoizedState에 deps와 함께 할당합니다.

```ts
  ...
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];

  return nextValue;
}
```

useMemo의 구현체 코드를 보니 콜백함수와 deps를 전달하면, deps가 참조하고 있는 값이 변경되지 않는 한
메모이제이션된 값을 다시 사용하는 기능을 잘 이해하고 있음을 확인할 수 있었습니다. :)

## useCallback, 메모이제이션된 콜백을 반환한다

useCallback은 인자값으로 전달받은 콜백 함수를 메모이제이션합니다.
예상할 수 있듯, useCallback의 구현체는 useMemo 구현체와 매우 유사하기 때문에 특별히 다른 부분만 짚고 넘어가겠습니다.

useCallback는 updateCallback 이라는 함수로 그 구현체가 정의되어 있습니다.

```ts
const HooksDispatcher...: Dispatcher = {
  ...
  useCallback: updateCallback,
  ...
}
```

updateCallback은 updateMemo와 달리, 파라미터로 전달받은 callback 자체를
메모이제이션하는 것을 확인할 수 있습니다.

```ts
function updateCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }

  // callback 자체를 메모이제이션한다.
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```

우리가 잘 이해하고 있는 것 처럼, useMemo는 콜백 함수의 연산 반환값을, useCallback을 콜백 자체를
메모이제이션하는 기능 차이를 확인할 수 있었습니다.
