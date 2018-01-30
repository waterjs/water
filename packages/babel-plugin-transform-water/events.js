import camelCase from 'lodash.camelcase';

export const events = [
  'click'
];

export function toEventHandlerIdentifier(attribute) {
  return attribute.toLocaleLowerCase();
}

export function isEventHandlerAttribute(attribute) {
  return events.includes(attribute.replace(/^on/, '').toLocaleLowerCase());
}