(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('OrderDetail', OrderDetail);

    OrderDetail.$inject = ['$scope', '$stateParams', 'OrderService', 'InfoService', '$timeout'];

    /* @ngInject */
    function OrderDetail($scope, $stateParams, OrderService, InfoService, $timeout) {
  
        $scope.order = null;
        $scope.isWeightPopupShown = false;
        $scope.weightSum = null
        $scope.weight = null;

        $scope.weightAndPack = weightAndPack;
        $scope.weightAndPackConfirm = weightAndPackConfirm;
        $scope.weightAndPackCancle = weightAndPackCancle;
        $scope.confirmShip = confirmShip;
        activate();

        ////////////////

        function activate() {
            if($stateParams.orderId){
                OrderService.getOrderById($stateParams.orderId).then(function(data) {
                    $timeout(function () {
                        $scope.order = data;
                        $scope.order.statusStr = InfoService.getStockStatusMapping(data.ship_status);
                        $scope.weightSum = getAllItemsWeight(data);
                    })
                });
            }
        }

        function confirmShip () {
            OrderService.editOrder($stateParams.orderId, {
                ship_status: 11
            }).then(function() {

            })
        }

        function weightAndPack () {
            $scope.isWeightPopupShown = true;
        }
        function weightAndPackConfirm () {
            OrderService.editOrder($stateParams.orderId, {
                weight: $scope.weight,
                ship_status: 9,
            }).then(function() {
                weightAndPackCancle();
            })
        }
        function weightAndPackCancle () {
            $scope.isWeightPopupShown = false;
            $scope.weight = null;
        }

        function getAllItemsWeight (order) {
            if(angular.isArray(order.items)&&order.items.length>0){
                var weightSum = 0;
                order.items.forEach(function (item) {
                    weightSum = weightSum + item.unit_weight*item.quantity;
                });
                return weightSum;
            }
        }
    }
})();