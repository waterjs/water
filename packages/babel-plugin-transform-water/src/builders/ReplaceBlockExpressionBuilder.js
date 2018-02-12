import template from '@babel/template';
import ImportBuiltinFunctionsDeclarationBuilder from './ImportBuiltinFunctionsDeclarationBuilder';

export default class ReplaceBlockExpressionBuilder {
  withComponentName (componentName) {
    this.componentName = componentName;
    return this;
  }

  withVariable (variable) {
    this.variable = variable;
    return this;
  }

  build () {
    ImportBuiltinFunctionsDeclarationBuilder.add('_replaceBlock');
    return template(`
      const newBlock = COMPONENT_NAME();
      _replaceBlock(newBlock, VARIABLE);
      VARIABLE = newBlock;
    `)({
      COMPONENT_NAME: this.componentName,
      VARIABLE: this.variable,
    });
  }
}
