import * as t from '@babel/types';
import template from '@babel/template';

const transformAttributesToObjectProperties = attributes =>
  attributes.map(attribute => {
    let value;

    if (t.isStringLiteral(attribute.value)) {
      value = attribute.value;
    } else if (t.isJSXExpressionContainer(attribute.value)) {
      value = attribute.value.expression;
    }
    return t.objectProperty(t.identifier(attribute.name.name), value);
  });

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
