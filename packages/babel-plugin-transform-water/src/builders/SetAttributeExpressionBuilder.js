import template from '@babel/template';
import ImportBuiltinFunctionsDeclarationBuilder from './ImportBuiltinFunctionsDeclarationBuilder';

export default class SetAttributeExpressionBuilder {
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
    ImportBuiltinFunctionsDeclarationBuilder.add('_attr');
    return template(`
      _attr(CALLEE, ATTRIBUTE, VALUE);
    `)({
      CALLEE: this.callee,
      ATTRIBUTE: this.attribute,
      VALUE: this.value,
    });
  }
}
