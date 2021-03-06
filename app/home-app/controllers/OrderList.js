/*  TODO: 之后可以抽象成一个Directive 用作所有的ListView!!! */

'use strict';
;(function () {
    
    angular.module('home.controllers')
    .controller('OrderListCtrl', ['$scope', '$state', '$filter', 'OrderService', 'InfoService', 'ngTableParams', '$stateParams',
    function($scope, $state, $filter, OrderService, InfoService, ngTableParams, $stateParams) {
        $scope.filterStockList = [];
        $scope.stockList = [];
        $scope.goToDetail = goToDetail;
        $scope.deleteOrder = deleteOrder;
        $scope.editOrder = editOrder;
        $scope.toggleStatusFilter = toggleStatusFilter;
        $scope.toggleStatus = -1;
        $scope.searchText = "";

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: $scope.stockList.length, // length of data
            getData: function ($defer, params) {
                $defer.resolve($scope.filterStockList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                params.total($scope.filterStockList.length); // set total for recalc pagination
            }
        });
        active();

        function active () {
            
            OrderService.getOrders().then(function (list) {

                list = list.filter(function (item) {
                    var order_status = item.order_status;
                    return order_status!=null;
                });

                list.map(function (item) {
                    item.createdTime = item.created_at.substring(0, 10);
                    item.updatedTime = item.updated_at.substring(0, 10);
                    item.statusStr = InfoService.getOrderStatusMapping(parseInt(item.order_status));
                    return item;
                })
                $scope.stockList = list;
                $scope.filterStockList = list;
                $scope.tableParams.reload();
            }).then(function () {
                if($stateParams.status){
                    toggleStatusFilter($stateParams.status);
                    $scope.toggleStatus = parseInt($stateParams.status);
                }
            });

            $scope.$watch('searchText', function (newValue, oldValue) {
                
            });
        }
        
        function toggleStatusFilter(statusId){
            if(statusId===-1){
                $scope.filterStockList = $scope.stockList;
            }
            else{
                $scope.filterStockList = $filter('filter')($scope.stockList, {order_status: statusId});
            }
            $scope.toggleStatus = statusId;
            $scope.tableParams.reload();
        }

        function goToDetail (orderId) {
            $state.go('orderDetail', {orderId: orderId});
        }
        function deleteOrder (order) {
            if(order.id){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                }, function () {
                    OrderService.deleteOrder(order.id).then(function() {
                        swal('删除成功', '', 'success');
                        var idx = $scope.stockList.indexOf(order);
                        if(idx > -1){
                            $scope.stockList.splice(idx, 1);
                            $scope.tableParams.reload();
                        }
                    });
                })
            }
        }
        function editOrder (order) {
            $state.go('orderSubmit', {orderId: order.id});
        }

    }]);
})();