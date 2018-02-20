import * as t from '@babel/types';
import template from '@babel/template';
import transformAttributesToObjectProperties from '../utils/transformAttributesToObjectProperties';

export default class RenderElementExpressionBuilder {
  withComponent (component) {
    this.component = component;
    return this;
  }

  withVariable (variable) {
    this.variable = variable;
    return this;
  }

  withAttributes (attributes) {
    this.attributes = attributes;
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
