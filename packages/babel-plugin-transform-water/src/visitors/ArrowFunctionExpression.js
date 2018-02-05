export default (path) => {
  if (!path.isArrowFunctionExpression()) return;

  path.arrowFunctionToExpression({
    allowInsertArrow: false,
    specCompliant: false,
  });
};
