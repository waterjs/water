export default {
  init () {
    const callbacks = [];

    return (callback) => {
      if (callback) {
        callbacks.push(callback);
      } else {
        callbacks.shift().call();
      }
    };
  },
};
