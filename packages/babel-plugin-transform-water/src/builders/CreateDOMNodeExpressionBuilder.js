import template from '@babel/template';

export default class CreateDOMNodeExpressionBuilder {
  withTagName (tagName) {
    this.tagName = tagName;
    return this;
  }

  withVariable (variable) {
    this.variable = variable;
    return this;
  }

  withScope (scope) {
    this.scope = scope;
    return this;
  }

  build () {
    return template(`
      const VARIABLE_IDENTIFIER = document.createElement(TAG_NAME);
    `)({
      TAG_NAME: this.tagName,
      VARIABLE_IDENTIFIER: this.variable,
    });
  }
}
