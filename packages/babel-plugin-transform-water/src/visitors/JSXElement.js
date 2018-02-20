import * as t from '@babel/types';
import {
  AppendChildrenExpressionBuilder,
  CreateDOMNodeExpressionBuilder,
  DecorateComponentExpressionBuilder,
  RenderElementExpressionBuilder,
} from '../builders';
import {
  isCapitalized,
} from '../helpers';

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

function decorate (renderFunctionPath) {
  renderFunctionPath.replaceWith(
    new DecorateComponentExpressionBuilder()
      .withRender(renderFunctionPath.node)
      .build()
  );
}

export default visitor => ({
  enter (path, state) {
    const { currentStatement, parentIdentifier } = state;
    const targetStatement = currentStatement || path.getStatementParent();
    const openingElement = path.get('openingElement');
    const tagName = openingElement.get('name').node.name;
    const variableIdentifier = path.scope.generateUidIdentifier(tagName);
    const attributes = openingElement.get('attributes');
    let componentName = null;

    reduceAttributes(attributes);

    if (isCapitalized(tagName)) {
      componentName = tagName;
      targetStatement.insertBefore(
        new RenderElementExpressionBuilder()
          .withComponent(t.identifier(tagName))
          .withVariable(variableIdentifier)
          .withAttributes(attributes)
          .build()
      );
    } else {
      targetStatement.insertBefore(
        new CreateDOMNodeExpressionBuilder()
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
    path.traverse(visitor, { parentIdentifier: variableIdentifier, currentStatement: targetStatement, componentName });
    if (!parentIdentifier) {
      decorate(path.getFunctionParent());
    }
    path.replaceWith(variableIdentifier);
  },
});
