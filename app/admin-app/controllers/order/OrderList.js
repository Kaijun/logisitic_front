(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('OrderList', OrderList);

    OrderList.$inject = ['$scope', 'OrderService', '$timeout', '$state', '$http', 'InfoService', '$stateParams', '$window'];

    /* @ngInject */
    function OrderList($scope, OrderService, $timeout, $state, $http, InfoService, $stateParams, $window) {
        $scope.orders = [];
        $scope.goToDetail = goToDetail;
        $scope.deleteOrder = deleteOrder;
        $scope.batchDownload = batchDownload;
        $scope.batchPrintPackList = batchPrintPackList;
        $scope.batchPrintPostList = batchPrintPostList;
        $scope.orderSelected = orderSelected;
        $scope.pageInfo = null;

        $scope.requestPage = requestPage;
        $scope.selectAllItems = selectAllItems;

        var selectedOrders = [];

        activate();

        ////////////////

        function activate() {

            var status = $stateParams.orderStatus || '';
            OrderService.getOrders(status).then(function(data){
                $scope.orders = data.data.filter(function (item) {
                    return item.id;
                });
                $scope.orders.map(function (item) {
                    item.statusStr = InfoService.getOrderStatusMapping(parseInt(item.order_status));
                    item.dateStr = item.created_at.substring(0, 10);
                    item.selected = arrayExist(selectedOrders, item);
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
                    return item.id;
                    // return item.ship_status !== null;
                });
                $scope.orders.map(function (item) {
                    item.statusStr = InfoService.getOrderStatusMapping(parseInt(item.order_status));
                    item.dateStr = item.created_at.substring(0, 10);
                    item.selected = arrayExist(selectedOrders, item);
                })
                $timeout(function () {
                    $scope.pageInfo = response.data;
                })
            })
        }

        function deleteOrder (order) {
            if(order.id){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                }, function () {
                    OrderService.deleteOrder(order.id).then(function(data) {
                        if(data.success===true){
                            swal("删除成功", "", "success");
                            $scope.orders.map(function (item, index, arry) {
                                if(item === order){
                                    arry.splice(index, 1);
                                }
                            })
                        }
                    });
                })
            }
        }


        function orderSelected (order) {
            if(order.selected===true){
                selectedOrders.push(order);
            }
            else{
                selectedOrders.map(function (item, idx, arry) {
                    if(item === order){
                        arry.splice(idx, 1);
                    }
                })
            }
        }


        function selectAllItems () {
            var shouldSelectAll = $scope.orders.some(function (item) {
                return item.selected === false;
            });
            if(shouldSelectAll){
                $scope.orders.filter(function (order) {
                    return order.selected === false;
                }).forEach(function (order) {
                    order.selected = true;
                    selectedOrders.push(order);
                });
                $scope.isAllSelected = true;
            }
            else{
                $scope.orders.forEach(function (order) {
                    order.selected = false;
                    selectedOrders.map(function (item, idx, arry) {
                        if(parseInt(item.id) === (order.id)){
                            arry.splice(idx, 1);
                        }
                    });

                })
                $scope.isAllSelected = false;
            }

        }
        function arrayExist (array, item) {
            if(angular.isArray(array)){
                return array.some(function (i) {
                    return parseInt(item.id) === parseInt(i.id)
                });
            }
        }
        function batchDownload () {
            if(!selectedOrders || selectedOrders.length==0){
                swal('请选择项目', '', 'error');
                return;
            }
            var ids = [];
            selectedOrders.forEach(function (item) {
                ids.push(item.id);
            });
            OrderService.batchDownload(ids);
        }
        function batchPrintPackList () {
            $window.localStorage.setItem('printPrepareListData', angular.toJson(selectedOrders));
            var url = $state.href('printPrepareList');
            var newWindow = $window.open(url,'_blank');
            // 修改过打印的状态
            swal({
                    title: "已打印?",
                    text: "若已打印, 请点击确认修改运单状态, 若未打印请点击取消",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function(){
                    for (var i = selectedOrders.length - 1; i >= 0; i--) {
                        if(selectedOrders[i].order_status == 1){
                             OrderService.editOrder(selectedOrders[i].id, {
                                order_status: 7,
                            })
                        }
                    };
                    $state.go($state.current, {orderId: $stateParams.orderId}, {reload: true});
               })     

        }
        function batchPrintPostList () {
            $window.localStorage.setItem('printShipData', angular.toJson(selectedOrders));
            var url = $state.href('printShip');
            var newWindow = $window.open(url,'_blank');
            swal({
                    title: "已打印?",
                    text: "若已打印, 请点击确认修改运单状态, 若未打印请点击取消",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function(){
                    for (var i = selectedOrders.length - 1; i >= 0; i--) {
                        if(selectedOrders[i].order_status == 3){
                             OrderService.editOrder(selectedOrders[i].id, {
                                order_status: 4,
                            })
                        }
                    };
                    $state.go($state.current, {orderId: $stateParams.orderId}, {reload: true});
               })   
        }


    }
})();