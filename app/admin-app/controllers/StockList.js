(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockListCtrl', StockListCtrl);

    StockListCtrl.$inject = ['$scope', '$state', '$http', '$timeout', 'StockService', '$stateParams', '$window'];

    /* @ngInject */
    function StockListCtrl($scope, $state, $http, $timeout, StockService, $stateParams, $window) {
        $scope.StockService = StockService;
        // $scope.isPreStockList = false;

        $scope.stocks = [];
        $scope.goToDetail = goToDetail;
        $scope.enterStock = enterStock;
        $scope.deleteStock = deleteStock;
        $scope.stockSelected = stockSelected;
        $scope.batchDownload = batchDownload;
        $scope.batchPrint = batchPrint;
        $scope.pageInfo = null;
        $scope.requestPage = requestPage;
        $scope.selectAllItems = selectAllItems;

        $scope.$state = $state;

        var selectedStockIds = [];
        var selectedStockObjects = [];

        activate();

        ////////////////

        function activate() {

            var status = $stateParams.stockStatus || '';
            StockService.getStocks(status).then(function(data){
                $scope.stocks = data.data;
                $scope.stocks.map(function (item) {
                    item.created_at = item.created_at.substr(0,10);
                    item.updated_at = item.updated_at.substr(0,10);
                    item.selected = arrayExist(selectedStockIds, item.id);
                });
                $timeout(function () {
                    $scope.pageInfo = data;
                })
            })
        }
        function goToDetail (stock) {
            $state.go('stockDetail', {stockId: stock.id});
        }
        function requestPage (url) {
            $http.get(url).then(function (response) {
                $scope.stocks = response.data.data;
                $scope.stocks.map(function (item) {
                    item.created_at = item.created_at.substr(0,10);
                    item.updated_at = item.updated_at.substr(0,10);
                    item.selected = arrayExist(selectedStockIds, item.id);
                });
                $timeout(function () {
                    $scope.pageInfo = response.data;
                })
            })
        }

        function enterStock (stock) {
            if(stock.id){

                swal({
                    title: "确认入库?",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {

                    StockService.enterStock(stock.id).then(function(data) {
                        $timeout(function () {
                            stock.status = 4;
                        })
                    });
                })
                

            }
        }
        function deleteStock (stock) {
            if(stock.id){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                }, function () {
                    StockService.deleteStock(stock.id).then(function(data) {
                        if(data.success===true){
                            swal("删除成功", "", "success");
                            $scope.stocks.map(function (item, index, arry) {
                                if(item === stock){
                                    arry.splice(index, 1);
                                }
                            })
                        }
                    });
                })
            }
        }

        function stockSelected (stock) {
            if(stock.selected===true){
                selectedStockIds.push(stock.id);
                selectedStockObjects.push(stock);
            }
            else{
                selectedStockIds.map(function (item, idx, arry) {
                    if(item === stock.id){
                        arry.splice(idx, 1);
                    }
                })
                selectedStockObjects.map(function (item, idx, arry) {
                    if(item.id === stock.id){
                        arry.splice(idx, 1);
                    }
                })
            }
        }
        function selectAllItems () {
            var shouldSelectAll = $scope.stocks.some(function (item) {
                return item.selected === false;
            });
            if(shouldSelectAll){
                $scope.stocks.filter(function (stock) {
                    return stock.selected === false;
                }).forEach(function (stock) {
                    stock.selected = true;
                    selectedStockIds.push(stock.id);
                    selectedStockObjects.push(stock)
                });
                $scope.isAllSelected = true;
            }
            else{
                $scope.stocks.forEach(function (stock) {
                    stock.selected = false;
                    selectedStockIds.map(function (item, idx, arry) {
                        if(item === stock.id){
                            arry.splice(idx, 1);
                        }
                    });
                    selectedStockObjects.map(function (item, idx, arry) {
                        if(item.id === stock.id){
                            arry.splice(idx, 1);
                        }
                    });

                })
                $scope.isAllSelected = false;
            }

        }
        function arrayExist (array, item) {
            if(angular.isArray(array)){
                return array.indexOf(item) > -1;
            }
        }
        function batchDownload () {
            if(!selectedStockIds || selectedStockIds.length==0){
                swal('请选择项目', '', 'error');
                return;
            }
            StockService.batchDownload(selectedStockIds);
        }

        function batchPrint() {

            if(!selectedStockObjects || selectedStockObjects.length==0){
                swal('请选择项目', '', 'error');
                return;
            }
            $window.localStorage.setItem('printStockData', angular.toJson(selectedStockObjects));
            var url = $state.href('printStock');
            var newWindow = $window.open(url,'_blank');
        
        }


    }
})();