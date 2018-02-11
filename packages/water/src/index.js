export function _create(tagName) {
  return () => document.createElement(tagName);
}

export function _append(parentNode, childrenNode) {
  [].concat(childrenNode).forEach(childNode => parentNode.appendChild(childNode));
}

export function _attr(node, attribute, value) {
  if (!value) {
    node.removeAttribute(attribute);
  } else {
    node.setAttribute(attribute, value);
  }
}