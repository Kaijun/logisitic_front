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
        $scope.printPackListconfirm = printPackListconfirm;
        $scope.printPostListconfirm = printPostListconfirm;
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

        //确认发货 - 已发货
        function confirmShip () {
            OrderService.editOrder($stateParams.orderId, {
                ship_status: 5
            }).then(function() {

            })
        }

        function weightAndPack () {
            $scope.isWeightPopupShown = true;
        }

        //确认称重 - 代付款
        function weightAndPackConfirm () {
            OrderService.editOrder($stateParams.orderId, {
                weight: $scope.weight,
                ship_status: 2,
            }).then(function() {
                weightAndPackCancle();
            })
        }

        //打印配货单 - 不该状态 - 引导称重
        function printPackListconfirm () {
            //- 引导称重
        }
        //打印面单 后 - 代发货
        function printPostListconfirm () {
            OrderService.editOrder($stateParams.orderId, {
                weight: $scope.weight,
                ship_status: 4,
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