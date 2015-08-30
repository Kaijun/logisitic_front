'use strict';
;(function () {

	angular.module('admin', ['admin.controllers','admin.services','admin.directives', 'ui.router', 'angular-loading-bar'])
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
        .state('problemList', {
            url: '/problemList',
            templateUrl: 'templates/problemList.html',
            controller: '',
        })
        .state('problemDetail', {
            url: '/problemDetail',
            templateUrl: 'templates/problemDetail.html',
            controller: '',
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
        .state('logisticType', {
            url: '/logisticType',
            templateUrl: 'templates/logistic/logisticType.html',
            controller: 'LogisticType',
        })

        .state('extraSrvList', {
            url: '/extraSrvList',
            templateUrl: 'templates/extraSrv/extraSrvList.html',
            controller: 'ExtraSrvList',
        })
        .state('ExtraSrvManage', {
            url: '/extraSrvManage',
            templateUrl: 'templates/extraSrv/extraSrvManage.html',
            controller: 'ExtraSrvManage',
        })

          .state('logisticTrack', {
            url: '/logisticTrack',
            templateUrl: 'templates/logistic/logisticTrack.html',
            controller: 'LogisticTrack',
        })

        .state('financeManage', {
            url: '/financeManage',
            templateUrl: 'templates/finance/financeManage.html',
            controller: 'FinanceManage',
        })
        .state('refill', {
            url: '/financial/refill',
            templateUrl: 'templates/financial/refill.html',
            controller: 'Refill',
        })
        .state('refund', {
            url: '/financial/refund',
            templateUrl: 'templates/financial/refund.html',
            controller: 'Refund',
        })
        .state('userList', {
            url: '/user/userList',
            templateUrl: 'templates/user/userList.html',
            controller: 'UserList',
        })
        .state('userManage', {
            url: '/user/userManage',
            templateUrl: 'templates/user/userManage.html',
            controller: 'UserManage',
        })


        
	}])
    .run(['$state', '$injector', '$templateCache', '$templateRequest', '$compile', '$rootScope',
    function($state, $injector, $templateCache, $templateRequest, $compile, $rootScope){

        var isUserInfoRendered = $injector.has('UserInfo');
        if(isUserInfoRendered===false){
            window.location.href = '/login/auth'
        }

 //  加载 静态打印的页面
   $templateRequest("templates/print-format/perpare-list.html").then(function(html){
      var template = angular.element(html);
        var scope = $rootScope.$new();
        scope.test = "test";
        var b = $compile(html)(scope);
        console.log(b)

        var myWindow = window.open();
        angular.element(myWindow.document.body).html(b);
   });


    }]);

    //Default Configuration of App 
    angular.module('admin').constant('AppConfig', {
        apiUrl: '/api/admin',
    })
})();