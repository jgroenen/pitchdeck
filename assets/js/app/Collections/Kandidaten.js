define([
    'settings'
], function (settings) {
    return Backbone.Collection.extend({
        parse: function (data) {
            return data.members;
        }
    });
});
