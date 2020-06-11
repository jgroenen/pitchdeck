require.config({
    baseUrl: '/assets/js/app',
    paths: {
        templates: '../../tmpl',
        jquery: '../vendor/jquery/jquery-2.1.3/jquery-2.1.3.min',
        jqueryMobile: '../vendor/jquery/jquery.mobile-1.4.5/jquery.mobile-1.4.5.min',
        swipe: '../vendor/jquery/plugins/jquery.event.swipe/jquery.event.swipe',
        underscore: '../vendor/underscore/underscore-1.7.0/underscore-min',
        backbone: '../vendor/backbone/backbone-1.1.2/backbone-min',
        text: '../vendor/require/plugins/text/text-2.0.12/text'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery', 'text', 'jqueryMobile'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'jquery': {
            exports: '$'
        },
        'jqueryMobile': {
            deps: ['jquery']
        }
    }
});

require([
    'settings',
    'backbone'
], function (settings) {
    
    var token = window.location.pathname.split("/")[1];
    if (token) {
        $.get('/decks/' + token, function (data) {
            require([
                'Views/Application'
            ], function (ApplicationView) {
                new ApplicationView({
                    el: $('body'),
                    slides: data.slides
                });
            });
        });
    } else {
        require([
            'Views/Application'
        ], function (ApplicationView) {
            new ApplicationView({
                el: $('body'),
                slides: settings.slides
            });
        });
    }
});