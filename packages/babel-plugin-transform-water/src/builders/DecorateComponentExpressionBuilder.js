import template from '@babel/template';
import ImportBuiltinFunctionsDeclarationBuilder from './ImportBuiltinFunctionsDeclarationBuilder';

export default class DecorateComponentExpressionBuilder {
  withRender (render) {
    this.render = render;
    return this;
  }

  build () {
    ImportBuiltinFunctionsDeclarationBuilder.add('_decorate');
    return template(`
      _decorate(RENDER);
    `)({
      RENDER: this.render,
    });
  }
}
