---
title: react-concurrent-mode
date: 2022-06-11 16:06:62
category: react
thumbnail: { thumbnailSrc }
draft: true
---

리엑트v18에서 동시성 기능을 정식으로 출시하였습니다.
대표적으로, _Automatic batching for fewer renders_,
_SSR support for Suspense_, _Fixes for Suspense behavior quirks_
와 같은 내부적인 성능 향상을 이루었고, _startTransition_,
_useDeferredValue_, _SuspenseList_, _Streaming SSR with selective hydration_
과 같은 기능들이 추가되었습니다.

리엑트v18에는 동시성 랜더링 기능을 담아내기 위해
협력적 멀티테스킹, 우선순위 기반 랜더링, 스케쥴링, 중단과 같은
메커니즘을 구현하였습니다. 기저에 있는 아키텍처를 수정해야 했던 만큼
5년이라는 시간동안 많은 시행착오를 겪었을 텐데요.

이 글을 적게 된 계기는 _'도대체, 동시성이 무엇이길래 리엑트팀에서 5년이라는
시간을 쏟았으며, 동시성을 위한 메커니즘들의 구현체들이 어떻게 구현되어 있을 까?
'_ 라는 호기심과 함께, _'리엑트를 사랑하는 개발자로서 최소한의 예의를 보여야 겠다'_
라는 생각이 들어서 입니다.

## Concurrent vs Parallelism

동시성을 설명할 때, 서로 관련있는 병렬성과 함께 설명하곤 합니다.
하지만, 이 둘은 뚜렷한 차이를 가지고 있으며
Go 언어의 창시자의 [Concurrency is not parallelism](https://go.dev/blog/waza-talk)
발표 서문에는 다음과 같이 동시성과 병렬성을 비교합니다.

_'**동시성은 독립적으로 실행되는 프로세스들의 조합이다.**'
'병렬성은 연관된 복수의 연산들을 동시에 실행하는 것이다.'
'**동시성은 여러 일을 한꺼번에 다루는 문제에 관한 것이다.**'
'병렬성은 여러 일을 한꺼번에 실행하는 방법에 관한 것이다.'_

아주 멜랑꼴리한데 발표에서 언급한 문구를 빌려 정리하자면,
**동시성은 프로세서가 하나만 있는 경우, 병렬 처리를 가능케 하지만 병렬처리는 아닙니다.**
즉, 하나의 스레드로 작업을 순차적으로 처리하지만,
마치 여러 개의 스레드가 사용되고 있는 것처럼 보이게 하는 것이고,
동시성은 싱글 코어에서도 동작하지만, 병렬성은 두 개 이상의 코어가 필요합니다.

병렬성은 예를 들어 GPU를 통해 이미지를 랜더링할 때 R, G, B를 연산하는
텍스크를 각각의 코어가 작업하는 것과 같이 최소 한 가지 논리적 통제를
멀티 코어에서 병렬적으로 진행합니다.

![Parallel task processing](./images/react-concurrent-mode/parallelism-process.png)

반면 동시성은 최소 두 개의 논리적 통제 흐름을 가지고 있으며,
잘개 쪼개진 두 개 이상의 작업을 지속적으로 컨텍스트 스위칭하여
마치 동시에 이루어지는 것처럼 보이도록 합니다.
강의를 듣다가 내용 정리를 위해 일시정지하고 메모하는 것과 같은 작업 처리 방식입니다.

![Concurrent task processing](./images/react-concurrent-mode/concurrent-process.png)

## 리엑트팀은 왜 동시성을 구현하고자 했을 까

리엑트는 사용자 인터페이스를 구축하는 라이브러리로서 핵심 역할인 인터렉션에
대한 업데이트 과정과 사용자 경험에 대한 HCI 연구 결과를 반영하고 궁극적으로
기술적으로 결합하는 목표를 가지고 있습니다. 사람과 컴퓨터간의 인터렉션에
대한 연구 결과들을 추상화해서 리엑트 코어의 개선 목표로 삼고 이를
구현합니다.

가령, 화면 간 전환에서 로딩 중 상태를 너무 많이 표시하면 UX 품질이
낮아지는 문제라던지, 빠르게 처리되기를 기대하는 상호작용들과 느려도 문제없는
상호작용을 구분짓고 이를 적용해서 효과적으로 사용자 인터페이스에 구현할 수 있는
방법들을 제공하기 위함입니다.

조금 더 와닿을 수 있게 우리의 구현체들이 동작하는 브라우저 환경에서
생각해봅시다. 브라우저는 HTML을 파싱하고, 자바스크립트를 실행하며
랜더트리를 구축하고 그려내는 작업까지 단일 스레드로서 한번에 하나의
작업만을 수행합니다.

때문에 가령 메인 스레드가 자바스크립트 엔진에게 실행권을 위임하여
자바스크립트 파싱을 시작했다면 그 작업을 멈출 수 없으며,
작업이 완료될 때까지 이후의 작업을 전개할 수 없습니다.
리엑트 랜더링 연산 과정도 동일한 절차를 거치게 되며,
이 때 매우 무거운 랜더링 연산 과정이 시작되면 이후의 작업들이 다소
긴 시간 동안 대기 상태가 되는 블로킹 랜더링이 발생합니다.

재조정을 위한 리엑트의 비교 알고리즘은 매우 최적화되어 있어
블로킹되는 이슈가 자주 발생하지 않아 공감하기 어려울 수 있지만,
[deview2021/blocking](https://ajaxlab.github.io/deview2021/blocking)
데모처럼 입력값에 대한 픽셀 박스를 랜더링하는 연산이 무거워짐에 따라
keypress 이벤트에 대한 처리가 지연되고 있음을 경고 플래그를 통해 확인할 수 있습니다.

![Example of blocking rendering](./images/react-concurrent-mode/blocking-rendering-example.png)

![Delay in processing tasks for keypress](./images/react-concurrent-mode/blocking-rendering-performance.png)

경고 플래그 중 하나의 예시로 keypress 이벤트를 처리하는 데 143.41ms이 소요 되었는데
[RAIL](https://web.dev/rail/?utm_source=devtools#goals-and-guidelines)
모델을 기반으로 생각한다면, 사용자는 입력 이벤트에 대해 100ms 이상 소요되는 것을
동작과 응답 사이의 연결이 지연되고 있음을 인식하게 되며, 이는 사용자 경험의 감점으로
이어질 수 있습니다.

## 동시성 구현을 위한 메커니즘; 우선 순위

리엑트에서 동시성을 구현하는 첫번 째 메커니즘은 바로 우선순위입니다.

우선순위 메커니즘은 업데이트 전반에 걸쳐 적용되어 있습니다.
사용자 인터렉션이 이벤트를 통해 전달되면 이에 대한 업데이트가
필요한데, 리엑트는 사용자 중심의 성능 모델 측면에서 이벤트에 대한
우선순위를 인위적으로 구분짓고, 작업별 우선순위를 부여합니다.

즉, 업데이트를 진행하기 위한 각각의 작업의 우선순위를
부여하여 이를 기준으로 스케쥴러에 의해 작업의 교통 정리가 이루어지기
위한 일련의 메커니즘과 진행 중인 작업이 우선 순위가 높은 대기 상태의
작업에 의해 중단되거나, 일괄 처리될 수 있음을 담아내고 있습니다.

한편, 리엑트v17.0 이전에서는 작업의 [만료 시간을 기준으로 우선순위를 부여](https://github.com/facebook/react/blob/v16.12.0/packages/react-reconciler/src/ReactFiberExpirationTime.js)하는 메커니즘으로 구현되어 있었습니다.
반면, 리엑트v17.0 이후에서는 Lane 모델을 착안하여 비트 연산을
기반으로 우선 순위를 부여하는 방식으로 변경되는데요.
전반적인 우선순위 메커니즘을 담고 있는 모델이기 때문에 우선순위 메커니즘에 대해
이야기하기 전에 Lane 모델에 대해서 살펴봅시다.

### Lane 모델, 그리고 Lane 우선순위

Lane 모델은 도로의 차선을 모티브로 하여 리엑트에서 작업의 우선순위를
표현하기 위해 사용되었고, 스케쥴링 및 조정 작업 과정에서 매우 중요한 역할을 하는
개념입니다. 작업을 나타내는 31비트 데이터로 표현된
비트 마스크를 레인(lane)이라 하고, 고유의 작업 스레드를 표현하고 있습니다.

```js
// react-reconciler/src/ReactFiberLane.new.js

export type Lanes = number;
export type Lane = number;
export type LaneMap<T> = Array<T>;

export const TotalLanes = 31;

export const NoLanes: Lanes = /*                        */ 0b0000000000000000000000000000000;
export const NoLane: Lane = /*                          */ 0b0000000000000000000000000000000;
export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000001;
export const InputContinuousHydrationLane: Lane = /*    */ 0b0000000000000000000000000000010;
export const InputContinuousLane: Lane = /*             */ 0b0000000000000000000000000000100;
export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000000001000;
export const DefaultLane: Lane = /*                     */ 0b0000000000000000000000000010000;
const TransitionHydrationLane: Lane = /*                */ 0b0000000000000000000000000100000;
const TransitionLanes: Lanes = /*                       */ 0b0000000001111111111111111000000;
const TransitionLane1: Lane = /*                        */ 0b0000000000000000000000001000000;
...
const RetryLanes: Lanes = /*                            */ 0b0000111110000000000000000000000;
const RetryLane1: Lane = /*                             */ 0b0000000010000000000000000000000;
...

export const SomeRetryLane: Lane = RetryLane1;
export const SelectiveHydrationLane: Lane = /*          */ 0b0001000000000000000000000000000;
const NonIdleLanes: Lanes = /*                          */ 0b0001111111111111111111111111111;
export const IdleHydrationLane: Lane = /*               */ 0b0010000000000000000000000000000;
export const IdleLane: Lane = /*                        */ 0b0100000000000000000000000000000;
export const OffscreenLane: Lane = /*                   */ 0b1000000000000000000000000000000;
```

Lane 모델은 우선순위를 두 가지 중요한 컨셉으로 분리합니다.

- _Task Prioritization, A 작업이 B 작업보다 급한가?_
- _Task Batching, A 작업이 이 그룹 텍스크에 속하는 가?_

Task Prioritization 개념을 통해 작업의 우선순위를 기준으로 작업의
우선 실행권을 부여하고, Task Batching 개념을 착안하여
가령 CPU > I/O > CPU 순의 작업 예약에 대해,
I/O 작업을 다른 그룹으로 분리하여 일괄 처리함으로서 CPU 작업의 병목을 
방지할 수 있도록 합니다.

_CPU 작업이 I/O 작업보다 우선순위가 낮아 지속적인 양보가 발생하게 되면 CPU 작업처리에
진전이 없을 여지를 방지하기 위해 I/O 작업들을 묶어 진행할 수 있도록 하는 것은
리엑트v18에서 제공하는 [Automatic Batching](https://github.com/reactwg/react-18/discussions/21)
의 기저에 있는 동작 방식인듯 합니다. 깊이 있게 살펴볼 부분들이 차고 넘치네요._

Task Prioritization이 표현되는 각각의 레인이 가지고 있는
비트 값이 우선순위를 나타내고 있으며, 레인의 이름을 통해
어떠한 업데이트가 소유할 수 있는 레인인지 파악해볼 수 있습니다.

- _**SyncLane**, 이산적인(discrete) 사용자 상호 작용에 대한 업데이트_
- _**InputContinuousLane**, 연속적인(continuous) 사용자 상호 작용에 대한 업데이트_
- _**DefaultLane**, setTimeout, 네트워크 요청 등에 의해 생성된 업데이트_
- _**TransitionLane**, Suspense, useTransition, useDefferredValue에 의해 생성된 업데이트_

레인 모델이 어떻게 구현되어 있는 지 간단하게 살펴보았다면,
어떻게 적용되어 사용되는 지 확인해볼 차례입니다.
리엑트에서 Lane 모델을 기반으로 Lane 우선순위 개념을 이벤트 우선순위와
스케쥴러 우선순위에 녹여냈는 지 살펴봅시다.

_Lane 모델에 대한 설명은 [deview2021/Inside React (동시성을 구현하는 기술)](https://tv.naver.com/v/23652451)
과 초기 레인 모델을 구현한 [react/pull/18796](https://github.com/facebook/react/pull/18796)
PR을 기반으로 작성하였습니다. 추가적인 내용은 레퍼런스를 참고하시면 좋습니다._

### 이벤트 우선순위

리엑트는 사용자 인터렉션에 의해 발생된 이벤트를 인위적으로 구분짓고,
구분된 이벤트를 묶어 우선순위를 결정짓습니다.
여기서, 크게 두 종요로 구분되어 루트에 바인딩될 때 어느 범주에 속한
이벤트인지에 따라 우선순위가 부여됩니다.

- _이산적인 이벤트 (e.g. click, keydown, focusin, ..)_
- _연속적인 이벤트 (e.g. drag, pointermove, scroll, ..)_

```js
// react-reconciler/src/ReactEventPriority.new.js

export const DiscreteEventPriority: EventPriority = SyncLane;
export const ContinuousEventPriority: EventPriority = InputContinuousLane;
export const DefaultEventPriority: EventPriority = DefaultLane;
export const IdleEventPriority: EventPriority = IdleLane;
```

여기서, 이벤트 우선순위에 할당되는 값들은 앞서 살펴보았던 31비트로 구성되어 있는 Lane들과
매핑되어 있는 것을 확인하실 수 있습니다.

그리고 각각의 이벤트에 대해 우선순위를 반환하는 함수가 작성되어 있습니다.

```js
// react-dom/src/events/ReactDOMEventListener.js

export function getEventPriority(domEventName: DOMEventName): * {
  switch (domEventName) {
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    ...
      return DiscreteEventPriority;
    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    ...
      return ContinuousEventPriority;
    case 'message': {
      const schedulerPriority = getCurrentSchedulerPriorityLevel();
      switch (schedulerPriority) {
        case ImmediateSchedulerPriority:
          return DiscreteEventPriority;
        case UserBlockingSchedulerPriority:
          return ContinuousEventPriority;
        ...
      }
    }
    default:
      return DefaultEventPriority;
  }
}
```

_여기서 'message' 이벤트는 따로 처리해주는 것을 확인할 수 있는데, 협력적 스케쥴링 모델을
사용하고, 정확한 스케쥴링 타임을 위해 리엑트 스케쥴러에서는 MessageChannel API를 기반으로
구현되어 있습니다. 따라서 'message' 이벤트가 스케쥴러 콜백일 수 있기 때문에
'message' 이벤트에 대해서는 네이티브 스케쥴러에 대한 현재 우선 순위를 확인하여 반환합니다._

`getEventPriority()` 를 따라 올라가다 보면, 대응되는 이벤트 우선순위를
각각의 이벤트 리스너에 래핑시키고, 우선순위가 래핑된 이벤트 리스너를 반환하는 곳에서
사용됩니다.

```js
// react-dom/src/events/ReactDOMEventListener.js

export function createEventListenerWrapperWithPriority(
  targetContainer: EventTarget,
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags
): Function {
  const eventPriority = getEventPriority(domEventName);
  let listenerWrapper;
  switch (eventPriority) {
    case DiscreteEventPriority:
      listenerWrapper = dispatchDiscreteEvent;
      break;
    case ContinuousEventPriority:
      listenerWrapper = dispatchContinuousEvent;
      break;
    case DefaultEventPriority:
    default:
      listenerWrapper = dispatchEvent;
      break;
  }
  return listenerWrapper.bind(
    null,
    domEventName,
    eventSystemFlags,
    targetContainer
  );
}
```

결국 `createRoot()` 에서
리엑트17 이후 버전의 [이벤트 위임 메커니즘](https://ko.reactjs.org/blog/2020/08/10/react-v17-rc.html#changes-to-event-delegation)
에 입각하여, 우선 순위가 래핑된 이벤트 리스너들이 모두 루트에 바인딩되게 됩니다.

이를 통해 사용자 상호 인터렉션에 따라 발생한 이벤트 우선순위는,
바인딩된 이벤트 리스너를 통해 주입받을 수 있게 됩니다.

```js
// react-dom/src/client/ReactDOMRoot.js

export function createRoot(
  container: Element | Document | DocumentFragment,
  options?: CreateRootOptions,
): RootType {
  ...
  const root = createContainer(
    ...
  );
  markContainerAsRoot(root.current, container);

  const rootContainerElement: Document | Element | DocumentFragment =
    container.nodeType === COMMENT_NODE
      ? (container.parentNode: any)
      : container;
  listenToAllSupportedEvents(rootContainerElement); //**

  return new ReactDOMRoot(root);
}
```

<!-- TODO: Lanes, Event, Scheduler 우선순위는 모두
기저에 Lanes 모델이 있다는 정도로만 설명하면 될 것 같다. -->

### 스케쥴러 우선순위

위에서 이벤트 우선순위가 Lane 우선순위를 참조하여 정의되고 있음을
확인했습니다. 마찬가지로 스케쥴러 우선순위는 이벤트 우선순위를
기반으로 우선순위를 할당합니다.

가령 이벤트가 발생하여 setState를 통해 부가적인 상태 업데이트가
디스패치되면, 업데이트를 위한 객체를 생성하기 이전 requestUpdateLane()
이 호출됩니다.

```js
// react-reconciler/src/ReactFiberHooks.new.js

function dispatchSetState<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
) {
  ...

  const lane = requestUpdateLane(fiber);

  const update: Update<S, A> = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: (null: any),
  };

  ...
}
```

<!-- TODO: Lane 모델의 적용단계의 함수 플로우를 정리헤야 함-->
<!-- TODO: ensureRootIsScheduled 함수에 대한 정리가 필요함-->

<!-- 클릭 이벤트를 트리거하고, setState를 호출하여 업데이트에
대한 작업을 생성할 때,

```js
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
``` -->

<!-- setState 함수를 호출하여 업데이트를 시작하고 setState는
내부적으로 enqueueSetState 함수를 호출한다.

```js
enqueueSetState(inst, payload, callback) {
    const fiber = getInstance(inst); //현재 컴포넌트에 해당하는 Fiber Node 가져오기
    const eventTime = requestEventTime(); // 이벤트가 트리거된 시간 가져오기
    const lane = requestUpdateLane(fiber); // 현재 이벤트에 해당하는 Lane 우선순위 가져오기

    // 업데이트 개체를 만들고, 업데이트해야 하는 컨텐츠를 페이로드에 탑재한다.
    const update = createUpdate(eventTime, lane);
    update.payload = payload;
    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    // 업데이트 대기열에 업데이트 개체 추가
    enqueueUpdate(fiber, update, lane);
    const root = scheduleUpdateOnFiber(fiber, lane, eventTime);
    ...
}
``` -->

이후 생성된 업데이트 객체의 이벤트 우선순위를 할당받게 됩니다.
여기서, 업데이트가 필요한 컴포넌트의 Fiber 객체를 받아 `requestUpdateLane()`
를 통해 현재 이벤트의 우선순위를 가져옵니다. `requestUpdateLane()`이
어떻게 이벤트 우선순위를 얻어오는 지 살펴봅시다.

```js
export function requestUpdateLane(fiber: Fiber): Lane {
  // 현재 랜더링 모드를 가져옵니다. 동기화 or 동시성 모드
  const mode = fiber.mode;
  if ((mode & ConcurrentMode) === NoMode) {
    // 현재 랜더링 모드가 동시성 모드인지 확인하고, NoMode와
    // 같다면, 동기 모드로 랜더링합니다.
    return (SyncLane: Lane);
  } else if (
    !deferRenderPhaseUpdateToNextBatch &&
    (executionContext & RenderContext) !== NoContext &&
    workInProgressRootRenderLanes !== NoLanes
  ) {
    // workInProgressRootRenderLanes는 작업 실행 단계에서 업데이트해야 하는 FiberNode
    // 새 업데이트가 작성되었을 때 workInProgressRootRenderLanes가 비어있지 않음은 실행
    // 중인 작업이 있음을 의미합니다.
    // 실행 중인 레인이 직접 반환되고, 현재 새 작업이 기존 작업과 일관적으로 업데이트됩니다.
    return pickArbitraryLane(workInProgressRootRenderLanes);
  }

  // 현재 이벤트가 Transition 우선 순위라면 전환 우선 순위를 반환
  // Transition 우선순위의 할당 규칙은
  // 생성된 작업 A는 Transition의 첫 번째 비트를 할당한다.
  // TransitionLane1 = 0b0000000000000000000000001000000
  // 작업 B가 다시 생성되었으므로, A 위치에서 왼쪽으로 한 비트 이동한다.
  //： TransitionLane2 = 0b0000000000000000000000010000000
  // 후속 작업은 마지막 숫자에 도달할 때까지 한 번에 하나씩 뒤로 이동한다.
  // 16비트의 Transition 우선순위가 있다.:
  // TransitionLanes = 0b0000000001111111111111111000000
  // 모든 비트가 사용되면 첫 번째 비트부터 이벤트 전환 우선 순위가 부여된다.
  const isTransition = requestCurrentTransition() !== NoTransition;
  if (isTransition) {
    if (currentEventTransitionLane === NoLane) {
      currentEventTransitionLane = claimNextTransitionLane();
    }
    return currentEventTransitionLane;
  }

  // onClick등과 같은 반응의 내부 이벤트에서 트리거된 업데이트 이벤트는 이벤트가
  // 트리거될 때 현재 이벤트에 대한 우선순위를 설정한다. 이 이벤트는 직접 사용할 수 있다.
  const updateLane: Lane = (getCurrentUpdatePriority(): any);
  if (updateLane !== NoLane) {
    return updateLane;
  }

  // 리엑트 외부의 반응 이벤트에 대해서 (e.g. setTimeout)
  // 현재 이벤트에 대한 우선순위를 설정한다. 이는 직접 사용할 수 있다.
  const eventLane: Lane = (getCurrentEventPriority(): any);
  return eventLane;
}
```

먼저 현재 랜더링 모드가 동시성 모드인지 확인하고, 동시성 모드가
아니라면 SyncLane이 랜더링에 사용됩니다.

```js
export function requestUpdateLane(fiber: Fiber): Lane {
  const mode = fiber.mode;
  if ((mode & ConcurrentMode) === NoMode) {
    return (SyncLane: Lane);
  }
  ...
}
```

<!-- * 여기서부터 다시 작업 시작!! 내일부터 다시 꼬박꼬박-->

동시성 모드일 때는 먼저 현재 실행 중인 작업이 있는 지 확인한다.
workInProgressRootRenderLanes는 현재 실행 중인 작업의 Lane우선 순위가 담긴다.
workInProgressRootRenderLanes가 비어 있지 않다면 실행 중인 작업의
레인이 직접 반환되고 현재 새 작업이 기존 작업과 함께 일괄적으로 업데이트된다.

```js
if (
  !deferRenderPhaseUpdateToNextBatch &&
  (executionContext & RenderContext) !== NoContext &&
  workInProgressRootRenderLanes !== NoLanes
) {
  return pickArbitraryLane(workInProgressRootRenderLanes);
}
```

위의 항목이 없으면, 현재 이벤트가 Transition 우선 순위인지 여부를 결정하고,
맞다면, 전환 우선 순위에서 위치를 할당한다.

전환 우선 순위 할당 규칙은 다음과 같다. 우선 순위를 할당할 때
전환 우선순위의 맨 오른쪽부터 시작하여 후속 작업이 차례로 왼쪽으로 한 자리
이동합니다. 마지막 위치가 할당될 때까지 후속 작업은 다음부터 시작된다.
가장 오른쪽 첫 번째 위치에서 할당을 시작한다.

```js
TransitionLane1 = 0b0000000000000000000000001000000;
TransitionLane2 = 0b0000000000000000000000010000000;
```

후속 작업은 총 16의 Transition 우선순위와 함께 하나씩 왼쪽으로 이동한다.

```js
TransitionLanes = 0b0000000001111111111111111000000;
```

전환 우선순위 작업이 아닌 경우 아래를 보면 다음으로 getCurrentUpdatePriority 함수가 호출되는 것을 볼 수 있습니다. 처음에 프로젝트가 처음 렌더링될 때 이벤트가 위임될 것이라고 언급한 것을 기억하십시오. 루트 컨테이너 및 모든 지원되는 이벤트는 우선 순위에 따라 분류되며 이벤트가 발생하면 setCurrentUpdatePriority 함수가 호출되어 현재 이벤트의 우선 순위를 설정합니다. getCurrentUpdatePriority 함수를 호출하면 이벤트가 트리거될 때 설정된 이벤트 우선 순위도 가져옵니다. 획득한 이벤트 우선 순위가 비어 있지 않으면 이벤트의 우선 순위를 직접 반환합니다.

```js
const updateLane: Lane = (getCurrentUpdatePriority(): any);
if (updateLane !== NoLane) {
  return updateLane;
}
```

이벤트 우선순위가 위에서 발견되지 않으면 getCurrentEventPriority가 호출되어 React의 외부 이벤트의 우선순위를 가져옵니다.예를 들어 setState 메소드는 setTimeout에서 호출됩니다.

마지막으로 찾은 이벤트의 우선 순위를 반환한다.

```js
const eventLane: Lane = (getCurrentEventPriority(): any);
return eventLane;
```

이벤트의 우선순위를 얻은 다음, Lane을 사용하면 어떻게 되는 지 알아봅시다.
업데이트 객체가 생성되고, 이벤트의 레인이 업데이트 객체에 추가됩니다.

```js
export function createUpdate(eventTime: number, lane: Lane): Update<*> {
  const update: Update<*> = {
    eventTime,
    lane,

    tag: UpdateState,
    payload: null,
    callback: null, // 콜백 setState의 두 번째 매개변수 업데이트

    next: null,
  };
  return update;
}
```

다음으로 업데이트해야 하는 컨텐츠를 페이로드에 담고,
업데이트 콜백 함수를 업데이트 개체의 콜백 속성에 담습니다.

```js
update.payload = payload;
if (callback !== undefined && callback !== null) {
  update.callback = callback;
}
```

그 다음 현재 컴포넌트에 해당하는 FiberNode의 업데이트 대기열에
업데이트 개체를 추가한다.

```js
enqueueUpdate(fiber, update, lane);
```

그 다음 스케쥴러 작업을 위해 scheduleUpdateOnFiber가 호출된다.
scheduleUpdateOnFiber가 주로 사용되는 중요한 위치를 살펴보자.

```js
export function scheduleUpdateOnFiber(
  fiber: Fiber,
  lane: Lane,
  eventTime: number,
): FiberRoot | null {
  checkForNestedUpdates();
  ...

  // 업데이트해야 하는 자식 노드의 레인을 수집하고 부모 Fiber의 자식 Lane을 저장한다.
  // 현재 FiberNode의 레인을 업데이트하여 현재 노드를 업데이트해야 함을 나타낸다.
  // 현재 업데이트해야 하는 파이버 노드에서 위로 트래버스하여 루트 노드로
  // 트래버스하고 각 파이버 노드에서 childLanes 속성을 업데이트한다.
  // childLanes 값은 현재 노드 아래 업데이트해야 하는 자식 노드가 있음을 나타낸다.
  const root = markUpdateLaneFromFiberToRoot(fiber, lane);
  if (root === null) {
    return null;
  }

  // 현재 업데이트해야 하는 레인을 Fiber Root의 pendingLanes 속성에
  // 추가하여 실행해야 하는 새 업데이트 작업이 있음을 나타낸다.
  // 현재 레인의 위치를 계산하고 eventTimes에 이벤트 트리거 시간을 추가한다.
  markRootUpdated(root, lane, eventTime);
  ...

  ensureRootIsScheduled(root, eventTime);
  ...
  return root;
}
```

markUpdateLaneFromFiberToRoot가 함수 내에서 호출되는 것을 볼 수 있습니다.이 함수의 주요 기능은 현재 광섬유 노드의 레인을 업데이트하여 현재 노드를 업데이트해야 함을 표시하고 업데이트해야 하는 자식 노드의 레인을 수집하는 것입니다. 업데이트하고 상위 파이버의 childLanes 속성에 저장합니다. 나중에 업데이트할 때 현재 광섬유 노드가 광섬유 노드의 lannes\*에 따라 업데이트되어야 하는지 여부와 현재 광섬유의 자식 노드가 childLanes에 따라 업데이트되어야 하는지 여부를 판단합니다. markUpdateLaneFromFiberToRoot가 내부적으로 구현되는 방식을 살펴보겠습니다.

```js
function markUpdateLaneFromFiberToRoot(
  sourceFiber: Fiber,
  lane: Lane,
): FiberRoot | null {
  // 현재 노드를 업데이트해야 함을 나타내는 현재 노드의 레인 업데이트
  // 새로운 텍스크의 레인의 현재 FiberNode에 대한 레인 속성은 현재
  // FiberNode에 해당하는 대체 노드가 비어 있지 않으면
  // 업데이트 중임을 의미하고, 레인은 대체에서 동기적으로 업데이트된다.
  sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane);
  let alternate = sourceFiber.alternate;
  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane);
  }
 ...

  // 현재 업데이트가 필요한 FiberNode에서 루트 광섬유 노드까지 순회하고
  // 각 광섬유 노드의 childLanes를 업데이트한다.
  // 미래에 childLanes는 현재 FiberNode 아래에 업데이트해야 하는
  // 자식 노드가 있는지 확인하는 데 사용된다.

  // 현재 업데이트된 노드에서 Fiber Root Node로 이동하고 각 FiberNode에서
  // childLanes 속성을 업데이트하여 현재 Fiber 아래 자식노드를 업데이트해야 함을
  // 나타낸다.
  let node = sourceFiber;
  let parent = sourceFiber.return;
  while (parent !== null) {
    parent.childLanes = mergeLanes(parent.childLanes, lane);
    alternate = parent.alternate;
    if (alternate !== null) {
      alternate.childLanes = mergeLanes(alternate.childLanes, lane);
    } else {
      if (__DEV__) {
        if ((parent.flags & (Placement | Hydrating)) !== NoFlags) {
          warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber);
        }
      }
    }
    node = parent;
    parent = parent.return;
  }

  // 순회 업데이트가 완료되면 Fiber Root Node가 반환된다.
  if (node.tag === HostRoot) {
    const root: FiberRoot = node.stateNode;
    return root;
  } else {
    return null;
  }
}
```

markUpdateLaneFromFiberToRoot가 실행된 후 markRootUpdated 함수가 호출됩니다. 이 함수의 기능은 현재 업데이트된 레인을 Fiber 루트의 pendingLanes 속성에 추가하여 실행할 새 업데이트 작업이 있음을 표시한 다음 기록하는 것입니다. eventTimes 속성의 이벤트 트리거 시간입니다.

updateLane이 0b000100이라고 가정하면, eventTimes에서 다음과 같은 형식이다.

```text
[-1, -1, 44573.3452, -1， -1...]
```

```js
export function markRootUpdated(
  root: FiberRoot,
  updateLane: Lane,
  eventTime: number
) {
  // 将当前需要更新的lane添加到fiber root的pendingLanes属性上
  root.pendingLanes |= updateLane;

  if (updateLane !== IdleLane) {
    root.suspendedLanes = NoLanes;
    root.pingedLanes = NoLanes;
  }

  // eventTimes는 31비트 바이너리를 사용하는 Lane에
  // 해당하는 31비트 길이의 배열이다.
  const eventTimes = root.eventTimes;
  const index = laneToIndex(updateLane);
  eventTimes[index] = eventTime;
}
```

### ensureRootIsScheduled

markRootUpdated 호출이 완료되면 즉시 ensureRootIsScheduled 함수가 호출되어 작업 예약을 시작할 준비가 됩니다.
ensureRootIsScheduled는 상대적으로 중요한 기능으로, 우선순위가
높은 텍스크 큐 삽입 및 택스크 기아 문제, 일괄 업데이트를 처리합니다.
이 함수가 이러한 문제를 어떻게 처리하는 지 살펴보자.

```js
```

## 동시성 구현을 위한 메커니즘; 양보

브라우저는 랜더링 엔진에게 메인 스레드 점유를 위임하게 되면,
랜더링 과정 중 발생한 사용자 입력에 대해 즉시 처리할 수 없게 됩니다.
리엑트는 이러한 근본적인 원인을 해결하고자 **모든 랜더링을 인터럽트 가능하도록 하여
우선순위가 높은 작업이 텍스크 스택에 들어오면 진행중이던 작업을 중단하고 메인 스레드에게
점유를 양보(yield)할 수 있는 메커니즘을 구현하게 됩니다.**

![When the user's input comes in, rendering is interrupted](./images/react-concurrent-mode/interruption-and-yield.png)

페이스북팀은 **메인 스레드를 점유하여 랜더링 연산을 전개하고 있는 과정에서
사용자의 입력에 대한 처리가 대기 중임을 확인하고 메인 스레드 점유를
양보해야 하는 지에 대해 판단을 할 수 있어야 했고, 이에 대한 메커니즘을
담은 구현체인 [isInputPending](https://wicg.github.io/is-input-pending/)
브라우저 API를 기여하게 됩니다.**

실제로 리엑트의 [Scheduler](https://github.com/facebook/react/blob/main/packages/scheduler/src/forks/Scheduler.js)(스케쥴러) 패키지 코드에는
호스트 환경에 의존적인 API를 사용 가능한지에 대한 플래그들이 존재하고,
어떠한 기준으로 메인 스레드에게 점유를 양보할 것인지에 대한 전개가 담겨있습니다.

### shouldYieldToHost

양보가 필요한 상황인지를 판단하기 위한 첫 검증은 현재 작업을
처리하기 위해 얼마만큼의 시간을 소요했는 지를 확인합니다.
경과된 시간이 frameInterval 값보다 작다면,
메인 스레드는 단일 프레임만큼 아주 짧은 시간동안만 차단되어 있었기 때문에
양보하지 않습니다.

```js
// SchedulerFeatureFlags.js
export const frameYieldMs = 5;
```

```js
import { frameYieldMs } from '../SchedulerFeatureFlags';

let frameInterval = frameYieldMs;

function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;

  if (timeElapsed < frameInterval) {
    return false;
  }
  ...
}
```

이후의 스코프에서는 메인 스레드가 무시할 수 없는 시간 동안 차단되었을 때
보류 중인 페인트 혹은 사용자 입력 작업이 존재한다면,
브라우저가 높은 우선 순위 작업을 수행할 수 있도록 메인 스레드에
대한 제안 권한을 양보합니다.

```js
// Scheduler.js
let needsPaint = false;

function requestPaint() {
  if (
    enableIsInputPending &&
    navigator !== undefined &&
    navigator.scheduling !== undefined &&
    navigator.scheduling.isInputPending !== undefined
  ) {
    needsPaint = true;
  }
}

function shouldYieldToHost() {
  ...
  if (enableIsInputPending) {
    if (needsPaint) {
      return true;
    }
  }
  ...
}
```

여기서, requestPaints()를 호출하는 곳 중 하나인 reconciler(리콘실러)는
**VDOM의 변경사항을 DOM에 모두 커밋하고 나서 requestPaints() 를 통해
페인트 작업이 필요하다는 것을 스케쥴러에게 전달하게 됩니다.**

```js
// ReactFiberWorkLoop.new.js
import { requestPaint } from './Scheduler';

function commitRootImpl(...) {
  ...
  requestPaint();
}
```

다음으로는 경과된 시간이 연속적인 입력 간격보다 짧은 지 검증합니다.
isInputPending은 단순히 모든 사용자 이벤트를 동일하게 처리하지 않고,
[연속적인(continuous) 이벤트]([연속적인 이벤트(Continuous events)](https://wicg.github.io/is-input-pending/#continuous-events))(e.g. click)와 분리된(discrete) 이벤트(e.g. mouseover)를 구분지어 **연속적인 이벤트에 대해 너무 자주 양보하게 되는 것을 막습니다.**

가령 문서를 읽을 때, 시선의 흐름을 마우스 포인터의 이동으로 따라가는 것이
일반적으로 사용자에게 성능에 대한 영향을 주지 않을 것으로 예상하기 때문에
기본적으로 이러한 이벤트들은 isInputPending의 검증 대상에서 제외됩니다.

즉 이 검증 단계에서는, 연속적인 이벤트에 대한 처리 작업을 즉시 시작하지 않을 간격을 두고,
그 시간 동안에는 판단을 온전히 브라우저에게 맡깁니다.

```js
// SchedulerFeatureFlags.js
export const continuousYieldMs = 50;
```

```js
import { continuousYieldMs } from '../SchedulerFeatureFlags'

const continuousInputInterval = continuousYieldMs;

const isInputPending =
  typeof navigator !== 'undefined' &&
  navigator.scheduling !== undefined &&
  navigator.scheduling.isInputPending !== undefined
    ? navigator.scheduling.isInputPending.bind(navigator.scheduling)
    : null;

function shouldYieldToHost() {
  ...
  if (timeElapsed < continuousInputInterval) {
    if (isInputPending !== null) {
      return isInputPending();
    }
  }
  ...
}
```

마지막으로 최대 간격 이내에 보류 중인 연속적이거나, 분리된 모든 이벤트에 대해
양보합니다. 이후 모든 분기 처리가 담지 못한 케이스에 대해서는,
보류 중인 입력이 없더라도 네트워크 이벤트와 같은 알지 못하는 다른 작업들이
대기 중일 수 있다는 가정하에 무조건적으로 양보합니다.

```js
// SchedulerFeatureFlags.js
export const maxYieldMs = 300;
```

```js
import { maxYieldMs } from '../SchedulerFeatureFlags'

function shouldYieldToHost() {
    ...
    else if (timeElapsed < maxInterval) {
      // Yield if there's either a pending discrete or continuous input.
      if (isInputPending !== null) {
        return isInputPending(continuousOptions);
      }
    } else {
      return true;
    }
  }

  return true;
}
```

초기에 분기처리 되었던 호스트 환경에 의존적인 isInputPending API를
사용할 수 없는 경우 또한 무조건적으로 양보합니다.

```js
function shouldYieldToHost() {
  ...
  if (enableIsInputPending) {
    ...
  }

  return true;
}
```

지금까지 알아본 shouldYieldToHost는 스케쥴러의 [workLoop](https://github.com/facebook/react/blob/main/packages/scheduler/src/forks/Scheduler.js#L189)에서 사용됩니다. 현재 진행 중인 작업의 만료시간이 현재 시간에 비해 여유가 있는 시점에서
우선 순위가 더 높은 작업이 보류되고 있다면, 메인 스레드에게 제어권을 양보하고, 만료 시간이
지난 작업에 대해서는 양보하지 않고 동기적으로 바쁘게 작업을 이어나갑니다.

```js
// Scheduler.js
function workLoop(hasTimeRemaining, initialTime) {
  ...
  while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused)
  ) {
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      break;
    }
  ...
  }
}
```

추가적으로 스케쥴러가 아닌, 동시성 모드에서 컴포넌트를 재조정하는 작업이 담긴
[workLoopConcurrent](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1836)
에서도 사용되는데요. shouldYield를 통해 진행되던 재조정 작업이
중지될 수 있음이 조건에 담겨있습니다.

```js
// ReactFiberWorkLoop.new.js
import { shouldYield } from './Scheduler';
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

이를 통해 리콘실러는 workLoopConcurrnet를 통해 현재 작업중이던 루트 혹은 레일(lane)이
변경되면, 루트에 대기중인 작업들을 모두 비우고, 변경된 레인의 작업이 진행될 수 있도록 합니다.
(여기서, 레인은 두 가지 이상의 논리적 통제를 다루는 컨텍스트를 의미하는 것 같습니다.
마치 고속도로의 차선 처럼요.)

```js
function renderRootConcurrent(root: FiberRoot, lanes: Lanes) {
  const prevExecutionContext = executionContext;
  executionContext |= RenderContext;
  const prevDispatcher = pushDispatcher();

  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    ...
        const memoizedUpdaters = root.memoizedUpdaters;
        if (memoizedUpdaters.size > 0) {
          restorePendingUpdaters(root, workInProgressRootRenderLanes);
          memoizedUpdaters.clear();
        }

        movePendingFibersToMemoized(root, lanes);
      }
    }
  }
  ...

  do {
    try {
      workLoopConcurrent();
      ...
    }
  }
```

<!-- ### Lane

## 동시성 구현을 위한 메커니즘; 이벤트 루프 중단

### render

### schedulePerformWorkUntilDeadline

### messageChannel을 통한 performWorkUntilDeadline 콜백 함수 호출

### flushWork

### flushWork 루프가 돔

### 이후 작업에 대해 cpu가 10ms을 할당해 주었다면, 10ms이 지나면 탈출

### 다시 fluskWork에서 남은 작업이 있는 지 확인

### 남은 작업이 있으면 schedulePerformWorkUntilDeadline 호출

### workLoopConcurrent는 주어진 시간만큼 작업 처리 -->

<!-- 지금까지 알아본 양보를 구현하기 위한 메커니즘은 중단을 발생시키기 위한
플래그로서 사용됩니다. 양보가 필요한지에 대한 판단을 통해 어떻게
메인 스레드를 블로킹하지 않는 WorkLoop를 구현했는 지 살펴봅시다.

reactDOMRoot.render를 호출하게 되면, 작업을 예약합니다.
작업이 예약되게 되면, 예약된 작업에 끝에서 이벤트 루프를 호출합니다.

이벤트 루프가 시작될 때, schedulePerformWorkUntilDeadline 이라는 함수가
호출됩니다. 이 메서드를 잠시 기억하자.

여기서 메세지 채널을 통해 performWorkUntilDeadline과 통신하게 됩니다.
performWorkUntilDeadline은 메세지 체널의 콜백함수로서 호출된다.

그리고, performWorkUntilDeadline에서 필요한 일을 flushWork 한다.
그러면 flush된 flushwork안쪽에서는 루프가 돌게 된다.

에를 들어 cpu가 10ms을 작업의 할당한다면 10ms이 지나면 탈출,
그리고 flushWork에서 남은 작업이 있는 지 확인
만약, 남은 작업이 있다면 다시 schedulePerformWorkUntilDeadline를 호출한다.

workLoopConcurrent는 주어진 시간만큼 작업을 처리하는 것이다.

이렇게 해서 스레드를 블로킹하지 않는 루프를 구현
메인 스레드에게 양보하기 위한 방법 -->

<!-- reactDOMRoot.render를 호출하게 되면, 작업을 예약합니다.
작업이 예약되게 되면, 예약된 작업에 끝에서 이벤트 루프를 호출합니다.

이벤트 루프가 시작될 때, schedulePerformWorkUntilDeadline 이라는 함수가
호출됩니다. 이 메서드를 잠시 기억하자.

여기서 메세지 채널을 통해 performWorkUntilDeadline과 통신하게 됩니다.
performWorkUntilDeadline은 메세지 체널의 콜백함수로서 호출된다.

그리고, performWorkUntilDeadline에서 필요한 일을 flushWork 한다.
그러면 flush된 flushwork안쪽에서는 루프가 돌게 된다.

에를 들어 cpu가 10ms을 작업의 할당한다면 10ms이 지나면 탈출,
그리고 flushWork에서 남은 작업이 있는 지 확인
만약, 남은 작업이 있다면 다시 schedulePerformWorkUntilDeadline를 호출한다.

workLoopConcurrent는 주어진 시간만큼 작업을 처리하는 것이다.

이렇게 해서 스레드를 블로킹하지 않는 루프를 구현
메인 스레드에게 양보하기 위한 방법

컴포넌트를 순회하면서 메인스레드를 블로킹하지 않는 방법은
Fiber 아키텍처가 가지고 있다.

Fiber는 랜더링 작업을 미세하게 분할한다.
자바스크립트 스택을 사용하지 않고 작업을 힙 객체에 펼친다.
훅의 대수효과를 지원하기 위한 기반이 된다.

파이버 아키텍처를 적용한 리엑트의 랜더링과정은
더블 버퍼 모델과 유사하다. 프론트 버퍼가 화면을 출력하는 동안,
백 버퍼가 다음에 그려질 내용을 그려내면서 두 버퍼가 스위칭되며
랜더링한다.

createRoot를 호출하면 FiberRootNode를 형성한다.
이건 모든 노드의 루트 노드가 된다.

FiberRootNode의 current를 번갈아가며 변경하면서
순회 작업을 진행한다. 순회 작업이 마무리되면 current를
완료된 버퍼를 가르켜 스왑한다.

## 동시성 구현을 위한 메커니즘; 중단

랜더러(renderer) 레이어에서 랜더링 작업이 시작되면 재귀적인 작업으로 중단이 불가능합니다.
리엑트팀은 중단 메커니즘을 구현하기 위해 랜더러가 작업을 시작하기 전 단계인
리콘실러 작업 단계에서 중단할 수 있도록 구현해야 했습니다.

결국, 중단 메커니즘은 리콘실러에 많은 로직이 담겨있습니다. -->

<!-- 직접 스케쥴러를 만듦 -->
<!-- performUntilWork() -->

 <!-- ============== Lagacy ===========

우선 순위는 react18에서 새롭게 정의된 useTransition을 통해
정의할 수 있습니다.

react 공식문서 데모에서는 input 컴포넌트의 변화 랜더링, 목록 컴포넌트 랜더링
이 두가지 작업의 우선 순위를 구분지었다.

input 컴포넌트의 변화 랜더링은 즉각적으로 적용되어야 하는 랜더링이며,
목록 컴포넌트 랜더링은 상대적으로 급하지 않은 랜더링이다.

블로킹 랜더링은 1차선 도로이다. 컴포넌트 갱신이 많아지면 CPU의 점유율이 높아지면서
D, E의 랜더링을 해결할 수 없다.

동시성 랜더링은 2차선 도로라고 생각해보자.

동시성 랜더링에서도 마찬가지로 A, B라는 작업을 진행한다고 생각해보자.

A에 대한 작업을 진행하다가 메인 쓰레드에게 일정시간 양보한다. (yield)

동시성 랜더링은 이전에 언급한 것처럼 하나의 컴포넌트의 랜더링을 잘개 쪼개어 작업한다.
C의 작업이 마무리되기 전에 D에 대한 입력이 들어오면 C의 작업보다 우선순위가 높은 'D에 대한 입력'을 먼저 처리하게 된다.
즉, 리스트 랜더링보다는 우선순위가 높은 'D에 대한 입력 처리'를 먼저 진행하게 된다.

그리고, pending 상태에 있었던 낮은 순위 랜더링을 리베이스(git branch의 베이스 지점을 끌어올리는 듯한 동작)을 수행한다.

두 개의 차선에서 하나는 고속 하나는 저속으로 보고 리엑트에서는 이를 lane 이라고 말한다.

## 동시성 랜더링을 위한 API

동시성 모드는 기능 단위로 점진적으로 채택될 수 있도록 리엑트는
동시성 기능을 추가하였습니다. 단순히 createRoot를 사용한다고 해서
동시성 모드가 켜지는 것이 아닌, 동시성 기능을 사용했을 때
동시성 모드가 유효해집니다.

startTransition은 느린 차선의 lane을 만들어 주는 API 이다.

startTransition의 콜백 함수를 전달하면 수도 코드에서 확인할 수 있듯이
낮은 우선순위를 갖게 된다.

startTransition은 바로 실행된다????

이렇게 낮은 우선순위를 부여받으면 보다 중요한 CPU 사용처에 양보를 할 수 있다.

대규모 화면 업데이트 중 응답성을 유지할 수 있고, 상태 전환 중에 시각적 피드백을 제공할 수 있다.

[deview2021/concurrent](https://ajaxlab.github.io/deview2021/concurrent)
를 통해 블로킹 랜더링과 비교해보자.

concurrent에서는 짧은 여러개의 스택이 반복적으로 수행되고 있는 것을 확인할 수 있다.

## urgent update vs transition update

그 구분은 어떻게 지어야 할까, 사용자가 오래걸릴 것이라고 예상되는 것들
하나의 view에서 다른 view로 전환되거나, 전환되는 중간과정이 스킵되어도 문제가 없는 것 (load, refresh)

## HCI 연구 결과가 실제 Ui에 통합되도록 돕는 것

화면 간 전환에서 로딩 중 상태를 너무 많이 표시하면 UX 품질이 낮아짐
빠르게 처리되기 기대하는 상호작용과 느려도 문제없는 상호작용
동시성 모드의 목적은 HCI 연구 결과를 추상화하고 구현할 수 있는 방법을 제공하는 것이다.

HCI 연구 결과 확인해보기

## Reference

[Inside React(동시성을 구현하는 기술)](https://tv.naver.com/v/23652451)

[https://github.com/neroneroffy/react-source-code-debug](https://github.com/neroneroffy/react-source-code-debug)
