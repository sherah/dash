require.config({
    'paths': {
        'bootstrap':  'javascripts/vendor/bootstrap/dist/css/bootstrap.css',
        'style':      'css/style.css',
        'QUnit':      'javascripts/vendor/qunit/qunit/qunit',
        'jquery':     'javascripts/vendor/jquery/dist/jquery',
        'underscore': 'javascripts/vendor/underscore/underscore',
        'backbone':   'javascripts/vendor/backbone/backbone',
        'text':       'javascripts/vendor/requirejs-text/text',
        'chartjs':    'javascripts/vendor/chartjs/Chart',
        'momentjs':   'javascripts/vendor/moment/moment'
    },
    shim: {
       'QUnit': {
            exports: 'QUnit',
            init: function() {
              QUnit.config.autoload = false;
              QUnit.config.autostart = false;
           }
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        'bootstrap': {
            deps: [
                'jquery'
            ]
        }
    }
});

require([
    'backbone',
    'views/app'
    ],
    function( Backbone, App ){

        var app = new App();
        app.render();

});