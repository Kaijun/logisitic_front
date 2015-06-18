'use strict';
;(function (window, $) {
	$('#toggle').click(function(){
		$('.lp-navbar-list').toggleClass('pure-hidden-phone');
		$(this).toggleClass('x');
	});

})(this, jQuery);