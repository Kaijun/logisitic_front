'use strict';
;(function () {

	angular.module('admin', ['admin.controllers','admin.services', 'ui.router', 'angular-loading-bar'])
	.config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', 
    function($stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;

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
            controller: 'StockBatch',
        })
        .state('orderList', {
            url: '/orderList',
            templateUrl: 'templates/order/orderList.html',
            controller: 'OrderList',
        })
        .state('orderDetail', {
            url: '/order/:orderId',
            templateUrl: 'templates/order/orderDetail.html',
            controller: 'OrderDetail',
        })
        .state('orderQuick', {
            url: '/orderQuick',
            templateUrl: 'templates/order/orderQuick.html',
            controller: 'OrderQuick',
        })
        .state('orderDetail',{
            url:'/orderDetail',
            templateUrl: 'templates/orderDetail.html',
            controller: '',
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