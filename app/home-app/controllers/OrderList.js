/*  TODO: 之后可以抽象成一个Directive 用作所有的ListView!!! */

'use strict';
;(function () {
    
    angular.module('home.controllers')
    .controller('OrderListCtrl', ['$scope', '$state', '$filter', 'OrderService', 'InfoService', 'ngTableParams', 
    function($scope, $state, $filter, OrderService, InfoService, ngTableParams) {
        $scope.filterStockList = [];
        $scope.stockList = [];
        $scope.goToDetail = goToDetail;
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
        })
        active();

        function active () {
            OrderService.getOrders().then(function (list) {

                list = list.filter(function (item) {
                    var order_status = item.order_status;
                    return order_status!=null;
                });

                list.map(function (item) {
                    var dt = item.created_at;
                    var du = item.created_at;
                    item.createdTime = dt.substr(0, 4) + '-' + dt.substr(5,2) + '-' + dt.substr(8,2);
                    item.updatedTime = du.substr(0, 4) + '-' + du.substr(5,2) + '-' + du.substr(8,2);
                    item.statusStr = InfoService.getOrderStatusMapping(parseInt(item.order_status));
                    return item;
                })
                $scope.stockList = list;
                $scope.filterStockList = list;
                $scope.tableParams.reload();
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

    }]);
})();