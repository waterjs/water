import template from '@babel/template';

export default class CreateBlockExpressionBuilder {
  withComponentName (componentName) {
    this.componentName = componentName;
    return this;
  }

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
      const CREATOR_NAME = () => [...EXPRESSION, document.createComment('block-end')];
      let VARIABLE_IDENTIFIER = CREATOR_NAME();
    `)({
      CREATOR_NAME: this.componentName,
      VARIABLE_IDENTIFIER: this.variable,
      EXPRESSION: this.expression,
    });
  }
}
