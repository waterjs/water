import JSX from '@babel/plugin-syntax-jsx';
import {
  ArrowFunctionExpression,
  Program,
  JSXElement,
  JSXAttribute,
  JSXExpressionContainer,
} from './visitors';

export default ({ types: t, template }) => {
  const visitor = {
    ArrowFunctionExpression,
    Program,
    JSXAttribute,
    JSXExpressionContainer,
  };

  visitor.JSXElement = JSXElement(visitor);

  return {
    inherits: JSX,
    visitor,
  };
};
