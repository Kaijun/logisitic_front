/*  TODO: 之后可以抽象成一个Directive 用作所有的ListView!!! */

'use strict';
;(function () {
	
    angular.module('home.controllers')
    .controller('StockListCtrl', ['$scope', '$state', '$filter', 'StockService', 'ngTableParams', 
    function($scope, $state, $filter, StockService, ngTableParams) {
        var filterStockList = [];
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
                $defer.resolve(filterStockList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                params.total(filterStockList.length); // set total for recalc pagination
            }
        })
        active();

        function active () {
            StockService.getStocks().then(function (list) {
                list.map(function (item) {
                    item.timestampStr = (new Date(item.timestamp.date)).toISOString().substring(0, 10);;
                    item.statusStr = StockService.getStockStatusMapping(parseInt(item.status));
                    return item;
                })
                $scope.stockList = list;
                filterStockList = list;
                $scope.tableParams.reload();
                console.log(list)
            });

            $scope.$watch('searchText', function (newValue, oldValue) {
                
            });
        }
    	
        function toggleStatusFilter(statusId){
            if(statusId===-1){
                filterStockList = $scope.stockList;
            }
            else{
                filterStockList = $filter('filter')($scope.stockList, {status: statusId});
            }
            $scope.toggleStatus = statusId;
            $scope.tableParams.reload();
        }

        function goToDetail (stockId) {
            $state.go('stockDetail', {stockId: stockId});
        }

    }]);
})();