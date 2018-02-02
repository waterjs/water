export function _create(tagName) {
  return () => document.createElement(tagName);
}

export function _append(parentNode, childrenNode) {
  [].concat(childrenNode).forEach(childNode => parentNode.appendChild(childNode));
}