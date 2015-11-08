/*  TODO: 之后可以抽象成一个Directive 用作所有的ListView!!! */

'use strict';
;(function () {
    
    angular.module('home.controllers')
    .controller('TransListCtrl', ['$scope', '$state', '$filter', 'TransService', 'InfoService', 'ngTableParams', '$stateParams',
    function($scope, $state, $filter, TransService, InfoService, ngTableParams, $stateParams) {
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
                    var dt = item.created_at.date;
                    var du = item.created_at.date;
                    
                    // item.createdTime = dt.substr(0,4) + '-' + dt.substr(5,2) + '-' + dt.substr(8,2) ;
                    // item.updatedTime = du.substr(0,4) + '-' + du.substr(5,2) + '-' + du.substr(8,2);

                    item.createdTime = item.created_at.date.substring(0, 10);
                    item.updatedTime = item.updated_at.date.substring(0, 10);
                    item.statusStr = InfoService.getStockStatusMapping(parseInt(item.status));
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