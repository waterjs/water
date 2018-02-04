import * as t from '@babel/types';
import {
  isEventHandlerAttribute,
  toEventHandlerIdentifier,
} from '../events';
import {
  SetAttributeExpressionBuilder,
  EventHandlerExpressionBuilder,
} from '../builders';

export default (path, { currentStatement, parentIdentifier, isInComponent }) => {
  let attributeValue;
  let hydration;
  let name = path.node.name.name;
  const value = path.get('value');

  if (value.isStringLiteral()) {
    attributeValue = t.stringLiteral(path.node.value.value);
  } else if (value.isJSXExpressionContainer()) {
    attributeValue = value.get('expression').node;
  } else if (value.node === null) {
    attributeValue = t.stringLiteral('true');
  }

  if (name === 'className') {
    name = 'class';
  }

  if (isEventHandlerAttribute(name)) {
    currentStatement.insertBefore(
      new EventHandlerExpressionBuilder()
        .withCallee(parentIdentifier)
        .withEvent(t.identifier(toEventHandlerIdentifier(name)))
        .withHandler(attributeValue)
        .build()
    );
  } else if (!isInComponent) {
    hydration = new SetAttributeExpressionBuilder()
      .withCallee(parentIdentifier)
      .withAttribute(t.stringLiteral(name))
      .withValue(attributeValue)
      .build();
    currentStatement.insertBefore(hydration);
  }

  if (value.isJSXExpressionContainer()) {
    const bindings = value.get('expression').scope.bindings;

    Object.keys(bindings).forEach(binding => {
      bindings[binding].constantViolations.forEach(violationPath => {
        violationPath.insertAfter(hydration);
      });
    });
  }

  path.skip();
};
