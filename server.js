<<<<<<< HEAD
var express           = require( 'express' ),
    app               = express(),
    commander         = require( 'commander' ),
    config            = require( './defaults.js' ),
    port              = config.port,
    routes            = require( './routes'),
    passport          = require( 'passport' ),
    DrupalStrategy    = require( 'passport-drupal' ).DrupalStrategy,
    server,
    serverConfig;

commander
    .version('0.0.1')
    .option('-c, --config <path>', 'Path to the local configuration file')
    .parse(process.argv);

try {
    if (commander.config) {
        config = require(commander.config)(config);
    }
} catch(err) {
    console.err("Could not open configuration file %s! %s", commander.config, err);
    process.exit(1);
}

serverConfig = /(([0-9\.]*|\[[0-9a-fA-F\:]*\]):)?([0-9]+)/.exec(config.listen);
if (!serverConfig) {
    console.err("Server cannot listen on '%s', invalid format.", config.listen);
    process.exit(1);
}

app.use( express.session( { secret: config.sessionSecret } ) );

// Authentication
passport.use( new DrupalStrategy( {
		consumerKey: config.consumerKey,
		consumerSecret: config.consumerSecret,
		providerURL: config.providerURL,
		providerBackendURL: config.providerBackendURL
	},
	function(token, tokenSecret, profile, done) {
		profile.oauth = { token: token, token_secret: tokenSecret };
		done( null, profile );
	}
) );

passport.serializeUser( function( user, done ) {
	done( null, user );
} );

passport.deserializeUser( function( user, done ) {
	done( null, user );
} );

app.use( passport.initialize() );
app.use( passport.session() );

app.set( 'views', __dirname + '/src/components' );
app.set( 'view options', { pretty: true } );

app.get( '/data/:widget', routes.data );
app.get( '/metadata/:widget', routes.metadata );
app.get( '/user/info', routes.user );

app.use( express.static(__dirname + '/dist' ) );

app.get( '/auth/drupal', passport.authenticate( 'drupal' ));
app.get( '/auth/drupal/callback',
	passport.authenticate( 'drupal', { failureRedirect: '/login' }),
	function( req, res ) {
		res.redirect( '/' );
	});

server = app.listen(
		serverConfig[3],
		serverConfig[2],
		function() {
			console.log( 'listening on port %d', server.address().port );
		}
=======
var express			= require( 'express' ),
	app				= express(),
	routes			= require( './routes'),
	passport		= require( 'passport' ),
	DrupalStrategy	= require( 'passport-drupal' ).DrupalStrategy,
	evilDns			= require( 'evil-dns' ),
	url				= require( 'url' ),
	logger			= require( './logger.js' ),
	config			= require( './config.js' ),
	persistence		= require( './persistence.js' ),
	server,
	serverConfig,
	loginCheck;

logger.debug( 'Dash starting up' );

// Log errors
process.on( 'uncaughtException', function( err ) {
	logger.error( 'Application error: ' + err );
});

serverConfig = /(([0-9\.]*|\[[0-9a-fA-F\:]*\]):)?([0-9]+)/.exec(config.listen);
if (!serverConfig) {
	logger.error( 'Server cannot listen on "' + config.listen + '", invalid format.' );
	process.exit(1);
}

logger.debug( 'Will try to listen on IP address: ' + serverConfig[2] );
logger.debug( 'Will try to listen on port: ' + serverConfig[3] );
logger.debug( 'Using OAuth providerURL: ' + config.providerURL );
logger.debug( 'Using OAuth providerBackendURL: ' + config.providerBackendURL );

// Override DNS resolution if providerBackendIP is given
if ( config.providerBackendIP ) {
	logger.info( 'OAuth providerBackendIP set, will use address ' +
		config.providerBackendIP + ' for hostname "' +
		url.parse( config.providerBackendURL ).hostname + '"' );
	evilDns.add(
		url.parse( config.providerBackendURL ).hostname,
		config.providerBackendIP
	);
}
app.use( express.json() );

app.use( express.session( { secret: config.sessionSecret } ) );

// Authentication
passport.use( new DrupalStrategy( {
		consumerKey: config.consumerKey,
		consumerSecret: config.consumerSecret,
		providerURL: config.providerURL,
		providerBackendURL: config.providerBackendURL
	},
	function(token, tokenSecret, profile, done) {
		profile.oauth = { token: token, tokenSecret: tokenSecret };
		done( null, profile );
	}
) );

passport.serializeUser( function( user, done ) {
	done( null, user );
} );

passport.deserializeUser( function( user, done ) {
	done( null, user );
} );

app.use( passport.initialize() );
app.use( passport.session() );

loginCheck = function( req, res, next ) {
	if ( !req.session || !req.session.passport || !req.session.passport.user ) {
		res.json( { error: 'Error: Not logged in' } );
		return;
	}
	return next();
};

app.set( 'views', __dirname + '/src/components' );
app.set( 'view options', { pretty: true } );

app.get( '/data/:widget', loginCheck, routes.data );
app.get( '/metadata/:widget', loginCheck, routes.metadata );
app.get( '/user/info', loginCheck, routes.user.info );
app.get( '/widget', loginCheck, routes.widget.list );
app.get( '/widget-instance', loginCheck, routes.user.widgetInstances );
app.post( '/widget-instance', loginCheck, routes.widget.saveInstance );
app.put( '/widget-instance/:id', loginCheck, routes.widget.saveInstance );
app.get( '/widget-instance/:id', loginCheck, routes.widget.getInstance );
app.get( '/board', loginCheck, routes.user.boards );
app.post( '/board', loginCheck, routes.board.save );
app.put( '/board/:id', loginCheck, routes.board.save );
app.get( '/board/:id', loginCheck, routes.board.get );
app.post( '/board/:id/widgets', loginCheck, routes.board.addWidget );
/*jslint -W024*/
app.delete( '/board/:id/widgets/:instanceId', loginCheck, routes.board.deleteWidget );
app.use( express.static( __dirname + ( config.debug ? '/src' : '/dist' ) ) );
/*jslint +W024*/

if ( config.debug ) {
	app.get( '/auth/drupal', function( req, res ) {
		req.session.passport = {
			user: {
				displayName: 'HoneyD',
				id: 1337,
				provider: 'debug'
			}
		};
		persistence.loginUser( req.session.passport.user ).then( function() {
			res.redirect( '/' );
		}, function( error ) {
			res.json( error );
		});
	});
} else {
	app.get( '/auth/drupal', passport.authenticate( 'drupal' ));
	app.get( '/auth/drupal/callback',
		passport.authenticate( 'drupal', { failureRedirect: '/login' }),
		function( req, res ) {
			persistence.loginUser( req.session.passport.user ).then( function() {
				res.redirect( '/' );
			}, function( error ) {
				res.json( error );
			});
		}
	);
}
app.get( '/logout', function( req, res ) {
	req.logout();
	res.redirect( '/' );
});

server = app.listen(
	serverConfig[3],
	serverConfig[2],
	function() {
		logger.info( 'Dash listening on port ' + server.address().port );
	}
>>>>>>> release-2
);
