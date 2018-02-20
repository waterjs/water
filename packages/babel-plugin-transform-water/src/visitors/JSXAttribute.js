import * as t from '@babel/types';
import {
  isEventHandlerAttribute,
  toEventHandlerIdentifier,
} from '../events';
import {
  SetAttributeExpressionBuilder,
  EventHandlerExpressionBuilder,
  UpdateComponentAttributeExpressionBuilder,
} from '../builders';

export default {
  enter (path, state) {
    const { currentStatement, parentIdentifier, componentName } = state;
    let attributeValue;
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
    } else if (!componentName) {
      state.hydration = new SetAttributeExpressionBuilder()
        .withCallee(parentIdentifier)
        .withAttribute(t.stringLiteral(name))
        .withValue(attributeValue)
        .build();
      currentStatement.insertBefore(state.hydration);
    } else {
      state.hydration = new UpdateComponentAttributeExpressionBuilder()
        .withCallee(t.identifier(componentName))
        .withAttribute(t.stringLiteral(name))
        .withValue(attributeValue)
        .build();
    }

    state.attribute = name;
  },

  exit (path, state) {
    state.attribute = null;
  },
};
