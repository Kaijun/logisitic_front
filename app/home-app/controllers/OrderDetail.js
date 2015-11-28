(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('OrderDetailCtrl', OrderDetailCtrl);

    OrderDetailCtrl.$inject = ['$scope', 'OrderService', 'InfoService', '$q', '$stateParams', '$state', '$timeout', 'UserInfo', '$window'];

    /* @ngInject */
    function OrderDetailCtrl($scope, OrderService, InfoService, $q, $stateParams, $state, $timeout, UserInfo, $window) {
        
        $scope.order = null;
        $scope.warehouse = null;
        $scope.estimateCost = {
            cost: 0,
            extra_service_cost: [],
        }
        $scope.editOrder = editOrder;
        $scope.deleteOrder = deleteOrder;

        $scope.payOrder = payOrder;

        activate();

        ////////////////

        function activate() {

                if($stateParams.orderId){
                    var orderId = $stateParams.orderId;
                    OrderService.getOrderById(orderId).then(function (order) {
                        // order.timestampStr = order.timestamp.date.substr(0,4) + '-' + order.timestamp.date.substr(5,2) + '-' + order.timestamp.date.substr(8,2);

                        order.timestampStr = order.timestamp.date.substring(0, 10);
                        
                        return order;
                    },
                    function(){
                        $state.go('index');
                    }).then(function (order) {
                        InfoService.getTypes().then(function (lts) {
                            order.items.forEach(function (item) {
                                lts.some(function (i) {
                                    if(item.type == i.id){
                                        item.typeName = i.type_name;
                                        return true;
                                    }
                                })
                            });
                            $timeout(function() {
                                $scope.order = order;
                                $scope.order.statusStr = InfoService.getOrderStatusMapping(order.order_status);
                            });
                        })

                        InfoService.getWarehouseById(order.warehouse).then(function (wh){
                            $timeout(function() {
                                $scope.warehouse = wh;
                            })
                        });
                        InfoService.getLogisticPathById(order.ship_company,0).then(function (lp){
                            $timeout(function() {
                                $scope.order.logisticPath = lp;
                            })
                        });

                        if(order.order_status == 1 || order.order_status == 7){
                            // estimate Cost
                            var estimateObj = {};
                            estimateObj.weight = (function () {
                                var weight = 0;
                                order.items.forEach(function (item) {
                                    weight = weight + parseInt(item.unit_weight)*parseInt(item.quantity);
                                })
                                return weight;
                            })();
                            estimateObj.logistic_path = order.ship_company;
                            estimateObj.extra_services = angular.copy(order.extra_services).map(function (es) {
                                return es.id;
                            });
                            OrderService.getEstimatePrice(estimateObj).then(function (estimateCost) {
                                $timeout(function () {
                                    $scope.estimateCost = estimateCost;
                                    $scope.isConfirmShown = true;
                                });
                            })
                        }
                    })
                }
                else{
                    $state.go('index');
                }

        }

        function editOrder () {
            $state.go('orderSubmit', {orderId: $stateParams.orderId});
        }
        function deleteOrder () {
            swal({
                title: "确认删除?",
                showCancelButton: true,
            }, function () {
                OrderService.deleteOrder($stateParams.orderId).then(function() {
                    swal('删除成功', '', 'success');
                    $state.go('orderList');
                });
            })
        }

        $scope.goBack = function () {
            $window.history.back();
        }
        
        function payOrder () {
            if($scope.order.order_status==2){
                if(UserInfo.remain >= $scope.order.total_cost){
                    swal({
                        title: "确认付款",
                        text: "本次订单将扣款" + $scope.order.total_cost + '元',
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        cancelButtonText: "取消",
                        confirmButtonText: "确定",
                        closeOnConfirm: true,
                    }, function () {
                        OrderService.payOrder($stateParams.orderId).then(function () {
                            swal({
                                title: "付款成功",
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "确定",
                                closeOnConfirm: true,
                            }, function () {
                                $window.location.reload();
                            })
                        })
                    }, function(){
                        swal({
                            title: "付款失败",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            closeOnConfirm: true,
                        })
                    })
                }
                else{
                    swal({
                        title: "余额不足",
                        text: "账户余额不足, 订单待付款" + $scope.order.total_cost + '元',
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        cancelButtonText: "取消",
                        confirmButtonText: "充值",
                        closeOnConfirm: true,
                    }, function () {
                        $state.go('refill', {reload: true});
                    })
                }
            }
        }
    }
})();