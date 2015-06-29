'use strict';
;(function () {
    
    var moduleDependency = ['home.controllers','home.services', 'ui.router'];
    if(angular.mock){
        moduleDependency.push('home.mocks')
    }

	angular.module('home', moduleDependency)
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

    //Default Configuration of App 
    angular.module('home').constant('AppConfig', {
        apiUrl: '/api',
    })
})();