'use strict';
;(function () {
	angular.module('admin', [
        'admin.controllers',
        'ui.router',
    ])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
	    $urlRouterProvider.otherwise('/');
	    
	    $stateProvider
        .state('test', {
            url: '/test',
            templateUrl: 'templates/test.html',
            controller: 'TestCtrl',
        })
        
        
	}])
    .run(['$state', function($state){
        
    }]);
})();