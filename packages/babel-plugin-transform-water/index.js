import JSX from '@babel/plugin-syntax-jsx';

export default ({ types: t, template }) => {
  const buildCreateElement = template(`
    const root = document.createElement(TAG_NAME);
  `);
  
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

    JSXElement(path) {
      const tagName = path.node.openingElement.name.name;
      path.parentPath.insertBefore(buildCreateElement({ TAG_NAME: t.stringLiteral(tagName) }));
      path.replaceWith(t.identifier('root'));
    }
  };

  return {
    inherits: JSX,
    visitor,
  };
}