// @ts-ignore
import SmoothScroll from 'smooth-scroll/dist/smooth-scroll.min';
import smoothscroll from 'smoothscroll-polyfill';

let scroll: SmoothScroll | null = null;

export function init(): SmoothScroll {
  smoothscroll.polyfill();
  scroll = new SmoothScroll('a[href*="#"]', {
    speed: 500,
    speedAsDuration: true,
  });
  return scroll;
}

export function destroy(): SmoothScroll | null {
  if (!scroll) throw Error('Not founded SmoothScroll instance');

  scroll.destroy();
  scroll = null;

  return scroll;
}

export function go(dest: number): SmoothScroll {
  if (!scroll) throw Error('Not founded SmoothScroll instance');

  scroll.animateScroll(dest);

  return scroll;
}
