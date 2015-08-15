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
        
        .state('transList', {
            url: '/transList',
            templateUrl: 'templates/trans/transList.html',
            controller: 'TransList',
        })
        .state('transDetail', {
            url: '/trans/:transId',
            templateUrl: 'templates/trans/transDetail.html',
            controller: 'TransDetail',
        })


        .state('logisticList', {
            url: '/logisticList',
            templateUrl: 'templates/logistic/logisticList.html',
            controller: 'LogisticList',
        })
        .state('logisticManage', {
            url: '/logisticManage',
            templateUrl: 'templates/logistic/logisticManage.html',
            controller: 'LogisticManage',
        })

        .state('financeManage', {
            url: '/financeManage',
            templateUrl: 'templates/finance/financeManage.html',
            controller: 'FinanceManage',
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