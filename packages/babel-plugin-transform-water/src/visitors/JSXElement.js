import * as t from '@babel/types';
import {
  AppendChildrenExpressionBuilder,
  CreateDOMNodeExpressionBuilder,
  CreateElementExpressionBuilder,
} from '../builders';
import {
  isCapitalized,
} from '../helpers';

const buildJSXElementVariableIdentifier = path =>
  path.scope.generateUidIdentifier(path.node.openingElement.name.name);

const reduceAttributes = attributes => {
  const attributeNames = new Set();
  attributes.slice().reverse().forEach(attribute => {
    if (!attribute.isJSXAttribute()) {
      return;
    }

    const attributeName = attribute.get('name').get('name').node;
    if (attributeNames.has(attributeName)) {
      attribute.remove();
    }

    attributeNames.add(attributeName);
  });
};

export default visitor => (path, state) => {
  const { currentStatement, parentIdentifier } = state;
  const targetStatement = currentStatement || path.findParent(parentPath => parentPath.isStatement());
  const openingElement = path.get('openingElement');
  const variableIdentifier = buildJSXElementVariableIdentifier(path);
  const tagName = openingElement.get('name').node.name;
  const attributes = openingElement.get('attributes');
  reduceAttributes(attributes);

  if (isCapitalized(tagName)) {
    state.isInComponent = true;
    targetStatement.insertBefore(
      new CreateElementExpressionBuilder()
        .withVariable(variableIdentifier)
        .withComponentName(tagName)
        .withAttributes(attributes)
        .build()
    );
  } else {
    state.isInComponent = false;
    targetStatement.insertBefore(
      new CreateDOMNodeExpressionBuilder()
        .withScope(path.scope)
        .withTagName(t.stringLiteral(tagName))
        .withVariable(variableIdentifier)
        .build()
    );
  }
  if (parentIdentifier) {
    targetStatement.insertBefore(
      new AppendChildrenExpressionBuilder()
        .withParent(parentIdentifier)
        .withChildren(variableIdentifier)
        .build()
    );
  }
  path.traverse(visitor, { parentIdentifier: variableIdentifier, currentStatement: targetStatement, isInComponent: state.isInComponent, tagName, attributes });
  path.replaceWith(variableIdentifier);
};
