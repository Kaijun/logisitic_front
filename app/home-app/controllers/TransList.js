/*  TODO: 之后可以抽象成一个Directive 用作所有的ListView!!! */

'use strict';
;(function () {
    
    angular.module('home.controllers')
    .controller('TransListCtrl', ['$scope', '$state', '$filter', 'TransService', 'InfoService', 'ngTableParams', 
    function($scope, $state, $filter, TransService, InfoService, ngTableParams) {
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
            TransService.getTranss().then(function (list) {
                list.map(function (item) {
                    item.createdTime = (new Date(item.created_at.date)).toISOString().substring(0, 10);
                    item.updatedTime = (new Date(item.updated_at.date)).toISOString().substring(0, 10);
                    item.statusStr = InfoService.getStockStatusMapping(parseInt(item.status));
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
                $scope.filterStockList = $filter('filter')($scope.stockList, {status: statusId});
            }
            $scope.toggleStatus = statusId;
            $scope.tableParams.reload();
        }

        function goToDetail (transId) {
            $state.go('transDetail', {transId: transId});
        }

    }]);
})();