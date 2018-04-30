import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Scheduler } from 'rxjs/Scheduler'

import { fromEvent } from 'rxjs/observable/fromEvent'
import { merge } from 'rxjs/observable/merge'
import { timer } from 'rxjs/observable/timer'
import { of } from 'rxjs/observable/of'
import { empty } from 'rxjs/observable/empty'
import { take, debounceTime, switchMap, skip, throttleTime, share } from 'rxjs/operators'

const passiveOpts = { passive: true, capture: false }
const getResize$Value = () => ({
  width: document.body.scrollWidth,
  height: document.body.scrollHeight,
  computedStyle: window.getComputedStyle(document.body)
})

class OnResize$ extends BehaviorSubject {
  constructor() {
    super(getResize$Value())

    window.addEventListener(
      'resize',
      () => this.next(getResize$Value()),
      passiveOpts
    )
  }
}

export const resize$ = new OnResize$().pipe(skip(1))
export const isScrolling$ = new BehaviorSubject(false)

export const animationFrame$ = of(void 0, Scheduler.animationFrame).pipe(take(1))

export const scroll$ = merge(
  fromEvent(window, 'scroll', passiveOpts),
  fromEvent(window, 'touchmove', passiveOpts).pipe(debounceTime(100)),
  fromEvent(window, 'touchend', passiveOpts).pipe(
    switchMap(() =>
      timer(0, 500, Scheduler.animationFrame).pipe(take(15))
    )
  )
).pipe(share())

export const scrollDone$ = scroll$.pipe(debounceTime(100))

scroll$.pipe(throttleTime(100)).subscribe(() => {
  if (isScrolling$.value === false) {
    isScrolling$.next(true)
  }
})

scrollDone$.subscribe(() => {
  if (isScrolling$.value === true) {
    isScrolling$.next(false)
  }
})
