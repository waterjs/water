import * as t from '@babel/types';
import template from '@babel/template';

export default class BindComponentAttributeExpressionBuilder {
  withPropertyName (property) {
    this.property = property;
    return this;
  }

  withCallback (callback) {
    this.callback = callback;
    return this;
  }

  build () {
    return template(`
      this.bind(PROPERTY_NAME, PROPERTY => { CALLBACK });
    `)({
      PROPERTY_NAME: t.stringLiteral(this.property),
      PROPERTY: t.identifier(this.property),
      CALLBACK: this.callback,
    });
  }
}
