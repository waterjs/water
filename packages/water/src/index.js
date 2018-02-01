export function _append(parentNode, childrenNode) {
  [].concat(childrenNode).forEach(childNode => parentNode.appendChild(childNode.cloneNode()));
}