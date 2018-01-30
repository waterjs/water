import JSX from '@babel/plugin-syntax-jsx';

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

  const buildJSXElementVariableIdentifier = path =>
    `${path.node.openingElement.name.name}_${path.node.start}_${path.node.end}`

  const JSXOpeningElementVisitor = {
    JSXAttribute(path, { currentStatement, variableIdentifier }) {
      currentStatement.insertBefore(buildSetAttribute({
        VARIABLE_IDENTIFIER: t.identifier(variableIdentifier),
        ATTRIBUTE: t.stringLiteral(path.node.name.name),
        VALUE: t.stringLiteral(path.node.value.value)
      }));
    },
  }

  const JSXElementVisitor = {
    JSXElement(path, { currentStatement, parentIdentifier }) {
      const tagName = path.node.openingElement.name.name;
      const variableIdentifier = buildJSXElementVariableIdentifier(path);
      currentStatement.insertBefore(buildCreateElement({
        VARIABLE_IDENTIFIER: t.identifier(variableIdentifier),
        TAG_NAME: t.stringLiteral(tagName),
      }));
      if (parentIdentifier) {
        currentStatement.insertBefore(buildAppendChild({
          PARENT_NODE: t.identifier(this.parentIdentifier),
          CHILD_NODE: t.identifier(variableIdentifier),
        }));        
      }
      path.get('openingElement').traverse(JSXOpeningElementVisitor, { currentStatement, variableIdentifier });
      path.get('children').forEach(childPath => childPath.parentPath.traverse(JSXElementVisitor, { currentStatement, parentIdentifier: variableIdentifier }));
      path.replaceWith(t.identifier(variableIdentifier));
    },
  }

  const visitor = {
    ArrowFunctionExpression(path) {
      const body = path.get('body');

      if (t.isJSXElement(body)) {
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