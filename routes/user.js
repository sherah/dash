<<<<<<< HEAD
module.exports = function( req, res ) {
	if ( !req.session || !req.session.passport || !req.session.passport.user ) {
		res.json( false );
		return;
	}

	var user = req.session.passport.user;
	
	res.json( {
		name: user.displayName
	} );
}
=======
var persistence = require( '../persistence.js' );

module.exports = {
	info: function( req, res ) {
		var user = req.session.passport.user;

		res.json( {
			name: user.displayName,
			id: user.localId,
			defaultBoard: user.defaultBoard,
			avatar: user.avatar,
			title: user.title,
			email: user.email
		} );
	},
	boards: function( req, res ) {
		persistence.listBoards( req.session.passport.user.localId ).then( function( boards ) {
			res.json( boards );
		}, function( error ) {
			res.json( { error: error } );
		});
	},
	widgetInstances: function( req, res ) {
		persistence.listWidgetInstances( req.session.passport.user.localId ).then( function( instances ) {
			res.json( instances );
		}, function( error ) {
			res.json( { error: error } );
		});
	}
};
>>>>>>> release-2
