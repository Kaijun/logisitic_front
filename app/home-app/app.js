'use strict';
;(function () {


	angular.module('home',  ['home.controllers','home.services','home.directives' , 'ui.router', 'angular-loading-bar'])
	.config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', 
        function($stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
        
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
        .state('stockDetail', {
            url: '/stock/:stockId',
            templateUrl: 'templates/stockDetail.html',
            controller: 'StockDetailCtrl',
        })
        .state('orderList', {
            url: '/orderList',
            templateUrl: 'templates/orderList.html',
            controller: 'OrderListCtrl',
        })
        .state('orderSubmit', {
            url: '/order/submit?action?orderId',
            templateUrl: 'templates/orderSubmit.html',
            controller: 'OrderSubmitCtrl',
        })
        .state('orderConfirm', {
            params: { 'order': null },
            url: '/order/submit/confirm',
            templateUrl: 'templates/orderConfirm.html',
            controller: 'OrderConfirmCtrl',
        })
        .state('orderDetail', {
            url: '/order/:orderId',
            templateUrl: 'templates/orderDetail.html',
            controller: 'OrderDetailCtrl',
        })


        .state('addressManage', {
            url: '/profile/addressManage',
            templateUrl: 'templates/profile/addressManage.html',
            controller: 'AddressManageCtrl',
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