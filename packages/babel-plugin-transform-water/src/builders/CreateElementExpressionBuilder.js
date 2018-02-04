import * as t from '@babel/types';
import template from '@babel/template';

const transformAttributesToObjectProperties = attributes =>
  attributes.map(attribute => t.objectProperty(t.identifier(attribute.name.name), attribute.value));

export default class CreateElementExpressionBuilder {
  withVariable (variable) {
    this.variable = variable;
    return this;
  }

  withAttributes (attributes) {
    this.attributes = attributes;
    return this;
  }

  withComponentName (component) {
    this.component = component;
    return this;
  }

  build () {
    const properties = t.objectExpression(transformAttributesToObjectProperties(this.attributes));
    return template(`
      const VARIABLE_IDENTIFIER = COMPONENT(PROPERTIES);
    `)({
      VARIABLE_IDENTIFIER: this.variable,
      COMPONENT: this.component,
      PROPERTIES: properties,
    });
  }
}
