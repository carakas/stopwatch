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
