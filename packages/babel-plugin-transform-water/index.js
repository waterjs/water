import JSX from '@babel/plugin-syntax-jsx';
import {
  isEventHandlerAttribute,
  toEventHandlerIdentifier,
} from './events';

export default ({ types: t, template }) => {
  const buildCreateElement = template(`
    const VARIABLE_IDENTIFIER = document.createElement(TAG_NAME);
  `);

  const buildAppendChild = template(`
    PARENT_NODE.appendChild(CHILD_NODE);
  `);

  const buildSetAttribute = template(`
    VARIABLE_IDENTIFIER.setAttribute(ATTRIBUTE, VALUE);
  `);

  const buildEventHandler = template(`
    VARIABLE_IDENTIFIER.FUNCTION = HANDLER;
  `);

  const buildJSXElementVariableIdentifier = path =>
    path.scope.generateUidIdentifier(path.node.openingElement.name.name);

  const JSXOpeningElementVisitor = {
    JSXAttribute(path, { currentStatement, variableIdentifier }) {
      let attributeValue;
      const name = path.node.name.name;
      const value = path.get('value');

      if (value.isStringLiteral()) {
        attributeValue = t.stringLiteral(path.node.value.value);
      } else if (value.isJSXExpressionContainer()) {
        attributeValue = value.get('expression').node;
      }

      if (isEventHandlerAttribute(name)) {
        currentStatement.insertBefore(buildEventHandler({
          VARIABLE_IDENTIFIER: variableIdentifier,
          FUNCTION: t.identifier(toEventHandlerIdentifier(name)),
          HANDLER: attributeValue,
        }));
      } else {
        currentStatement.insertBefore(buildSetAttribute({
          VARIABLE_IDENTIFIER: variableIdentifier,
          ATTRIBUTE: t.stringLiteral(name),
          VALUE: attributeValue,
        }));
      }
    },
  }

  const JSXElementVisitor = {
    JSXElement(path, { currentStatement, parentIdentifier }) {
      const openingElement = path.get('openingElement');
      const tagName = openingElement.get('name').node.name;
      const variableIdentifier = buildJSXElementVariableIdentifier(path);
      currentStatement.insertBefore(buildCreateElement({
        VARIABLE_IDENTIFIER: variableIdentifier,
        TAG_NAME: t.stringLiteral(tagName),
      }));
      if (parentIdentifier) {
        currentStatement.insertBefore(buildAppendChild({
          PARENT_NODE: parentIdentifier,
          CHILD_NODE: variableIdentifier,
        }));
      }
      openingElement.traverse(JSXOpeningElementVisitor, { currentStatement, variableIdentifier });
      path.get('children').forEach(childPath => childPath.parentPath.traverse(JSXElementVisitor, { currentStatement, parentIdentifier: variableIdentifier }));
      path.replaceWith(variableIdentifier);
    },
  }

  const visitor = {
    ArrowFunctionExpression(path) {
      const body = path.get('body');

      if (body.isJSXElement()) {
        body.replaceWith(
          t.blockStatement([
            t.returnStatement(path.node.body)
          ])
        );
      }
    },

    JSXElement(path, state) {
      const currentStatement = path.findParent(parentPath => parentPath.isStatement());
      path.parentPath.traverse(JSXElementVisitor, { currentStatement });
    }
  };

  return {
    inherits: JSX,
    visitor,
  };
}
