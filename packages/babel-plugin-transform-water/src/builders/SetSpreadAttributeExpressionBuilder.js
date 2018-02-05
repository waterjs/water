import template from '@babel/template';

export default class SetSpreadAttributeExpressionBuilder {
  withCallee (callee) {
    this.callee = callee;
    return this;
  }

  withProps (props) {
    this.props = props;
    return this;
  }

  build () {
    return template(`
      Object.keys(PROPS).forEach(key => {
        CALLEE.setAttribute(key, PROPS[key]);
      })
    `)({
      CALLEE: this.callee,
      PROPS: this.props,
    });
  }
}
