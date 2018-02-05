import * as t from '@babel/types';
import {
  CreateTextNodeExpressionBuilder,
  AppendChildrenExpressionBuilder,
} from '../builders';

export default (path, { currentStatement, parentIdentifier }) => {
  const text = path.node.value;

  if (!text.trim()) {
    return;
  }

  const variableIdentifier = path.scope.generateUidIdentifier('textNode');

  currentStatement.insertBefore(
    new CreateTextNodeExpressionBuilder()
      .withVariable(variableIdentifier)
      .withExpression(t.stringLiteral(path.node.value))
      .build()
  );
  currentStatement.insertBefore(
    new AppendChildrenExpressionBuilder()
      .withParent(parentIdentifier)
      .withChildren(variableIdentifier)
      .build()
  );
};
