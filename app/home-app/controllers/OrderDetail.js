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

        $scope.editOrder = editOrder;
        $scope.deleteOrder = deleteOrder;

        $scope.payOrder = payOrder;

        activate();

        ////////////////

        function activate() {

                if($stateParams.orderId){
                    var orderId = $stateParams.orderId;
                    OrderService.getOrderById(orderId).then(function (data) {
                        // data.timestampStr = data.timestamp.date.substr(0,4) + '-' + data.timestamp.date.substr(5,2) + '-' + data.timestamp.date.substr(8,2);

                        data.timestampStr = data.timestamp.date.substring(0, 10);
                        
                        return data;
                    },
                    function(){
                        $state.go('index');
                    }).then(function (data) {
                        InfoService.getTypes().then(function (lts) {
                            data.items.forEach(function (item) {
                                lts.some(function (i) {
                                    if(item.type == i.id){
                                        item.typeName = i.type_name;
                                        return true;
                                    }
                                })
                            });
                            $timeout(function() {
                                $scope.order = data;
                                $scope.order.statusStr = InfoService.getOrderStatusMapping(data.order_status);
                            });
                        })

                        InfoService.getWarehouseById(data.warehouse).then(function (wh){
                            $timeout(function() {
                                $scope.warehouse = wh;
                            })
                        });
                        InfoService.getLogisticPathById(data.ship_company,0).then(function (lp){
                            $timeout(function() {
                                $scope.order.logisticPath = lp;
                            })
                        });
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
            OrderService.deleteOrder($stateParams.orderId).then(function() {
                $state.go('orderList');
            }, function () {
                // body...
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