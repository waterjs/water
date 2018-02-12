import {
  AppendChildrenExpressionBuilder,
  CreateBlockExpressionBuilder,
  CreateTextNodeExpressionBuilder,
  SetTextNodeValueExpressionBuilder,
  ReplaceBlockExpressionBuilder,
} from '../builders';

export default {
  enter (path, state) {
    const { currentStatement, parentIdentifier, isInAttribute } = state;
    const expression = path.get('expression');

    if (!isInAttribute) {
      if (expression.isCallExpression()) {
        const componentName = path.scope.generateUidIdentifier('Block');
        const variableIdentifier = path.scope.generateUidIdentifier('block');

        currentStatement.insertBefore(
          new CreateBlockExpressionBuilder()
            .withComponentName(componentName)
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
        state.hydration = new ReplaceBlockExpressionBuilder()
          .withComponentName(componentName)
          .withVariable(variableIdentifier)
          .build();
        state.currentStatement = null;
        state.parentIdentifier = null;
      } else if (expression.isIdentifier()) {
        const variableIdentifier = path.scope.generateUidIdentifier('textNode');
        state.hydration = new SetTextNodeValueExpressionBuilder()
          .withVariable(variableIdentifier)
          .withExpression(expression.node)
          .build();
        currentStatement.insertBefore([
          new CreateTextNodeExpressionBuilder()
            .withVariable(variableIdentifier)
            .withExpression(expression.node)
            .build(),
          state.hydration,
          new AppendChildrenExpressionBuilder()
            .withParent(parentIdentifier)
            .withChildren(variableIdentifier)
            .build(),
        ]);
      }
    }

    if (state.hydration) {
      const bindings = expression.scope.bindings;
      Object.keys(bindings).forEach(binding => {
        if (!bindings[binding].constant) {
          bindings[binding].constantViolations.forEach(violationPath => {
            violationPath.insertAfter(state.hydration);
          });
        }
      });
    }
  },

  exit (path, state) {
  },
};
