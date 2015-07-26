(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('OrderList', OrderList);

    OrderList.$inject = ['$scope', 'OrderService', '$timeout', '$state', '$http'];

    /* @ngInject */
    function OrderList($scope, OrderService, $timeout, $state, $http) {
        $scope.orders = [];
        $scope.goToDetail = goToDetail;
        $scope.pageInfo = null;

        $scope.requestPage = requestPage;

        activate();

        ////////////////

        function activate() {
            OrderService.getOrders().then(function(data){
                $scope.orders = data.data;
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
                $scope.orders = response.data.data;
                $timeout(function () {
                    $scope.pageInfo = response.data;
                })
            })
        }
    }
})();