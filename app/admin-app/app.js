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
        .state('stockList', {
            url: '/stockList',
            templateUrl: 'templates/stockList.html',
            controller: 'StockListCtrl',
        })
        .state('stockDetail', {
            url: '/stock/:stockId',
            templateUrl: 'templates/stockDetail.html',
            controller: 'StockDetailCtrl',
        })
        .state('stockQuick', {
            url: '/stockQuick',
            templateUrl: 'templates/stockQuick.html',
            controller: 'StockQuickCtrl',
        })
        .state('stockBatch', {
            url: '/stockBatch',
            templateUrl: 'templates/stockBatch.html',
            controller: 'stockBatch',
        })
        
        
	}])
    .run(['$state', '$injector', function($state, $injector){
        var isUserInfoRendered = $injector.has('UserInfo');
        if(isUserInfoRendered===false){
            window.location.href = '/login/auth'
        }
    }]);

    //Default Configuration of App 
    angular.module('admin').constant('AppConfig', {
        apiUrl: '/api/admin',
    })
})();