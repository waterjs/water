import * as t from '@babel/types';

export default attributes => {
  return attributes.filter(attribute => attribute.node).map(attribute => {
    const attributeValue = attribute.get('value');
    let objectValue;

    if (attributeValue.isStringLiteral()) {
      objectValue = attributeValue.node;
    } else if (attributeValue.isJSXExpressionContainer()) {
      objectValue = attributeValue.get('expression').node;
    }
    return t.objectProperty(t.identifier(attribute.get('name').node.name), objectValue);
  });
};
