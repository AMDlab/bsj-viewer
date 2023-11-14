export const remToPx = (dom: Element, rem: number) => {
  const fontSize = getComputedStyle(dom).fontSize;
  return rem * parseFloat(fontSize);
};
