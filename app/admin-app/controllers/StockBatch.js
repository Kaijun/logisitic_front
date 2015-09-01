(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockBatch', StockBatch);

    StockBatch.$inject = ['$scope', 'StockService', '$state'];

    /* @ngInject */
    function StockBatch($scope, StockService, $state) {

        console.log('hehe')
        $scope.fileToUpload = null;
        $scope.stockSelected = stockSelected;
        $scope.submitBatch = submitBatch;
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
                        item.selected = false;
                    })
                    $scope.stocks = data;
                    $scope.selectedStocks = [];
                })
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
            StockService.submitBatch($scope.selectedStocks).then(function () {
                swal({
                    type: "success",
                    title: "批量入库成功!",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {
                    $state.go($state.current, {}, {reload: true});
                })
            })
        }
    }
})();