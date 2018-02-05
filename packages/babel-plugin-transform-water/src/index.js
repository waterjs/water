import JSX from '@babel/plugin-syntax-jsx';
import {
  ArrowFunctionExpression,
  Program,
  JSXElement,
  JSXAttribute,
  JSXSpreadAttribute,
  JSXExpressionContainer,
} from './visitors';

export default ({ types: t, template }) => {
  const visitor = {
    ArrowFunctionExpression,
    Program,
    JSXAttribute,
    JSXSpreadAttribute,
    JSXExpressionContainer,
  };

  visitor.JSXElement = JSXElement(visitor);

  return {
    inherits: JSX,
    visitor,
  };
};
