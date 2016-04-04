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





    // var user  = {"id":2,"name":"xrwr","email":"xrwr@qq.com","updated_at":"2016-04-04 18:26:56","created_at":"2015-10-23 13:44:09","stock_number":"IHYBTL","stock_position":10001,"role_id":1,"remain":"100000.01","score":10000000,"exp":0,"QQ":57826867,"wechat":"weqweqwe","phone_number":"13505876544","ID_card_number":"321321312321344","ID_card_scan_1":"","ID_card_scan_2":"","real_name":"pjy","is_deletable":0,"is_assured":0,"usable_score":5000,"config":{"score_money_ratio":5},"role":{"id":1,"role_name":"\u5ba2\u6237","is_backend":0,"accountancy":0,"stock_manage":0,"ship_manage":0,"is_adminstrator":0,"is_vip":0,"updated_at":"-0001-11-30 00:00:00","created_at":"-0001-11-30 00:00:00","is_deletable":0}};
    // user.level = {"id":41,"level_name":"\u5317\u6781\u4f1a\u5458","lower_bound":0,"usable_amount":5000,"usable_ratio":"1.000","logistic_paths":[{"id":10,"name":"\u79fb\u5e93\u8def\u7ebf","ship_company_international":"DKD","ship_company_china":"YK","type":2,"base_price":10,"description":"\u79fb\u5e93\u9ed8\u8ba4\u7ebf\u8def\uff0c\u4e0d\u53ef\u5220\u9664","weight_upper_bound":30,"user_group":0,"based_on":0,"created_at":null,"updated_at":"2015-10-20 14:20:29","is_deletable":0,"extra_services":[{"id":21,"service_name":"\u5165\u5e93\u6e05\u70b9","type":1,"description":"\u5165\u5e93\u6e05\u70b9\u6bcf\u5355\u6536\u8d3930\u5143\u3002","logistic_path_id":-1,"user_group":1,"base_price":30,"based_on":0,"is_deletable":1},{"id":30,"service_name":"\u5165\u5e93\u62cd\u7167\u670d\u52a1","type":1,"description":"\u6536\u8d3950\u5143\/3\u5f20\uff0c\u5ba2\u6237\u5728\u63d0\u4ea4\u7533\u8bf7\u7684\u5907\u6ce8\u8bf4\u660e\u4e2d\u9700\u586b\u5199\u63a5\u6536\u56fe\u7247\u7684\u90ae\u7bb1\u5730\u5740\u3002","logistic_path_id":-1,"user_group":0,"base_price":50,"based_on":0,"is_deletable":1},{"id":34,"service_name":"\u51fa\u5e93\u6e05\u70b9","type":3,"description":"\u6bcf\u5355\u6536\u8d3930\u5143","logistic_path_id":-1,"user_group":0,"base_price":30,"based_on":0,"is_deletable":1},{"id":35,"service_name":"\u4f7f\u7528\u5c0f\u5185\u7bb1","type":3,"description":"\u51cf\u514d\u8d39\u7528\u6d4b\u8bd5","logistic_path_id":-1,"user_group":0,"base_price":-30,"based_on":0,"is_deletable":1}],"pivot":{"user_level_id":41,"logistic_path_id":10,"is_usable":1,"discount_ratio":"1.000"}},{"id":40,"name":"DHL\u4f18\u5148\u5305\uff0d\u539f\u7bb1\u8f6c\u8fd0","ship_company_international":"DHL","ship_company_china":"CK","type":3,"base_price":0,"description":"\u8bf7\u60a8\u6ce8\u610f \uff1a\u539f\u7bb1\u8f6c\u8fd0\u5373\u5305\u88f9\u600e\u6837\u4ece\u7f51\u7ad9\u53d1\u8fc7\u6765\uff0c\u6211\u4eec\u5c06\u5bf9\u8be5\u5305\u88f9\u7f20\u7ed5\u9632\u6c34\u819c\u7136\u540e\u76f4\u63a5\u53d1\u51fa","weight_upper_bound":10,"user_group":0,"based_on":1,"created_at":"2015-09-10 16:33:58","updated_at":"2016-03-31 02:35:52","is_deletable":1,"extra_services":[{"id":21,"service_name":"\u5165\u5e93\u6e05\u70b9","type":1,"description":"\u5165\u5e93\u6e05\u70b9\u6bcf\u5355\u6536\u8d3930\u5143\u3002","logistic_path_id":-1,"user_group":1,"base_price":30,"based_on":0,"is_deletable":1},{"id":30,"service_name":"\u5165\u5e93\u62cd\u7167\u670d\u52a1","type":1,"description":"\u6536\u8d3950\u5143\/3\u5f20\uff0c\u5ba2\u6237\u5728\u63d0\u4ea4\u7533\u8bf7\u7684\u5907\u6ce8\u8bf4\u660e\u4e2d\u9700\u586b\u5199\u63a5\u6536\u56fe\u7247\u7684\u90ae\u7bb1\u5730\u5740\u3002","logistic_path_id":-1,"user_group":0,"base_price":50,"based_on":0,"is_deletable":1},{"id":34,"service_name":"\u51fa\u5e93\u6e05\u70b9","type":3,"description":"\u6bcf\u5355\u6536\u8d3930\u5143","logistic_path_id":-1,"user_group":0,"base_price":30,"based_on":0,"is_deletable":1},{"id":35,"service_name":"\u4f7f\u7528\u5c0f\u5185\u7bb1","type":3,"description":"\u51cf\u514d\u8d39\u7528\u6d4b\u8bd5","logistic_path_id":-1,"user_group":0,"base_price":-30,"based_on":0,"is_deletable":1}],"pivot":{"user_level_id":41,"logistic_path_id":40,"is_usable":1,"discount_ratio":"1.000"}},{"id":46,"name":"\u987a\u4e30\u5976\u7c89\u4e13\u7ebf","ship_company_international":"SF","ship_company_china":"N\/A","type":3,"base_price":100,"description":"14\u5929\u5f00\u59cb\u56fd\u5185\u987a\u4e30\u6d3e\u9001\uff0c\u4e0d\u5305\u7a0e\uff0c\u5305\u52a0\u56fa\uff0c\u51c0\u91cd\u8ba1\u7b97\u3002","weight_upper_bound":5,"user_group":0,"based_on":1,"created_at":"2016-03-31 02:53:15","updated_at":"2016-03-31 02:53:15","is_deletable":1,"extra_services":[{"id":21,"service_name":"\u5165\u5e93\u6e05\u70b9","type":1,"description":"\u5165\u5e93\u6e05\u70b9\u6bcf\u5355\u6536\u8d3930\u5143\u3002","logistic_path_id":-1,"user_group":1,"base_price":30,"based_on":0,"is_deletable":1},{"id":30,"service_name":"\u5165\u5e93\u62cd\u7167\u670d\u52a1","type":1,"description":"\u6536\u8d3950\u5143\/3\u5f20\uff0c\u5ba2\u6237\u5728\u63d0\u4ea4\u7533\u8bf7\u7684\u5907\u6ce8\u8bf4\u660e\u4e2d\u9700\u586b\u5199\u63a5\u6536\u56fe\u7247\u7684\u90ae\u7bb1\u5730\u5740\u3002","logistic_path_id":-1,"user_group":0,"base_price":50,"based_on":0,"is_deletable":1},{"id":34,"service_name":"\u51fa\u5e93\u6e05\u70b9","type":3,"description":"\u6bcf\u5355\u6536\u8d3930\u5143","logistic_path_id":-1,"user_group":0,"base_price":30,"based_on":0,"is_deletable":1},{"id":35,"service_name":"\u4f7f\u7528\u5c0f\u5185\u7bb1","type":3,"description":"\u51cf\u514d\u8d39\u7528\u6d4b\u8bd5","logistic_path_id":-1,"user_group":0,"base_price":-30,"based_on":0,"is_deletable":1}],"pivot":{"user_level_id":41,"logistic_path_id":46,"is_usable":1,"discount_ratio":"1.000"}},{"id":47,"name":"\u987a\u4e30\u5976\u7c89\u5305\u7a0e","ship_company_international":"SF","ship_company_china":"N\/A","type":3,"base_price":100,"description":"\u4e0a\u9650\uff1a5\u516c\u65a4\uff1b14\u5929\u5f00\u59cb\u56fd\u5185\u987a\u4e30\u6d3e\u9001\uff0c\u5305\u7a0e\uff0c\u5305\u52a0\u56fa\uff0c\u51c0\u91cd\u8ba1\u7b97","weight_upper_bound":5,"user_group":0,"based_on":1,"created_at":"2016-03-31 02:54:58","updated_at":"2016-03-31 03:02:04","is_deletable":1,"extra_services":[{"id":21,"service_name":"\u5165\u5e93\u6e05\u70b9","type":1,"description":"\u5165\u5e93\u6e05\u70b9\u6bcf\u5355\u6536\u8d3930\u5143\u3002","logistic_path_id":-1,"user_group":1,"base_price":30,"based_on":0,"is_deletable":1},{"id":30,"service_name":"\u5165\u5e93\u62cd\u7167\u670d\u52a1","type":1,"description":"\u6536\u8d3950\u5143\/3\u5f20\uff0c\u5ba2\u6237\u5728\u63d0\u4ea4\u7533\u8bf7\u7684\u5907\u6ce8\u8bf4\u660e\u4e2d\u9700\u586b\u5199\u63a5\u6536\u56fe\u7247\u7684\u90ae\u7bb1\u5730\u5740\u3002","logistic_path_id":-1,"user_group":0,"base_price":50,"based_on":0,"is_deletable":1},{"id":34,"service_name":"\u51fa\u5e93\u6e05\u70b9","type":3,"description":"\u6bcf\u5355\u6536\u8d3930\u5143","logistic_path_id":-1,"user_group":0,"base_price":30,"based_on":0,"is_deletable":1},{"id":35,"service_name":"\u4f7f\u7528\u5c0f\u5185\u7bb1","type":3,"description":"\u51cf\u514d\u8d39\u7528\u6d4b\u8bd5","logistic_path_id":-1,"user_group":0,"base_price":-30,"based_on":0,"is_deletable":1}],"pivot":{"user_level_id":41,"logistic_path_id":47,"is_usable":1,"discount_ratio":"1.000"}},{"id":49,"name":"\u9000\u8d27\u4e13\u7ebf","ship_company_international":"N","ship_company_china":"NA","type":3,"base_price":100,"description":"123","weight_upper_bound":30,"user_group":0,"based_on":1,"created_at":"2016-03-31 04:07:43","updated_at":"2016-03-31 04:07:43","is_deletable":1,"extra_services":[{"id":21,"service_name":"\u5165\u5e93\u6e05\u70b9","type":1,"description":"\u5165\u5e93\u6e05\u70b9\u6bcf\u5355\u6536\u8d3930\u5143\u3002","logistic_path_id":-1,"user_group":1,"base_price":30,"based_on":0,"is_deletable":1},{"id":30,"service_name":"\u5165\u5e93\u62cd\u7167\u670d\u52a1","type":1,"description":"\u6536\u8d3950\u5143\/3\u5f20\uff0c\u5ba2\u6237\u5728\u63d0\u4ea4\u7533\u8bf7\u7684\u5907\u6ce8\u8bf4\u660e\u4e2d\u9700\u586b\u5199\u63a5\u6536\u56fe\u7247\u7684\u90ae\u7bb1\u5730\u5740\u3002","logistic_path_id":-1,"user_group":0,"base_price":50,"based_on":0,"is_deletable":1},{"id":34,"service_name":"\u51fa\u5e93\u6e05\u70b9","type":3,"description":"\u6bcf\u5355\u6536\u8d3930\u5143","logistic_path_id":-1,"user_group":0,"base_price":30,"based_on":0,"is_deletable":1},{"id":35,"service_name":"\u4f7f\u7528\u5c0f\u5185\u7bb1","type":3,"description":"\u51cf\u514d\u8d39\u7528\u6d4b\u8bd5","logistic_path_id":-1,"user_group":0,"base_price":-30,"based_on":0,"is_deletable":1},{"id":36,"service_name":"\u9700\u53e6\u8d2d\u8fd0\u8d39","type":3,"description":"\u53e6\u8d2dDHL\u90ae\u8def\u8d39\u7528","logistic_path_id":49,"user_group":0,"base_price":200,"based_on":0,"is_deletable":1}],"pivot":{"user_level_id":41,"logistic_path_id":49,"is_usable":1,"discount_ratio":"1.000"}},{"id":50,"name":"DHL\u4f18\u5148\u5305\uff0d\u52a0\u56fa\u8f6c\u8fd0","ship_company_international":"DHL","ship_company_china":"CK","type":3,"base_price":0,"description":"\u5176\u4ed6\u4ea7\u54c1\u7531\u5927\u53e3\u888b\u8f6c\u8fd0\u81ea\u884c\u5224\u65ad\u7684\u52a0\u56fa\u6750\u6599\uff1b","weight_upper_bound":10,"user_group":0,"based_on":1,"created_at":"2016-03-31 08:47:19","updated_at":"2016-03-31 08:48:26","is_deletable":1,"extra_services":[{"id":21,"service_name":"\u5165\u5e93\u6e05\u70b9","type":1,"description":"\u5165\u5e93\u6e05\u70b9\u6bcf\u5355\u6536\u8d3930\u5143\u3002","logistic_path_id":-1,"user_group":1,"base_price":30,"based_on":0,"is_deletable":1},{"id":30,"service_name":"\u5165\u5e93\u62cd\u7167\u670d\u52a1","type":1,"description":"\u6536\u8d3950\u5143\/3\u5f20\uff0c\u5ba2\u6237\u5728\u63d0\u4ea4\u7533\u8bf7\u7684\u5907\u6ce8\u8bf4\u660e\u4e2d\u9700\u586b\u5199\u63a5\u6536\u56fe\u7247\u7684\u90ae\u7bb1\u5730\u5740\u3002","logistic_path_id":-1,"user_group":0,"base_price":50,"based_on":0,"is_deletable":1},{"id":34,"service_name":"\u51fa\u5e93\u6e05\u70b9","type":3,"description":"\u6bcf\u5355\u6536\u8d3930\u5143","logistic_path_id":-1,"user_group":0,"base_price":30,"based_on":0,"is_deletable":1},{"id":35,"service_name":"\u4f7f\u7528\u5c0f\u5185\u7bb1","type":3,"description":"\u51cf\u514d\u8d39\u7528\u6d4b\u8bd5","logistic_path_id":-1,"user_group":0,"base_price":-30,"based_on":0,"is_deletable":1}],"pivot":{"user_level_id":41,"logistic_path_id":50,"is_usable":1,"discount_ratio":"1.000"}}],"extra_services":[{"id":21,"service_name":"\u5165\u5e93\u6e05\u70b9","type":1,"description":"\u5165\u5e93\u6e05\u70b9\u6bcf\u5355\u6536\u8d3930\u5143\u3002","logistic_path_id":-1,"user_group":1,"base_price":30,"based_on":0,"is_deletable":1,"pivot":{"user_level_id":41,"extra_service_id":21,"is_usable":1,"discount_ratio":"0.000"}},{"id":30,"service_name":"\u5165\u5e93\u62cd\u7167\u670d\u52a1","type":1,"description":"\u6536\u8d3950\u5143\/3\u5f20\uff0c\u5ba2\u6237\u5728\u63d0\u4ea4\u7533\u8bf7\u7684\u5907\u6ce8\u8bf4\u660e\u4e2d\u9700\u586b\u5199\u63a5\u6536\u56fe\u7247\u7684\u90ae\u7bb1\u5730\u5740\u3002","logistic_path_id":-1,"user_group":0,"base_price":50,"based_on":0,"is_deletable":1,"pivot":{"user_level_id":41,"extra_service_id":30,"is_usable":1,"discount_ratio":"0.000"}},{"id":34,"service_name":"\u51fa\u5e93\u6e05\u70b9","type":3,"description":"\u6bcf\u5355\u6536\u8d3930\u5143","logistic_path_id":-1,"user_group":0,"base_price":30,"based_on":0,"is_deletable":1,"pivot":{"user_level_id":41,"extra_service_id":34,"is_usable":1,"discount_ratio":"0.000"}},{"id":35,"service_name":"\u4f7f\u7528\u5c0f\u5185\u7bb1","type":3,"description":"\u51cf\u514d\u8d39\u7528\u6d4b\u8bd5","logistic_path_id":-1,"user_group":0,"base_price":-30,"based_on":0,"is_deletable":1,"pivot":{"user_level_id":41,"extra_service_id":35,"is_usable":1,"discount_ratio":"0.000"}},{"id":36,"service_name":"\u9700\u53e6\u8d2d\u8fd0\u8d39","type":3,"description":"\u53e6\u8d2dDHL\u90ae\u8def\u8d39\u7528","logistic_path_id":49,"user_group":0,"base_price":200,"based_on":0,"is_deletable":1,"pivot":{"user_level_id":41,"extra_service_id":36,"is_usable":1,"discount_ratio":"0.000"}}]};
    // user.unread_conversation = 0;
    // user.unread_notification = 0;
    // angular.module('home').constant('UserInfo', user);
    
    
    
    
    

})();
