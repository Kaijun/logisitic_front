'use strict';
;(function () {

	angular.module('admin', ['admin.controllers','admin.services','admin.directives', 'ui.router', 'angular-loading-bar'])
	.config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, cfpLoadingBarProvider, $httpProvider) {
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
        // .state('preStockList', {
        //     parent: 'business',
        //     url: '/preStockList',
        //     templateUrl: 'templates/stockList.html',
        //     controller: 'StockListCtrl',
        // })
        .state('stockList', {
            parent: 'business',
            url: '/stockList',
            params: {
                stockStatus: '',
            },
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
            params: {
                orderStatus: '',
            },
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
            url: '/orderQuick/:referenceCode',
            templateUrl: 'templates/order/orderQuick.html',
            controller: 'OrderQuick',
        })
        .state('preOrderList', {
            parent: 'business',
            url: '/preOrderList',
            templateUrl: 'templates/orderList.html',
            controller: 'OrderList',
        })



        .state('packageClaimList',{
    		parent:'business',
    		url:'/packageClaimList',
    		templateUrl:'templates/packageClaim/packageClaimList.html',
    		controller:'PackageClaimList',
    	})
    	.state('packageClaimDetail',{
    		parent:'business',
    		url:'/packageClaimDetail/:claimId',
    		templateUrl:'templates/packageClaim/packageClaimDetail.html',
    		controller:'PackageClaimDetail',
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
            parent: 'maintenance',
            url: '/problemList',
            templateUrl: 'templates/problemList.html',
            controller: 'ProblemList',
        })
        .state('problemDetail', {
            parent: 'business',
            url: '/problemDetail/:type/:id',
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
            url: '/bulkManage',
            templateUrl: 'templates/maintenance/bulkManage.html',
            controller: 'BulkManage',
        })
        .state('ticketList', {
            parent: 'maintenance',
            url: '/ticketList',
            templateUrl: 'templates/maintenance/ticketList.html',
            controller: 'TicketList',
        })
        .state('ticketDetail', {
            parent: 'maintenance',
            url: '/ticketDetail/:id',
            templateUrl: 'templates/maintenance/ticketDetail.html',
            controller: 'TicketDetail',
        })
// TODO: Admin Notification
				.state('notification', {
						parent: 'maintenance',
						url: '/notification',
						templateUrl: 'templates/maintenance/notification.html',
						controller: '',
				})
        .state('messageList', {
            parent: 'maintenance',
            url: '/messageList',
            templateUrl: 'templates/maintenance/ticketList.html',
            controller: 'TicketList',
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
        .state('transCompany', {
            parent: 'system',
            url: '/transCompany',
            templateUrl: 'templates/logistic/transCompany.html',
            controller: 'TransCompany',
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
       .state('financialRecord', {
            parent: 'finance',
            url: '/record',
            templateUrl: 'templates/finance/record.html',
            controller: 'FinancialRecord',
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
				// TODO: 用户等级管理
				.state('levelManage', {
						parent: 'system',
						url: '/levelManage',
						templateUrl: 'templates/level/levelManage.html',
						controller: '',
				})
				.state('levelList', {
						parent: 'system',
						url: '/levelList',
						templateUrl: 'templates/level/levelList.html',
						controller: '',
				})
				.state('scoreSetting', {
						parent: 'system',
						url: '/scoreSetting',
						templateUrl: 'templates/score/scoreSetting.html',
						controller: 'ScoreSetting',
				})
				.state('scoreSending', {
						parent: 'system',
						url: '/scoreSetting',
						templateUrl: 'templates/score/scoreSending.html',
						controller: '',
				})
				.state('couponManage', {
						parent: 'system',
						url: '/couponManage',
						templateUrl: 'templates/coupon/couponManage.html',
						controller: '',
				})
				.state('couponSending', {
						parent: 'system',
						url: '/couponSending',
						templateUrl: 'templates/coupon/couponSending.html',
						controller: '',
				})
					.state('couponList', {
						parent: 'system',
						url: '/couponList',
						templateUrl: 'templates/coupon/couponList.html',
						controller: '',
				})
				.state('couponTypeList', {
					parent: 'system',
					url: '/couponTypeList',
					templateUrl: 'templates/coupon/couponTypeList.html',
					controller: '',
			})

        .state('printPrepareList', {
            url: '/print/prepareList/',
            templateUrl: 'templates/print-format/perpare-list.html',
            controller: 'PrintPrepareList',
        })
        .state('printStock', {
            url: '/print/stock/',
            templateUrl: 'templates/print-format/stock-print.html',
            controller: 'PrintStock',
        })
        .state('printShip', {
            url: '/print/ship/',
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
            url: '/print/trans/',
            templateUrl: 'templates/print-format/trans-print.html',
            controller: 'PrintTrans',
        })

               // Error Http Interceptors
        $httpProvider.interceptors.push(function() {
          return {
            'response': function(response) {
                if(response.data.success===false){
                    swal(response.data.message, "", "error");
                    return null;
                }
                return response;
            },
           'responseError': function(response) {
                if (response.status==404) {
                    swal(response.data.message, "", "error");
                    return null;
                }
                else if (response.status==500) {
                    swal("服务器错误", "", "error");
                    return null;
                }
                else if (response.status==401) {
                    swal({
											title: "未登录, 请先登录",
											type: "error",
										}, function() {
											location.href = '/auth/admin-login'
										});
                    return null;
                }else{
                    swal("未知错误", "", "error");
                    return null;
                }

            }
          };
        });
	}])
    .run(['$state', '$injector', '$templateCache', '$templateRequest', '$compile', '$rootScope',
    function($state, $injector, $templateCache, $templateRequest, $compile, $rootScope){
        // var isUserInfoRendered = $injector.has('UserInfo');
        // if(isUserInfoRendered===false){
        //     window.location.href = '/auth/login'
        // }
    }]);

    //Default Configuration of App
    angular.module('admin').constant('AppConfig', {
        apiUrl: '/api/admin',
        apiUrlHome: '/api',
    })
})();
