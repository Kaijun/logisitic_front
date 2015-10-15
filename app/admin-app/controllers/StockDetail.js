(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockDetailCtrl', StockDetailCtrl);

    StockDetailCtrl.$inject = ['$scope', '$state', 'LogisticService', '$stateParams', '$timeout', 'StockService', 'InfoService', 'AppConfig', '$window'];

    /* @ngInject */
    function StockDetailCtrl($scope, $state, LogisticService, $stateParams, $timeout, StockService, InfoService, AppConfig, $window) {
        $scope.$stateParams = $stateParams;
        $scope.stock = null;
        $scope.stockId = $stateParams.stockId;
        $scope.enterStock = enterStock;
        $scope.goBack = goBack;
        $scope.deleteStock = deleteStock;
        $scope.imageUrlPrefix = AppConfig.apiUrl+ '/image/';

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
                        $scope.imageUrlPrefix = $scope.imageUrlPrefix + data.owner_id + '/';
                    }); 
                    return data;
                }, function() {
                    $state.go('stockList');
                }).then(function(data) {

                    LogisticService.getLogisticTypes().then(function (lts) {
                        $timeout(function () {
                            $scope.stock.items.forEach(function (item) {
                                lts.some(function (i) {
                                    if(item.type == i.id){
                                        item.typeName = i.type_name;
                                        return true;
                                    }
                                })
                            })
                        })
                    })

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


        function deleteStock () {
            if($scope.stockId){
                swal({
                    title: "确认删除?",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {
                    StockService.deleteStock($scope.stockId).then(function(data) {
                        $state.go('preStockList', {}, {reload: true});
                    });
                })
            }
        }

    }
})();