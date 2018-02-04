import * as t from '@babel/types';

export default (path) => {
  const body = path.get('body');

  if (body.isJSXElement()) {
    body.replaceWith(
      t.blockStatement([
        t.returnStatement(path.node.body),
      ])
    );
  }
};
