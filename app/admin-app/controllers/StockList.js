(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockListCtrl', StockListCtrl);

    StockListCtrl.$inject = ['$scope', '$state', '$http', '$timeout', 'StockService'];

    /* @ngInject */
    function StockListCtrl($scope, $state, $http, $timeout, StockService) {
        $scope.StockService = StockService;
        $scope.isPreStockList = false;

        $scope.stocks = [];
        $scope.goToDetail = goToDetail;
        $scope.enterStock = enterStock;
        $scope.deleteStock = deleteStock;
        $scope.stockSelected = stockSelected;
        $scope.batchDownload = batchDownload;
        $scope.pageInfo = null;
        $scope.requestPage = requestPage;

        $scope.$state = $state;

        var selectedStocks = [];

        activate();

        ////////////////

        function activate() {
            var status = '';
            if($state.current.name=="preStockList"){
                status = 1;
                $scope.isPreStockList = true;
            }
            else{
                status = 4
            }
            StockService.getStocks(status).then(function(data){
                $scope.stocks = data.data;
                $scope.stocks.map(function (item) {
                    item.created_time = item.created_time.date.substr(0,10);
                    item.selected = arrayExist(selectedStocks, item.package_id);
                });
                $timeout(function () {
                    $scope.pageInfo = data;
                })
            })
        }
        function goToDetail (stock) {
            $state.go('stockDetail', {stockId: stock.package_id});
        }
        function requestPage (url) {
            $http.get(url).then(function (response) {
                $scope.stocks = response.data.data;
                $scope.stocks.map(function (item) {
                    item.created_time = item.created_time.date.substr(0,10);
                    item.selected = arrayExist(selectedStocks, item.package_id);
                });
                $timeout(function () {
                    $scope.pageInfo = response.data;
                })
            })
        }

        function enterStock (stock) {
            if(stock.package_id){

                swal({
                    title: "确认入库?",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {

                    StockService.enterStock(stock.package_id).then(function(data) {
                        $timeout(function () {
                            stock.status = 4;
                        })
                    });
                })
                

            }
        }
        function deleteStock (stock) {
            if(stock.package_id){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {
                    StockService.deleteStock(stock.package_id).then(function(data) {
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
                selectedStocks.push(stock.package_id);
            }
            else{
                selectedStocks.map(function (item, idx, arry) {
                    if(item === stock.package_id){
                        arry.splice(idx, 1);
                    }
                })
            }
        }
        function arrayExist (array, item) {
            if(angular.isArray(array)){
                return array.indexOf(item) > -1;
            }
        }
        function batchDownload () {
            StockService.batchDownload(selectedStocks);
        }


    }
})();