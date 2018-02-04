import {
  AppendChildrenExpressionBuilder,
  CreateBlockExpressionBuilder,
  CreateTextNodeExpressionBuilder,
} from '../builders';

export default {
  enter (path, state) {
    const { currentStatement, parentIdentifier } = state;
    const expression = path.get('expression');

    if (expression.isCallExpression()) {
      const variableIdentifier = path.scope.generateUidIdentifier('block');

      currentStatement.insertBefore(
        new CreateBlockExpressionBuilder()
          .withVariable(variableIdentifier)
          .withExpression(expression.node)
          .build()
      );
      currentStatement.insertBefore(
        new AppendChildrenExpressionBuilder()
          .withParent(parentIdentifier)
          .withChildren(variableIdentifier)
          .build()
      );
      state.currentStatement = null;
      state.parentIdentifier = null;
    } else if (expression.isIdentifier()) {
      const variableIdentifier = path.scope.generateUidIdentifier('textNode');

      currentStatement.insertBefore(
        new CreateTextNodeExpressionBuilder()
          .withVariable(variableIdentifier)
          .withExpression(expression.node)
          .build()
      );
      currentStatement.insertBefore(
        new AppendChildrenExpressionBuilder()
          .withParent(parentIdentifier)
          .withChildren(variableIdentifier)
          .build()
      );
    }
  },

  exit (path, state) {
  },
};
