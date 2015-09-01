'use strict';
;(function () {

	angular.module('admin', ['admin.controllers','admin.services','admin.directives', 'ui.router', 'angular-loading-bar'])
	.config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', 
    function($stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;

	    $urlRouterProvider.otherwise('/business/stockList');
	    
	    $stateProvider

        .state('login',{
            url: '/login',
            templateUrl:'login.html',
        })


        .state('business', {
            url: '/business',
            abstract: true,
            templateUrl: 'templates/shell.html',
        })
        .state('stockList', {
            parent: 'business',
            url: '/stockList',
            templateUrl: 'templates/stockList.html',
            controller: 'StockListCtrl',
        })
        .state('stockDetail', {
            parent: 'business',
            url: '/stock/:stockId',
            templateUrl: 'templates/stockDetail.html',
            controller: 'StockDetailCtrl',
        })
        .state('stockQuick', {
            parent: 'business',
            url: '/stockQuick',
            templateUrl: 'templates/stockQuick.html',
            controller: 'StockQuickCtrl',
        })
        .state('stockBatch', {
            parent: 'business',
            url: '/stockBatch',
            templateUrl: 'templates/stockBatch.html',
            controller: 'StockBatch',
        })
        .state('orderList', {
            parent: 'business',
            url: '/orderList',
            templateUrl: 'templates/order/orderList.html',
            controller: 'OrderList',
        })
        .state('orderDetail', {
            parent: 'business',
            url: '/order/:orderId',
            templateUrl: 'templates/order/orderDetail.html',
            controller: 'OrderDetail',
        })
        .state('orderQuick', {
            parent: 'business',
            url: '/orderQuick',
            templateUrl: 'templates/order/orderQuick.html',
            controller: 'OrderQuick',
        })
        
        .state('transList', {
            parent: 'business',
            url: '/transList',
            templateUrl: 'templates/trans/transList.html',
            controller: 'TransList',
        })
        .state('transDetail', {
            parent: 'business',
            url: '/trans/:transId',
            templateUrl: 'templates/trans/transDetail.html',
            controller: 'TransDetail',
        })
        .state('problemList', {
            parent: 'business',
            url: '/problemList',
            templateUrl: 'templates/problemList.html',
            controller: 'ProblemList',
        })
        .state('problemDetail', {
            parent: 'business',
            url: '/problemDetail',
            templateUrl: 'templates/problemDetail.html',
            controller: '',
        })

        .state('search', {
            parent: 'business',
            url: '/search',
            templateUrl: 'templates/search.html',
            controller: 'Search',
        })



        .state('maintenance', {
            url: '/maintenance',
            abstract: true,
            templateUrl: 'templates/shell.html',
        })
        .state('logisticList', {
            parent: 'maintenance',
            url: '/logisticList',
            templateUrl: 'templates/logistic/logisticList.html',
            controller: 'LogisticList',
        })
        .state('logisticManage', {
            parent: 'maintenance',
            url: '/logisticManage',
            templateUrl: 'templates/logistic/logisticManage.html',
            controller: 'LogisticManage',
            params: {logisticPath: null}
        })
        .state('logisticType', {
            parent: 'maintenance',
            url: '/logisticType',
            templateUrl: 'templates/logistic/logisticType.html',
            controller: 'LogisticType',
        })

        .state('extraSrvList', {
            parent: 'maintenance',
            url: '/extraSrvList',
            templateUrl: 'templates/extraSrv/extraSrvList.html',
            controller: 'ExtraSrvList',
        })
        .state('extraSrvManage', {
            parent: 'maintenance',
            url: '/extraSrvManage',
            templateUrl: 'templates/extraSrv/extraSrvManage.html',
            controller: 'ExtraSrvManage',
        })

          .state('logisticTrack', {
            parent: 'maintenance',
            url: '/logisticTrack',
            templateUrl: 'templates/logistic/logisticTrack.html',
            controller: 'LogisticTrack',
        })



        .state('financial', {
            url: '/financial',
            abstract: true,
            templateUrl: 'templates/shell.html',
        })
        .state('refill', {
            parent: 'financial',
            url: '/refill',
            templateUrl: 'templates/financial/refill.html',
            controller: 'Refill',
        })
        .state('refund', {
            parent: 'financial',
            url: '/refund',
            templateUrl: 'templates/financial/refund.html',
            controller: 'Refund',
        })




        .state('system', {
            url: '/system',
            abstract: true,
            templateUrl: 'templates/shell.html',
        })
        .state('userList', {
            parent: 'system',
            url: '/user/userList',
            templateUrl: 'templates/user/userList.html',
            controller: 'UserList',
        })
        .state('userManage', {
            parent: 'system',
            url: '/user/userManage',
            templateUrl: 'templates/user/userManage.html',
            controller: 'UserManage',
        })



        .state('printPrepareList', {
            url: '/print/prepareList/:orderId',
            templateUrl: 'templates/print-format/perpare-list.html',
            controller: 'PrintPrepareList',
        })
        .state('printShip', {
            url: '/print/ship/:orderId',
            templateUrl: 'templates/print-format/ship-print.html',
            controller: 'PrintShip',
        })
        .state('printStockBatch', {
            url: '/print/stockBatch',
            params: {
                stocks: [],
            },
            templateUrl: 'templates/print-format/stock-batch.html',
            controller: 'PrintStockBatch',
        })
        .state('printTrans', {
            url: '/print/trans/:transId',
            templateUrl: 'templates/print-format/trans-print.html',
            controller: 'PrintTrans',
        })

        
	}])
    .run(['$state', '$injector', '$templateCache', '$templateRequest', '$compile', '$rootScope',
    function($state, $injector, $templateCache, $templateRequest, $compile, $rootScope){
        var isUserInfoRendered = $injector.has('UserInfo');
        if(isUserInfoRendered===false){
            window.location.href = '/login/auth'
        }
    }]);

    //Default Configuration of App 
    angular.module('admin').constant('AppConfig', {
        apiUrl: '/api/admin',
        apiUrlHome: '/api/',
    })
})();