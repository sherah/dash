define( [
    'knockout',
    'text!components/nav-bar/nav-bar.html'
], function( ko, template ){


    function NavBarViewModel( params ){
    	var self = this;

        self.route = params.route;

        self.hideNav = function(){
        	//make the nav menu fold out of view.
            $('#navContainer .navWrapper').toggleClass('hide');
            $('#showNavMenu').css('display', 'inline');
            $('#dashApp').css('padding', '0 0 0 55px');
        };

        self.showNav = function(){
        	window.setTimeout(function(){
                $('#navContainer .navWrapper').toggleClass('hide');
                $('#dashApp').css('padding-left', '175px');
            }, 200);
        };
    }

    return { viewModel: NavBarViewModel, template: template };

});