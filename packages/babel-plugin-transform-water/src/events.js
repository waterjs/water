export const events = [
  // Mouse Events
  'click',
  'contextMenu',
  'doubleClick',
  'drag',
  'dragEnd',
  'dragEnter',
  'dragExit',
  'dragLeave',
  'dragOver',
  'dragStart',
  'drop',
  'mouseDown',
  'mouseEnter',
  'mouseLeave',
  'mouseMove',
  'mouseOut',
  'mouseOver',
  'mouseUp',

  // Form Events
  'change',
  'input',
  'invalid',
  'submit',
];

export function toEventHandlerIdentifier (attribute) {
  return attribute.toLocaleLowerCase();
}

export function isEventHandlerAttribute (attribute) {
  return events.includes(attribute.replace(/^on/, '').toLocaleLowerCase());
}
