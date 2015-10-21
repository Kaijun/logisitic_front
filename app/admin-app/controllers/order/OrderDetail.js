(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('OrderDetail', OrderDetail);

    OrderDetail.$inject = ['$scope', '$stateParams', 'OrderService', 'InfoService', 'LogisticService', '$timeout', '$state', '$window'];

    /* @ngInject */
    function OrderDetail($scope, $stateParams, OrderService, InfoService,LogisticService, $timeout, $state, $window) {
  
        $scope.order = null;
        $scope.isWeightPopupShown = false;
        $scope.weightSum = null
        $scope.weight = null;
        $scope.$stateParams = $stateParams;


        $scope.weightAndPack = weightAndPack;
        $scope.weightAndPackConfirm = weightAndPackConfirm;
        $scope.weightAndPackCancle = weightAndPackCancle;
        $scope.printPackListconfirm = printPackListconfirm;
        $scope.printPostListconfirm = printPostListconfirm;
        $scope.editOrder = editOrder;
        $scope.deleteOrder = deleteOrder;
        // $scope.cancleEditOrder = cancleEditOrder;
        $scope.confirmShip = confirmShip;
        activate();

        ////////////////

        function activate() {
            if($stateParams.orderId){
                OrderService.getOrderById($stateParams.orderId).then(function(data) {
                    $timeout(function () {
                        $scope.order = data;
                        $scope.order.statusStr = InfoService.getOrderStatusMapping(data.order_status);

                        $scope.order.created_time.date = data.created_time.date.substring(0, 10);
                        $scope.order.updated_time.date = data.updated_time.date.substring(0, 10);

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
                            data.logisticPath = lp;
                        })
                    });
                    LogisticService.getLogisticTracks().then(function (lts) {
                        $timeout(function () {
                            $scope.logisticTracks = lts;
                            $scope.ship_status_string = $scope.logisticTracks.filter(function (item) {
                                return item.id == $scope.order.ship_status;
                            })[0].name;
                        })
                    })
                    LogisticService.getLogisticTypes().then(function (lts) {
                        $timeout(function () {
                            $scope.order.items.forEach(function (item) {
                                lts.some(function (i) {
                                    if(item.type == i.id){
                                        item.typeName = i.type_name;
                                        return true;
                                    }
                                })
                            })
                        })
                    })
                });
            }
        }

        //确认发货 - 已发货
        function confirmShip () {
            if($scope.order.ship_tracknumber.International && $scope.order.ship_tracknumber.China){
                OrderService.editOrder($stateParams.orderId, {
                    order_status: 5
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
            if($scope.order.order_status==1){
                OrderService.editOrder($stateParams.orderId, {
                    weight: $scope.weight,
                    order_status: 2,
                }).then(function() {
                    weightAndPackCancle();
                    $state.go($state.current, {orderId: $stateParams.orderId}, {reload: true});
                })
            }
            else{
                OrderService.editOrder($stateParams.orderId, {
                    weight: $scope.weight,
                }).then(function() {
                    weightAndPackCancle();
                    $state.go($state.current, {orderId: $stateParams.orderId}, {reload: true});
                })
            }
        }

        //打印配货单 - 不该状态 - 引导称重
        function printPackListconfirm () {
            // $window.open($state.href('stateName', {}, {absolute: true}), '_blank');
            $window.localStorage.setItem('printPrepareListData', angular.toJson($scope.order));
            var url = $state.href('printPrepareList');
            var newWindow = $window.open(url,'_blank');
        }
        //打印面单 后 - 代发货
        function printPostListconfirm () {
            if($scope.order_status==3){
                swal({
                    title: "已打印?",
                    text: "若已打印, 请点击确认修改运单状态, 若未打印请点击取消",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {
                    OrderService.editOrder($stateParams.orderId, {
                        order_status: 4,
                    }).then(function() {
                        $state.go($state.current, {orderId: $stateParams.orderId}, {reload: true});
                    })

                    $window.localStorage.setItem('printShipData', angular.toJson($scope.order));
                    var url = $state.href('printShip');
                    var newWindow = $window.open(url,'_blank');
                })
            }
            else{
                    $window.localStorage.setItem('printShipData', angular.toJson($scope.order));
                    var url = $state.href('printShip');
                    var newWindow = $window.open(url,'_blank');
            }
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
            if($scope.order.order_status < 5){
                if($scope.order.ship_tracknumber.International || $scope.order.ship_tracknumber.China){
                    $scope.order.order_status = 5;
                }
            }
            OrderService.editOrder($stateParams.orderId, $scope.order).then(function() {
                $state.go($state.current, {orderId: $stateParams.orderId}, {reload: true});
            })
        }
        function deleteOrder () {
            if($scope.order.id){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {
                    OrderService.deleteOrder($scope.order.id).then(function(data) {
                        if(data.success===true){
                            swal("删除成功", "", "success");
                            $state.go("orderList", {}, {reload: true})
                        }
                    });
                })
            }
        }
        // function cancleEditOrder () {
        //     $scope.isWeightEditShown = false; 
        //     $scope.isShipStatusEditShown = false;
        //     $scope.isTrackNumEditShown = false;
        // }
        $scope.convertToInt = function(id){
            return parseInt(id, 10);
        };
        $scope.goBack = function(){
            $window.history.back();
        };
    }
})();