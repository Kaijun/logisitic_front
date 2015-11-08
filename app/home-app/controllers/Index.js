(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('IndexCtrl', IndexCtrl);

    IndexCtrl.$inject = ['$scope', 'InfoService', 'StockService', 'OrderService', 'TransService', '$timeout', '$state', 'UserInfo'];

    /* @ngInject */
    function IndexCtrl($scope, InfoService, StockService, OrderService, TransService, $timeout, $state, UserInfo) {
        $scope.userInfo = UserInfo;
        $scope.currentView = 0;
        $scope.currentStocks = [];
        $scope.currentOrders = [];
        $scope.currentTranss = [];
        $scope.digits = {};

        activate();

        ////////////////

        function activate() {
            InfoService.getDigits().then(function (data) {
                $timeout(function () {
                    $scope.digits = data;
                })
            })
        }

        $scope.toggleView = function (viewNum) {
            $scope.currentView = viewNum;
            if(viewNum===1){
                StockService.getCurrentStocks().then(function (list) {
                    list.map(function (item) {
                        item.timestampStr = item.timestamp.date.substring(0, 10);
                        item.inStockTime = Math.floor((new Date() - new Date(item.timestamp.date)) / (1000*60*60*24)) + 1;
                        item.statusStr = InfoService.getStockStatusMapping(parseInt(item.status));
                        return item;
                    })
                    $scope.currentStocks = list;
                });
            }
            else if(viewNum === 2){
                OrderService.getCurrentOrders().then(function (list) {
                    list.map(function (item) {
                      item.createdTime = item.created_at.substring(0, 10);
                        item.updatedTime = item.updated_at.substring(0, 10);
                        item.statusStr = InfoService.getOrderStatusMapping(parseInt(item.order_status));
                        return item;
                    })
                    $scope.currentOrders = list;
                });  
            }
            else if(viewNum === 3){
                TransService.getCurrentTranss().then(function (list) {
                    list.map(function (item) {
                        item.createdTime = item.created_at.date.substring(0, 10);
                        item.updatedTime = item.updated_at.date.substring(0, 10);
                        item.statusStr = InfoService.getStockStatusMapping(parseInt(item.status));
                        return item;
                    })
                    $scope.currentTranss = list;
                });  
            }
        }
    }
})();