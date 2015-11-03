export default {
  ready: function(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState != 'loading')
          fn();
      });
    }
  },

  getFunctionName: function(attributes) {
    var func = undefined;

    Array.prototype.slice.call(attributes).forEach(function(item) {
      if (item.name === 'data-function') {
        func = item.value;
      }
    });

    return func;
  }
}
