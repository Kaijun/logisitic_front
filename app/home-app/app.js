'use strict';
;(function () {
	angular.module('home', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {
    
	    $urlRouterProvider.otherwise('/');
	    
	    $stateProvider
        .state('test', {
            url: '/test',
            templateUrl: 'templates/test.html',
            controller: 'TestCtrl'
        })
        
        
	});
})();