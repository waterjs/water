import template from '@babel/template';
import ImportBuiltinFunctionsDeclarationBuilder from './ImportBuiltinFunctionsDeclarationBuilder';

export default class AppendChildrenExpressionBuilder {
  withParent (parent) {
    this.parent = parent;
    return this;
  }

  withChildren (children) {
    this.children = children;
    return this;
  }

  build () {
    ImportBuiltinFunctionsDeclarationBuilder.add('_append');
    return template(`
      _append(PARENT_NODE, CHILDREN_NODE);
    `)({
      PARENT_NODE: this.parent,
      CHILDREN_NODE: this.children,
    });
  }
}
