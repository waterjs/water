import * as t from '@babel/types';
import template from '@babel/template';

const transformArgumentsToProperties = (args) => args.map(arg =>
  t.objectProperty(t.identifier(arg.get('key').get('name').node), t.identifier(arg.get('key').get('name').node))
);

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
    const properties = t.objectExpression(transformArgumentsToProperties(this.expression.get('params')[0].get('properties')));
    return template(`
      const CREATOR_NAME = EXPRESSION;
      let VARIABLE_IDENTIFIER = CREATOR_NAME(PROPERTIES);
    `)({
      CREATOR_NAME: this.componentName,
      VARIABLE_IDENTIFIER: this.variable,
      EXPRESSION: this.expression.node,
      PROPERTIES: properties,
    });
  }
}
