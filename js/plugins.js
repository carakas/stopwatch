// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

Object.defineProperty(Object.prototype, 'removeItem', {
    value: function(key) {
        if (!this.hasOwnProperty(key)) {
            return;
        }
        if (isNaN(parseInt(key)) || !(this instanceof Array)) {
            delete this[key];
        }
        else {
            this.splice(key, 1)
        }
    },
    enumerable: false,
});
