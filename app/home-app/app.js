'use strict';
;(function () {


	angular.module('home',  ['home.controllers','home.services','home.directives' , 'ngAnimate', 'ui.router', 'angular-loading-bar'])
	.config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', '$httpProvider',
        function($stateProvider, $urlRouterProvider, cfpLoadingBarProvider, $httpProvider) {
        cfpLoadingBarProvider.includeSpinner = true;

	    $urlRouterProvider.otherwise('/');

	    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'templates/index.html',
            controller: 'IndexCtrl',
        })
        .state('stockList', {
            url: '/stockList/:status',
            templateUrl: 'templates/stockList.html',
            controller: 'StockListCtrl',
        })
        //deprecated
        // .state('stockSubmit', {
        //     url: '/stock/submit?stockId',
        //     templateUrl: 'templates/stockSubmit.html',
        //     controller: 'StockSubmitCtrl',
        // })
        // .state('stockConfirm', {
        //     url: '/stock/submit/confirm',
        //     templateUrl: 'templates/stockSubmit.html',
        //     controller: 'StockSubmitCtrl',
        // })
        .state('stockDetail', {
            url: '/stock/:stockId',
            templateUrl: 'templates/stockDetail.html',
            controller: 'StockDetailCtrl',
        })
// TODO: Home ProblemDetail
				.state('problemDetail', {
						url: '/problemDetail',
						templateUrl: 'templates/problemDetail.html',
						controller: '',
				})
				.state('problemList', {
						url: '/problemList',
						templateUrl: 'templates/problemList.html',
						controller: '',
				})

		.state('packageClaim',{
			url:'/packageClaim',
			templateUrl:'templates/packageClaim.html',
			controller: 'PackageClaim',
		})

        .state('orderList', {
            url: '/orderList/:status',
            templateUrl: 'templates/orderList.html',
            controller: 'OrderListCtrl',
        })
        .state('orderSubmit', {
            url: '/order/submit/:orderId',
            templateUrl: 'templates/orderSubmit.html',
            controller: 'OrderSubmitCtrl',
        })
        .state('orderDetail', {
            url: '/order/:orderId',
            templateUrl: 'templates/orderDetail.html',
            controller: 'OrderDetailCtrl',
        })

        .state('transSubmit', {
            url: '/trans/submit/:transId',
            templateUrl: 'templates/transSubmit.html',
            controller: 'TransSubmitCtrl',
        })
        .state('transList', {
            url: '/transList/:status',
            templateUrl: 'templates/transList.html',
            controller: 'TransListCtrl',
        })
        .state('transDetail', {
            url: '/trans/:transId',
            templateUrl: 'templates/transDetail.html',
            controller: 'TransDetailCtrl',
        })

        // 代刷页面
        .state('vorkasseSubmit', {
            url: '/vorkasseSubmit',
            templateUrl: 'templates/vorkasseSubmit.html',
            controller: 'VorkasseSubmitCtrl',
        })
        .state('vorkasseDetail', {
            url: '/vorkasseDetail/:id',
            templateUrl: 'templates/vorkasseDetail.html',
            controller: 'VorkasseDetailCtrl',
        })
        .state('vorkasseList', {
            url: '/vorkasseList',
            templateUrl: 'templates/vorkasseList.html',
            controller: 'VorkasseListCtrl',
        })
        .state('addressManage', {
            url: '/profile/addressManage',
            templateUrl: 'templates/profile/addressManage.html',
            controller: 'AddressManageCtrl',
        })
        .state('personalInfo', {
            url: '/profile/personalInfo',
            templateUrl: 'templates/profile/personalInfo.html',
            controller: 'PersonalInfoCtrl',
        })
        .state('changePassword', {
            url: '/profile/changePassword',
            templateUrl: 'templates/profile/changePassword.html',
            controller: 'ChangePassword',
        })
        .state('refill', {
            url: '/financial/refill',
            templateUrl: 'templates/financial/refill.html',
            controller: 'Refill',
        })
        .state('refund', {
            url: '/financial/refund',
            templateUrl: 'templates/financial/refund.html',
            controller: '',
        })
        .state('financialRecord',{
            url: '/financial/record',
            templateUrl: 'templates/financial/finance.html',
            controller: 'FinancialRecordCtrl',
        })
        .state('credits',{
            url: '/manage/credits',
            templateUrl: 'templates/financial/credits.html',
            controller: '',
        })

        .state('notificationList', {
            url: '/message/notification',
            templateUrl: 'templates/notification/notification.html',
            controller: 'NotificationCtrl',
        })
        .state('conversationList', {
            url: '/message/conversation',
            templateUrl: 'templates/notification/notification.html',
            controller: 'NotificationCtrl',
        })
        .state('contact',{
            url: '/contact',
            templateUrl: 'templates/notification/notification.html',
            controller: 'NotificationCtrl',
        })
        .state('conversation',{
            url: '/conversation/:id',
            templateUrl: 'templates/notification/conversation.html',
            controller: 'ConversationCtrl',
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
                    // swal("未登录, 请先登录", "", "error");
										swal({
											title: "未登录, 请先登录",
											type: "error",
										}, function() {
											location.href = '/auth/login'
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
    .run(['$state', '$injector', function($state, $injector){
        // var isUserInfoRendered = $injector.has('UserInfo');
        // if(isUserInfoRendered===false){
        //     window.location.href = '/auth/login'
        // }
    }]);

    //Default Configuration of App
    angular.module('home').constant('AppConfig', {
        apiUrl: '/api',
    });




    var user  = {"id":2,"name":"xrwr","email":"xrwr@qq.com","updated_at":"2016-04-03 22:13:05","created_at":"2015-10-23 13:44:09","stock_number":"IHYBTL","stock_position":10001,"role_id":1,"remain":100000.0078125,"score":10000000,"exp":10000000,"QQ":57826867,"wechat":"weqweqwe","phone_number":"13505876544","ID_card_number":"321321312321344","ID_card_scan_1":"","ID_card_scan_2":"","real_name":"pjy","is_deletable":0,"is_assured":0,"usable_score":0,"config":{"score_money_ratio":5},"role":{"id":1,"role_name":"\u5ba2\u6237","is_backend":0,"accountancy":0,"stock_manage":0,"ship_manage":0,"is_adminstrator":0,"is_vip":0,"updated_at":"-0001-11-30 00:00:00","created_at":"-0001-11-30 00:00:00","is_deletable":0}};
    user.level = {"id":25,"level_name":"\u666e\u901a\u7528\u6237","lower_bound":200,"usable_amount":0,"usable_ratio":"0.000","logistic_paths":[{"id":10,"name":"\u79fb\u5e93\u8def\u7ebf","ship_company_international":"DKD","ship_company_china":"YK","type":2,"base_price":10,"description":"\u79fb\u5e93\u9ed8\u8ba4\u7ebf\u8def\uff0c\u4e0d\u53ef\u5220\u9664","weight_upper_bound":30,"user_group":0,"based_on":0,"created_at":null,"updated_at":"2015-10-20 14:20:29","is_deletable":0,"extra_services":[],"pivot":{"user_level_id":25,"logistic_path_id":10,"is_usable":1,"discount_ratio":"0.000"}}],"extra_services":[]};
    user.unread_conversation = 0;
    user.unread_notification = 4;
    angular.module('home').constant('UserInfo', user);
    
    
    
    
    

})();
