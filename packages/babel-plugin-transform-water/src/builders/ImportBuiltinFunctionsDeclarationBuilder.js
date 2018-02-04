import * as t from '@babel/types';

let builtinFunctions;

export default {
  initialize () {
    builtinFunctions = new Set();
  },

  add (func) {
    builtinFunctions.add(func);
  },

  build () {
    return t.importDeclaration([...builtinFunctions].map(f => t.importSpecifier(t.identifier(f), t.identifier(f))), t.stringLiteral('@water/core'));
  },
};
