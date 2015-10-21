(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockQuickCtrl', StockQuickCtrl);


    /* @ngInject */
    function StockQuickCtrl($scope, StockService, $timeout, InfoService, $state) {

        $scope.stock = null;
        $scope.serachText = null;
        $scope.submitData = {
            stock_number: null,
            warehouse: null,
            ship_company: null,
            ship_tracknumber: null,
        }
        $scope.search = search;
        $scope.enterStock = enterStock;
        $scope.submitStock = submitStock;

        activate();

        ////////////////

        function activate() {

        }

        function search() {
            if($scope.serachText){
                StockService.getStockByTrackNr($scope.serachText).then(function (data) {
                    data.createTimeString = data.created_time.date.substring(0, 10);
                    data.updateTimeString = data.updated_time.date.substring(0, 10);
                    data.statusStr = InfoService.getStockStatusMapping(data.status);
                    $timeout(function(){
                        $scope.stock = data;
                    });
                }, function () {
                    $scope.stock = null;
                    $scope.submitData.ship_tracknumber = $scope.serachText;

                })
            }
        }

        function enterStock () {
            if($scope.stock.package_id){
                StockService.enterStock($scope.stock.package_id).then(function(data) {
                    $state.go('stockDetail', {stockId: data.package_id});
                });
            }
        }

        function goToDetail () {
            $state.go('stockDetail', {stockId: $scope.stock.package_id});
        }

        function submitStock () {

            StockService.submitStock({
                stock_number: $scope.submitData.stock_number,
                warehouse: $scope.submitData.warehouse,
                ship_company: $scope.submitData.ship_company,
                ship_tracknumber: $scope.submitData.ship_tracknumber,
            }).then(function(data) {
                $state.go('stockDetail', {stockId: data.package_id});
            })
        }
    }
})();