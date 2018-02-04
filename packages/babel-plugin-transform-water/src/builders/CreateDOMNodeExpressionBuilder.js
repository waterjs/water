import template from '@babel/template';
import ImportBuiltinFunctionsDeclarationBuilder from './ImportBuiltinFunctionsDeclarationBuilder';
import { capitalize } from '../helpers';

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
    ImportBuiltinFunctionsDeclarationBuilder.add('_create');
    const creatorIdentifier = this.scope.generateUidIdentifier(capitalize(this.tagName));
    return template(`
      const CREATOR_IDENTIFIER = _create(TAG_NAME);
      const VARIABLE_IDENTIFIER = CREATOR_IDENTIFIER();
    `)({
      CREATOR_IDENTIFIER: creatorIdentifier,
      TAG_NAME: this.tagName,
      VARIABLE_IDENTIFIER: this.variable,
    });
  }
}
