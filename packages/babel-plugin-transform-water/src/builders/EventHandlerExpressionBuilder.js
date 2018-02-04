import template from '@babel/template';

export default class EventHandlerExpressionBuilder {
  withCallee (callee) {
    this.callee = callee;
    return this;
  }

  withEvent (event) {
    this.event = event;
    return this;
  }

  withHandler (handler) {
    this.handler = handler;
    return this;
  }

  build () {
    return template(`
      CALLEE.EVENT = HANDLER;
    `)({
      CALLEE: this.callee,
      EVENT: this.event,
      HANDLER: this.handler,
    });
  }
}
