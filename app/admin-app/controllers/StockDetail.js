(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockDetailCtrl', StockDetailCtrl);

    StockDetailCtrl.$inject = ['$scope', '$state', '$stateParams', '$timeout', 'StockService', 'InfoService', 'AppConfig', '$window'];

    /* @ngInject */
    function StockDetailCtrl($scope, $state, $stateParams, $timeout, StockService, InfoService, AppConfig, $window) {
        $scope.$stateParams = $stateParams;
        $scope.stock = null;
        $scope.stockId = $stateParams.stockId;
        $scope.enterStock = enterStock;
        $scope.goBack = goBack;
        $scope.imageUrlPrefix = AppConfig.apiUrlHome+ '/image/';

        activate();

        ////////////////

        function activate() {
            if($scope.stockId){
                StockService.getStock($scope.stockId).then(function (data) {
                    data.createTimeString = (new Date(data.created_time.date)).toISOString().substring(0, 10);
                    data.updateTimeString = (new Date(data.updated_time.date)).toISOString().substring(0, 10);
                    data.status = parseInt(data.status);
                    data.statusStr = StockService.getStockStatusMapping(data.status);
                    
                    $timeout(function() {
                        $scope.stock = data;
                    }); 
                    return data;
                }, function() {
                    $state.go('stockList');
                }).then(function(data) {
                    InfoService.getWarehouseById(data.warehouse).then(function (wh){
                        $timeout(function() {
                            $scope.warehouse = wh;
                        })
                    });
                });
            }
            else{
                $state.go('stockList');
            }
        }

        function enterStock () {
            if($scope.stockId){

                swal({
                    title: "确认入库?",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {

                              
                    StockService.enterStock($scope.stockId).then(function(data) {
                        $state.go($state.current, {stockId: data.package_id}, {reload: true});
                    });
                })
                     
            }
        }

        function goBack () {
            $window.history.back();
        }
    }
})();