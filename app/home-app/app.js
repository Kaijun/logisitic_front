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
        .state('index', {
            url: '/',
            templateUrl: 'templates/index.html',
            controller: function () {
                
            },
        })
        .state('stockList', {
            url: '/stockList',
            templateUrl: 'templates/stockList.html',
            controller: 'StockListCtrl',
        })
        .state('stockSubmit', {
            url: '/stock/submit?action?stockId',
            templateUrl: 'templates/stockSubmit.html',
            controller: 'StockSubmitCtrl',
        })
        .state('stockConfirm', {
            params: { 'stock': null },
            url: '/stock/submit/confirm',
            templateUrl: 'templates/stockConfirm.html',
            controller: 'StockConfirmCtrl',
        })
        .state('stockDetail', {
            url: '/stock/:stockId',
            templateUrl: 'templates/stockDetail.html',
            controller: 'StockDetailCtrl',
        })
	}])
    .run(['$state', '$injector', function($state, $injector){
        var isUserInfoRendered = $injector.has('UserInfo');
        if(isUserInfoRendered===false){
            window.location.href = '/login/auth'
        }
    }]);

    //Default Configuration of App 
    angular.module('home').constant('AppConfig', {
        apiUrl: '/api',
    })
})();