define([
    'settings',
    'text!templates/slide.tmpl'
], function (settings, template) {
    var enter = 13;
    
    return Backbone.View.extend({
        template: _.template(template),
        
        tagName: "section",
        className: "slide",

        events: {
            "click .title .display": "editTitle",
            "keydown .title input": "checkTitleInput",
            "blur .title input": "saveTitle",
            "click .content .display": "editContent",
            "keydown .content textarea": "checkContentInput",
            "blur .content textarea": "saveContent"
        },

        initialize: function () {
            this.isBeingEdited = false;
            this.render();
        },
        
        editTitle: function (e) {
            this.isBeingEdited = true;
            this.$(".title input").val(this.$(".title .display").html());
            this.$(".title .display").hide();
            this.$(".title .edit").show();
            this.$(".title input").select();
        },
        
        checkTitleInput: function (e) {
            e.stopPropagation();
            switch (e.which) {
                case enter:
                    this.saveTitle();
                    break;
                default:
            }
        },
        
        saveTitle: function (e) {
            this.model.set("title", this.$(".title input").val() || this.$(".title input").attr("placeholder"));
            this.$(".title .display").html(this.model.get("title"));
            this.$(".title .edit").hide();
            this.$(".title .display").show();
            this.isBeingEdited = false;
        },
        
        editContent: function (e) {
            this.isBeingEdited = true;
            this.$(".content textarea").val(this.$(".content .display").html().replace(/<br>/g, "\n"));
            this.$(".content .display").hide();
            this.$(".content .edit").show();
            this.$(".content textarea").select();
        },
        
        checkContentInput: function (e) {
            e.stopPropagation();
        },
        
        saveContent: function (e) {
            var value = this.$(".content textarea").val();
            if (!value.replace(/\s/g, "")) {
                value = this.$(".content textarea").attr("placeholder");
            }
            this.model.set("content", value);
            this.$(".content .display").html(this.model.get("content").replace(/\n/g, "<br>"));
            this.$(".content .edit").hide();
            this.$(".content .display").show();
            this.isBeingEdited = false;
        },
        
        render: function () {
            this.$el.html(this.template(this));
            this.$el.hide();
            return this;
        }
    });
});
