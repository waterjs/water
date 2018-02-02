import JSX from '@babel/plugin-syntax-jsx';
import {
  isEventHandlerAttribute,
  toEventHandlerIdentifier,
} from './events';
import {
  capitalize,
  isCapitalized,
} from './helpers';

export default ({ types: t, template }) => {
  const buildCreateElementByFunction = template(`
    const VARIABLE_IDENTIFIER = TAG_NAME(ATTRIBUTES);
  `);

  const buildCreateElementByDOM = ({BUILDER_NAME, VARIABLE_IDENTIFIER, TAG_NAME}, builtinFunctions) => {
    builtinFunctions.add('_create');
    return template(`
      const BUILDER_NAME = _create(TAG_NAME);
      const VARIABLE_IDENTIFIER = BUILDER_NAME();
    `)({ BUILDER_NAME, VARIABLE_IDENTIFIER, TAG_NAME });
  };

  const buildCreateElementsByExpression = template(`
    const VARIABLE_IDENTIFIER = (() => EXPRESSION)();
  `);

  const buildAppendChildren = ({PARENT_NODE, CHILDREN_NODE}, builtinFunctions) => {
    builtinFunctions.add('_append');
    return template(`
      _append(PARENT_NODE, CHILDREN_NODE);
    `)({ PARENT_NODE, CHILDREN_NODE });
  };

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

  const visitor = {};

  visitor.JSXElement = function (path, state) {
    const { currentStatement, parentIdentifier, builtinFunctions } = state;
    state.isInElement = true;
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
      const builderName = path.scope.generateUidIdentifier(capitalize(tagName));
      targetStatement.insertBefore(buildCreateElementByDOM({
        VARIABLE_IDENTIFIER: variableIdentifier,
        BUILDER_NAME: builderName,
        TAG_NAME: t.stringLiteral(tagName),
      }, builtinFunctions));
    }
    if (parentIdentifier) {
      targetStatement.insertBefore(buildAppendChildren({
        PARENT_NODE: parentIdentifier,
        CHILDREN_NODE: variableIdentifier,
      }, builtinFunctions));
    }
    path.traverse(visitor, { parentIdentifier: variableIdentifier, currentStatement: targetStatement, builtinFunctions });
    path.replaceWith(variableIdentifier);
  };

  visitor.JSXAttribute = function (path, { currentStatement, parentIdentifier }) {
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

    path.skip();
  };

  visitor.JSXExpressionContainer = {
    enter (path, state) {
      const { currentStatement, parentIdentifier, builtinFunctions } = state;
      const variableIdentifier = path.scope.generateUidIdentifier('block');
      currentStatement.insertBefore(buildCreateElementsByExpression({
        VARIABLE_IDENTIFIER: variableIdentifier,
        EXPRESSION: path.get('expression').node,
      }));
      currentStatement.insertBefore(buildAppendChildren({
        PARENT_NODE: parentIdentifier,
        CHILDREN_NODE: variableIdentifier,
      }, builtinFunctions));
      state.currentStatement = null;
      state.parentIdentifier = null;
    },

    exit (path, state) {
    },
  };

  visitor.ArrowFunctionExpression = function (path) {
    const body = path.get('body');

    if (body.isJSXElement()) {
      body.replaceWith(
        t.blockStatement([
          t.returnStatement(path.node.body),
        ])
      );
    }
  };

  visitor.Program = {
    enter (path, state) {
      state.builtinFunctions = new Set();
    },

    exit (path, { builtinFunctions }) {
      if (builtinFunctions.size) {
        const waterImportDeclaration = t.importDeclaration([...builtinFunctions].map(f => t.importSpecifier(t.identifier(f), t.identifier(f))), t.stringLiteral('water'));
        path.unshiftContainer('body', waterImportDeclaration);
      }
    },
  };

  return {
    inherits: JSX,
    visitor,
  };
};
