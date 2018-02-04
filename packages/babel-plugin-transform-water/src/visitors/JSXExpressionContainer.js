import {
  AppendChildrenExpressionBuilder,
  CreateBlockExpressionBuilder,
} from '../builders';

export default {
  enter (path, state) {
    const { currentStatement, parentIdentifier } = state;
    const variableIdentifier = path.scope.generateUidIdentifier('block');
    currentStatement.insertBefore(
      new CreateBlockExpressionBuilder()
        .withVariable(variableIdentifier)
        .withExpression(path.get('expression').node)
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
  },

  exit (path, state) {
  },
};
