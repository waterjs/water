export function _create(tagName) {
  return () => document.createElement(tagName);
}

export function _append(parentNode, childNodes) {
  [].concat(childNodes).forEach(childNode => parentNode.appendChild(childNode));
}

export function _attr(node, attribute, value) {
  if (!value) {
    node.removeAttribute(attribute);
  } else {
    node.setAttribute(attribute, value);
  }
}

export function _replaceNode(newNode, oldNode) {
  oldNode.parentNode.replaceChild(newNode, oldNode);
}

export function _replaceBlock(newChildren, oldChildren) {
  const commentNode = oldChildren.slice(-1)[0];
  const parentNode = commentNode.parentNode;
  [...newChildren].forEach(childNode => parentNode.insertBefore(childNode, commentNode))
  oldChildren.forEach(node => parentNode.removeChild(node));
}