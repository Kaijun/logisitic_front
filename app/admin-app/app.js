'use strict';
;(function () {

    var moduleDependency = ['admin.controllers','admin.services', 'ui.router'];
    if(angular.mock){
        moduleDependency.push('admin.mocks')
    }

	angular.module('admin', moduleDependency)
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
    angular.module('admin').constant('AppConfig', {
        apiUrl: '/api/admin',
    })
})();