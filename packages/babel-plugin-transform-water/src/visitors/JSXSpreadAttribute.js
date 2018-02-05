import { SetSpreadAttributeExpressionBuilder } from '../builders';

export default (path, { currentStatement, parentIdentifier }) => {
  currentStatement.insertBefore(
    new SetSpreadAttributeExpressionBuilder()
      .withCallee(parentIdentifier)
      .withProps(path.node.argument)
      .build()
  );
};
