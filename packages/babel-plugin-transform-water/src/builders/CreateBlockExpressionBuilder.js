import template from '@babel/template';

export default class CreateBlockExpressionBuilder {
  withVariable (variable) {
    this.variable = variable;
    return this;
  }

  withExpression (expression) {
    this.expression = expression;
    return this;
  }

  build () {
    return template(`
      const VARIABLE_IDENTIFIER = (() => EXPRESSION)();
    `)({
      VARIABLE_IDENTIFIER: this.variable,
      EXPRESSION: this.expression,
    });
  }
}
