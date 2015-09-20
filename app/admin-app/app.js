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
        .state('preStockList', {
            parent: 'business',
            url: '/preStockList',
            templateUrl: 'templates/stockList.html',
            controller: 'StockListCtrl',
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
            params: {
                id: null,
                type: null,
            },
            templateUrl: 'templates/problemDetail.html',
            controller: 'ProblemDetail',
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

        .state('groupMessageList', {
            parent: 'maintenance',
            url: '/groupMessageList',
            templateUrl: 'templates/maintenance/groupMessageList.html',
            controller: '',
        })
        .state('ticketList', {
            parent: 'maintenance',
            url: '/ticketList',
            templateUrl: 'templates/maintenance/ticketList.html',
            controller: '',
        })

        .state('messageList', {
            parent: 'maintenance',
            url: '/messageList',
            templateUrl: 'templates/maintenance/messageList.html',
            controller: '',
        })

        .state('articleList', {
            parent: 'maintenance',
            url: '/articleList',
            templateUrl: 'templates/maintenance/articleList.html',
            controller: 'ArticleList',
        })
        .state('articleManage', {
            parent: 'maintenance',
            url: '/articleManage/:articleId',
            templateUrl: 'templates/maintenance/articleManage.html',
            controller: 'ArticleManage',
        })
        .state('bannerList', {
            parent: 'maintenance',
            url: '/bannerList',
            templateUrl: 'templates/maintenance/bannerList.html',
            controller: '',
        })
        .state('bannerManage', {
            parent: 'maintenance',
            url: '/bannerManage',
            templateUrl: 'templates/maintenance/bannerManage.html',
            controller: '',
        })
       




        .state('logisticList', {
            parent: 'system',
            url: '/logisticList',
            templateUrl: 'templates/logistic/logisticList.html',
            controller: 'LogisticList',
        })
        .state('logisticManage', {
            parent: 'system',
            url: '/logisticManage/:id',
            templateUrl: 'templates/logistic/logisticManage.html',
            controller: 'LogisticManage',
        })
        .state('logisticType', {
            parent: 'system',
            url: '/logisticType',
            templateUrl: 'templates/logistic/logisticType.html',
            controller: 'LogisticType',
        })

        .state('extraSrvList', {
            parent: 'system',
            url: '/extraSrvList',
            templateUrl: 'templates/extraSrv/extraSrvList.html',
            controller: 'ExtraSrvList',
        })
        .state('extraSrvManage', {
            parent: 'system',
            url: '/extraSrvManage/:id',
            templateUrl: 'templates/extraSrv/extraSrvManage.html',
            controller: 'ExtraSrvManage',
        })

          .state('logisticTrack', {
            parent: 'system',
            url: '/logisticTrack',
            templateUrl: 'templates/logistic/logisticTrack.html',
            controller: 'LogisticTrack',
        })



        .state('finance', {
            url: '/finance',
            abstract: true,
            templateUrl: 'templates/shell.html',
        })
        .state('refill', {
            parent: 'finance',
            url: '/refill',
            templateUrl: 'templates/finance/refill.html',
            controller: 'Refill',
        })
        .state('refund', {
            parent: 'finance',
            url: '/refund',
            templateUrl: 'templates/finance/refund.html',
            controller: 'Refund',
        })
        .state('vorkasseList', {
            parent: 'finance',
            url: '/vorkasseList',
            templateUrl: 'templates/finance/vorkasseList.html',
            controller: 'VorkasseList',
        })
        .state('vorkasseRate', {
            parent: 'finance',
            url: '/vorkasseRate',
            templateUrl: 'templates/finance/vorkasseRate.html',
            controller: 'VorkasseRate',
        })
       .state('vorkasseDetail', {
            parent: 'finance',
            url: '/vorkasseDetail/:vorkasseId',
            templateUrl: 'templates/finance/vorkasseDetail.html',
            controller: 'VorkasseDetail',
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
            url: '/user/userManage/:userId',
            templateUrl: 'templates/user/userManage.html',
            controller: 'UserManage',
        })
        .state('roleList', {
            parent: 'system',
            url: '/user/roleList',
            templateUrl: 'templates/user/roleList.html',
            controller: 'RoleList',
        })
        .state('roleManage', {
            parent: 'system',
            url: '/user/roleManage',
            templateUrl: 'templates/user/roleManage.html',
            controller: 'RoleManage',
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