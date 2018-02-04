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

export default visitor => (path, state) => {
  const { currentStatement, parentIdentifier } = state;
  const targetStatement = currentStatement || path.findParent(parentPath => parentPath.isStatement());
  const openingElement = path.get('openingElement');
  const variableIdentifier = buildJSXElementVariableIdentifier(path);
  const tagName = openingElement.get('name').node.name;

  if (isCapitalized(tagName)) {
    state.isInComponent = true;
    targetStatement.insertBefore(
      new CreateElementExpressionBuilder()
        .withVariable(variableIdentifier)
        .withComponentName(tagName)
        .withAttributes(openingElement.node.attributes)
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
  path.traverse(visitor, { parentIdentifier: variableIdentifier, currentStatement: targetStatement, isInComponent: state.isInComponent });
  path.replaceWith(variableIdentifier);
};
