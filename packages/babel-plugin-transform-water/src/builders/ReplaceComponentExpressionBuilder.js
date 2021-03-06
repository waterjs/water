import * as t from '@babel/types';
import template from '@babel/template';
import ImportBuiltinFunctionsDeclarationBuilder from './ImportBuiltinFunctionsDeclarationBuilder';
import transformAttributesToObjectProperties from '../utils/transformAttributesToObjectProperties';

export default class ReplaceComponentExpressionBuilder {
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
    ImportBuiltinFunctionsDeclarationBuilder.add('_replaceNode');
    const properties = t.objectExpression(transformAttributesToObjectProperties(this.attributes));
    return template(`
      const newChild = COMPONENT(PROPERTIES);
      _replaceNode(newChild, VARIABLE);
      VARIABLE = newChild;
    `)({
      COMPONENT: this.component,
      VARIABLE: this.variable,
      PROPERTIES: properties,
    });
  }
}
