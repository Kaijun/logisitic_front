(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockBatch', StockBatch);

    StockBatch.$inject = ['$scope', 'StockService', '$state', '$window'];

    /* @ngInject */
    function StockBatch($scope, StockService, $state, $window) {

        $scope.fileToUpload = null;
        $scope.stockSelected = stockSelected;
        $scope.submitBatch = submitBatch;
        $scope.printBatch = printBatch;
        $scope.stocks = [];

        $scope.upload = upload;

        $scope.selectedStocks = [];

        activate();

        ////////////////

        function activate() {
        }

        function upload () {
            if($scope.fileToUpload){
                StockService.batchUpload($scope.fileToUpload).then(function (data) {
                    data.map(function (item) {
                        item.selected = true;
                    })

                    $scope.stocks = reassembleStocks(data);
                    $scope.selectedStocks = angular.copy($scope.stocks);
                })
            }
        }

        function reassembleStocks (stocks) {
            var newStocks = [];
            stocks.forEach(function (stock) {
                if(indexInNewStocks(stock)<0){
                    stock.items = [{
                        item_name: stock.item_name,
                        quantity: stock.item_quantity,
                        type: stock.item_type,
                        unit_price: stock.item_price,
                        unit_weight: stock.item_weight,
                    }];
                    newStocks.push(stock);
                }
                else{
                    var idx = indexInNewStocks(stock)
                    newStocks[idx].items.push({
                        item_name: stock.item_name,
                        quantity: stock.item_quantity,
                        type: stock.item_type,
                        unit_price: stock.item_price,
                        unit_weight: stock.item_weight,
                    })
                }
            });

            return newStocks;

            function indexInNewStocks (item) {
                var index = -1;
                newStocks.filter(function (i, idx, arry) {
                    if(i.reference_code == item.reference_code)
                        index = idx;
                });
                return index;
            }
        }

        function stockSelected (stock) {
            if(stock.selected===true){
                $scope.selectedStocks.push(stock);
            }
            else{
                $scope.selectedStocks.map(function (item, idx, arry) {
                    if(item === stock){
                        arry.splice(idx, 1);
                    }
                })
            }
        }

        function submitBatch(){
            StockService.submitBatch($scope.selectedStocks).then(function (data) {
                swal({
                    type: "success",
                    title: "批量入库成功!",
                }, function () {
                    $state.go($state.current, {}, {reload: true});
                });
            })
        }

        function printBatch() {
            $window.localStorage.setItem('printStockData', angular.toJson($scope.selectedStocks));
            var url = $state.href('printStock');
            var newWindow = $window.open(url,'_blank');
        }
    }
})();