import template from '@babel/template';

export default class SetTextNodeValueExpressionBuilder {
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
      VARIABLE_IDENTIFIER.nodeValue = EXPRESSION;
    `)({
      VARIABLE_IDENTIFIER: this.variable,
      EXPRESSION: this.expression,
    });
  }
}
