import JSX from '@babel/plugin-syntax-jsx';
import {
  isEventHandlerAttribute,
  toEventHandlerIdentifier,
} from './events';
import { isCapitalized } from './helpers';

export default ({ types: t, template }) => {
  const buildCreateElementByFunction = template(`
    const VARIABLE_IDENTIFIER = TAG_NAME(ATTRIBUTES);
  `);

  const buildCreateElementByDOM = template(`
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

  const transformAttributesToObjectProperties = attributes =>
    attributes.map(attribute => t.objectProperty(t.identifier(attribute.name.name), attribute.value));

  const mainVisitor = {};

  const JSXElement = mainVisitor.JSXElement = function (path, { currentStatement, parentIdentifier }) {
    const targetStatement = currentStatement || path.findParent(parentPath => parentPath.isStatement());

    const openingElement = path.get('openingElement');
    const variableIdentifier = buildJSXElementVariableIdentifier(path);
    const tagName = openingElement.get('name').node.name;

    if (isCapitalized(tagName)) {
      targetStatement.insertBefore(buildCreateElementByFunction({
        VARIABLE_IDENTIFIER: variableIdentifier,
        TAG_NAME: t.identifier(tagName),
        ATTRIBUTES: t.objectExpression(transformAttributesToObjectProperties(openingElement.node.attributes)),
      }));
    } else {
      targetStatement.insertBefore(buildCreateElementByDOM({
        VARIABLE_IDENTIFIER: variableIdentifier,
        TAG_NAME: t.stringLiteral(tagName),
      }));
    }
    if (parentIdentifier) {
      targetStatement.insertBefore(buildAppendChild({
        PARENT_NODE: parentIdentifier,
        CHILD_NODE: variableIdentifier,
      }));
    }
    path.traverse(mainVisitor, { parentIdentifier: variableIdentifier, currentStatement: targetStatement });
    path.replaceWith(variableIdentifier);
  };

  mainVisitor.JSXAttribute = function (path, { currentStatement, parentIdentifier }) {
    let attributeValue;
    let hydration;
    const name = path.node.name.name;
    const value = path.get('value');

    if (value.isStringLiteral()) {
      attributeValue = t.stringLiteral(path.node.value.value);
    } else if (value.isJSXExpressionContainer()) {
      attributeValue = value.get('expression').node;
    }

    if (isEventHandlerAttribute(name)) {
      currentStatement.insertBefore(buildEventHandler({
        VARIABLE_IDENTIFIER: parentIdentifier,
        FUNCTION: t.identifier(toEventHandlerIdentifier(name)),
        HANDLER: attributeValue,
      }));
    } else {
      hydration = buildSetAttribute({
        VARIABLE_IDENTIFIER: parentIdentifier,
        ATTRIBUTE: t.stringLiteral(name),
        VALUE: attributeValue,
      });
      currentStatement.insertBefore(hydration);
    }

    if (value.isJSXExpressionContainer()) {
      const bindings = value.get('expression').scope.bindings;

      Object.keys(bindings).forEach(binding => {
        bindings[binding].constantViolations.forEach(violationPath => {
          violationPath.insertAfter(hydration);
        });
      });
    }
  };

  const topVisitor = {
    ArrowFunctionExpression (path) {
      const body = path.get('body');

      if (body.isJSXElement()) {
        body.replaceWith(
          t.blockStatement([
            t.returnStatement(path.node.body),
          ])
        );
      }
    },

    JSXElement,
  };

  return {
    inherits: JSX,
    visitor: topVisitor,
  };
};
