import template from '@babel/template';

export default class UpdateComponentAttributeExpressionBuilder {
  withCallee (callee) {
    this.callee = callee;
    return this;
  }

  withAttribute (attribute) {
    this.attribute = attribute;
    return this;
  }

  withValue (value) {
    this.value = value;
    return this;
  }

  build () {
    return template(`
      CALLEE.update(ATTRIBUTE, VALUE);
    `)({
      CALLEE: this.callee,
      ATTRIBUTE: this.attribute,
      VALUE: this.value,
    });
  }
}
