const BODY = 'body';

export const getElements = (selector: string): NodeListOf<Element> =>
  document.querySelectorAll(selector);
export const getElement = (selector: string): Element | null =>
  document.querySelector(selector);
export const addClass = (element: Element | null, className: string): void => {
  if (element) {
    element.classList.add(className);
  }
};
export const removeClass = (
  element: Element | null,
  className: string
): void => {
  if (element) {
    element.classList.remove(className);
  }
};
export const hasClass = (
  element: Element | null,
  className: string
): boolean => {
  if (!element) return false;
  return element.classList.contains(className);
};
export const getBody = (): Element | null => getElement(BODY);
export const addClassToBody = (className: string): void =>
  addClass(getBody(), className);
export const removeClassToBody = (className: string): void =>
  removeClass(getBody(), className);
export const hasClassOfBody = (className: string): boolean =>
  hasClass(getBody(), className);
export const getRect = (className: string): DOMRect => {
  const element = getElement(className);
  if (!element) {
    throw new Error(`Element with class ${className} not found`);
  }
  return element.getBoundingClientRect();
};
export const getPosY = (className: string): number => getRect(className).y;

export const getDocumentHeight = (): number =>
  document.documentElement.offsetHeight;
