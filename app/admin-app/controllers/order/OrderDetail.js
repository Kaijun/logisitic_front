(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('OrderDetail', OrderDetail);

    OrderDetail.$inject = ['$scope', '$stateParams', 'OrderService', 'InfoService', '$timeout', '$state'];

    /* @ngInject */
    function OrderDetail($scope, $stateParams, OrderService, InfoService, $timeout, $state) {
  
        $scope.order = null;
        $scope.isWeightPopupShown = false;
        $scope.weightSum = null
        $scope.weight = null;



        $scope.weightAndPack = weightAndPack;
        $scope.weightAndPackConfirm = weightAndPackConfirm;
        $scope.weightAndPackCancle = weightAndPackCancle;
        $scope.printPackListconfirm = printPackListconfirm;
        $scope.printPostListconfirm = printPostListconfirm;
        $scope.editOrder = editOrder;
        // $scope.cancleEditOrder = cancleEditOrder;
        $scope.confirmShip = confirmShip;
        activate();

        ////////////////

        function activate() {
            if($stateParams.orderId){
                OrderService.getOrderById($stateParams.orderId).then(function(data) {
                    $timeout(function () {
                        $scope.order = data;
                        $scope.order.statusStr = InfoService.getOrderStatusMapping(data.ship_status);

                        $scope.order.created_time.date = (new Date(data.created_time.date)).toISOString().substring(0, 10);
                        $scope.order.updated_time.date = (new Date(data.updated_time.date)).toISOString().substring(0, 10);

                        $scope.weightSum = getAllItemsWeight(data);
                    })
                    return data;
                }).then(function (data) {
                    InfoService.getWarehouseById(data.warehouse).then(function (wh){
                        $timeout(function() {
                            $scope.warehouse = wh;
                        })
                    });
                    InfoService.getLogisticPathById(data.ship_company,0).then(function (lp){
                        $timeout(function() {
                            $scope.logisticPath = lp;
                        })
                    });
                });
            }
        }

        //确认发货 - 已发货
        function confirmShip () {
            if($scope.order.ship_tracknumber.International && $scope.order.ship_tracknumber.China){
                OrderService.editOrder($stateParams.orderId, {
                    ship_status: 5
                }).then(function() {
                    $state.go($state.current, {orderId: $stateParams.orderId}, {reload: true});
                })
            }
            else{
                $scope.isTrackNumEditShown = true;
            }
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
                $state.go($state.current, {orderId: $stateParams.orderId}, {reload: true});
            })
        }

        //打印配货单 - 不该状态 - 引导称重
        function printPackListconfirm () {
            //- 引导称重
        }
        //打印面单 后 - 代发货
        function printPostListconfirm () {
            OrderService.editOrder($stateParams.orderId, {
                ship_status: 4,
            }).then(function() {
                $state.go($state.current, {orderId: $stateParams.orderId}, {reload: true});
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

        function editOrder () {
            //如果填写了跟踪号码 则发货!!!
            if($scope.order.ship_status < 5){
                if($scope.order.ship_tracknumber.International || $scope.order.ship_tracknumber.China){
                    $scope.order.ship_status = 5;
                }
            }
            OrderService.editOrder($stateParams.orderId, $scope.order).then(function() {
                $state.go($state.current, {orderId: $stateParams.orderId}, {reload: true});
            })
        }

        // function cancleEditOrder () {
        //     $scope.isWeightEditShown = false; 
        //     $scope.isShipStatusEditShown = false;
        //     $scope.isTrackNumEditShown = false;
        // }
    }
})();