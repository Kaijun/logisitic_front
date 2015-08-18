(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('OrderList', OrderList);

    OrderList.$inject = ['$scope', 'OrderService', '$timeout', '$state', '$http', 'InfoService'];

    /* @ngInject */
    function OrderList($scope, OrderService, $timeout, $state, $http, InfoService) {
        $scope.orders = [];
        $scope.goToDetail = goToDetail;
        $scope.pageInfo = null;

        $scope.requestPage = requestPage;

        activate();

        ////////////////

        function activate() {
            OrderService.getOrders().then(function(data){
                $scope.orders = data.data.filter(function (item) {
                    return true;
                    // return item.ship_status != null;
                });
                $scope.orders.map(function (item) {
                    item.statusStr = InfoService.getOrderStatusMapping(parseInt(item.status));
                    item.dateStr = (new Date(item.updated_time.date)).toISOString().substring(0, 10);
                })
                $timeout(function () {
                    $scope.pageInfo = data;
                })
            })
        }
        function goToDetail (orderId) {
            $state.go('orderDetail', {orderId: orderId});
        }
        function requestPage (url) {
            $http.get(url).then(function (response) {
                $scope.orders = response.data.data.filter(function (item) {
                    return true;
                    // return item.ship_status !== null;
                });
                $scope.orders.map(function (item) {
                    item.statusStr = InfoService.getOrderStatusMapping(parseInt(item.status));
                    item.dateStr = (new Date(item.updated_time.date)).toISOString().substring(0, 10);
                })
                $timeout(function () {
                    $scope.pageInfo = response.data;
                })
            })
        }
    }
})();