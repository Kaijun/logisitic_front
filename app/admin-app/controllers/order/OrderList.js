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
        $scope.deleteOrder = deleteOrder;
        $scope.batchDownload = batchDownload;
        $scope.orderSelected = orderSelected;
        $scope.pageInfo = null;

        $scope.requestPage = requestPage;

        var selectedOrders = [];

        activate();

        ////////////////

        function activate() {
            OrderService.getOrders().then(function(data){
                $scope.orders = data.data.filter(function (item) {
                    return item.id;
                });
                $scope.orders.map(function (item) {
                    item.statusStr = InfoService.getOrderStatusMapping(parseInt(item.order_status));
                    item.dateStr = (new Date(item.created_time.date)).toISOString().substring(0, 10);
                    item.selected = arrayExist(selectedOrders, item.id);
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
                    item.dateStr = (new Date(item.created_time.date)).toISOString().substring(0, 10);
                    item.selected = arrayExist(selectedOrders, item.id);
                })
                $timeout(function () {
                    $scope.pageInfo = response.data;
                    console.log($scope.pageInfo)
                })
            })
        }

        function deleteOrder (order) {
            if(order.id){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
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
                selectedOrders.push(order.id);
            }
            else{
                selectedOrders.map(function (item, idx, arry) {
                    if(item === order.id){
                        arry.splice(idx, 1);
                    }
                })
            }
            console.log(selectedOrders)
        }
        function arrayExist (array, item) {
            if(angular.isArray(array)){
                return array.indexOf(item) > -1;
            }
        }
        function batchDownload () {
            OrderService.batchDownload(selectedOrders);
        }

    }
})();