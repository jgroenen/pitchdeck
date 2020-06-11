define([
    'settings',
    'text!templates/application.tmpl',
    'Views/Slide',
    'Models/Slide'
], function (settings, template, SlideView, SlideModel) {
    var arrowLeft = 37,
        arrowUp = 38,
        arrowRight = 39,
        arrowDown = 40,
        spaceBar = 32,
        tab = 9;
    
    return Backbone.View.extend({
        template: _.template(template),
        
        events: {
            "click button.save": "save",
            "click .next button": "slideRight"
        },

        initialize: function (options) {
            this.slideViews = options.slides.reduce(function (array, slide, i) {
                slide.page = i + 1;
                slide.totalPages = options.slides.length;
                array.push(new SlideView({
                    model: new SlideModel(slide)
                }));
                return array;
            }, []);
            this.currentSlide = 0;
            
            _.bindAll(this, "slide", "slideLeft", "slideRight");
            $(window).on("keydown", this.slide);
            $(window).on("swipeleft", this.slideRight);
            $(window).on("swiperight", this.slideLeft);
            
            this.render();
        },
        
        save: function () {
            var data = this.slideViews.reduce(function (data, slideView) {
                data.push(slideView.model.toJSON());
                return data;
            }, []);
            $.post("/decks", JSON.stringify({
                slides: data
            }), function (token) {
                window.location = "/" + token;
            });
        },
        
        slide: function (e) {
            switch (e.which) {
                case arrowLeft: case arrowUp:
                    this.slideLeft();
                    break;
                case arrowRight: case arrowDown: case spaceBar:
                    this.slideRight();
                    break;
                case tab:
                    //this.slideViews[this.currentSlide].$(".title .display").click();
                    //e.preventDefault();
                    break;
                default:
            }
        },
        
        slideLeft: function () {
            if (this.slideViews[this.currentSlide].isBeingEdited) return;
            this.slideViews[this.currentSlide].$el.hide();
            this.currentSlide = (this.currentSlide - 1 + this.slideViews.length) % this.slideViews.length;
            this.slideViews[this.currentSlide].$el.show();
        },
        
        slideRight: function () {
            if (this.slideViews[this.currentSlide].isBeingEdited) return;
            this.slideViews[this.currentSlide].$el.hide();
            this.currentSlide = (this.currentSlide + 1) % this.slideViews.length;
            this.slideViews[this.currentSlide].$el.show();
        },
        
        render: function () {
            this.$el.html(this.template(this));
            this.slideViews.forEach(function (slideView) {
                this.$(".slides").append(slideView.$el);
            }, this);
            this.slideViews[this.currentSlide].$el.show();
            return this;
        }
    });
});
