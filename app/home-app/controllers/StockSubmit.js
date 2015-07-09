
'use strict';
;(function () {
    
    angular.module('home.controllers')
    .controller('StockSubmitCtrl', ['$scope', 'StockService', '$state', '$stateParams', '$timeout', 
    function($scope, StockService, $state, $stateParams, $timeout) {
        var stockObj = {
            warehouse: null,
            desc: null,
            ship_company: null,
            ship_tracknumber: null,
            status: null,
            timestamp: null,
            weight: null,
            items: [],
            pics:[],
            message: null,
            attachment: [],
            extra_services: [],
        }
        $scope.stock = null; 
        $scope.warehouses = [];
        $scope.logisticPaths = [];
        $scope.extraServices = [];
        $scope.imagesToUpload = [];
        

        active();

        function active () {
            StockService.getWarehouses().then(function (data){
                 $scope.warehouses = data;
                 $timeout(function () {
                    $scope.stock.warehouse = $scope.warehouses[0].id.toString();
                 });
            });
            StockService.getLogisticPaths(1).then(function (data){
                 $scope.logisticPaths = data;
                 $timeout(function () {
                    $scope.stock.ship_company = $scope.logisticPaths[0].id.toString();
                 });
            });
            // TODO: add user Group!!! from UserInfo
            StockService.getExtraServices(1, 0).then(function (data){
                 $scope.extraServices = data;
            });
            $timeout(function(){
                if(!$stateParams.action){
                    // 非正常
                    if(StockService.editingStockId) {
                        StockService.editingStockId = null;
                        StockService.editingStock = null;
                        $scope.stock = angular.copy(stockObj)
                    }
                    else {
                        $scope.stock = StockService.editingStock ? StockService.editingStock : angular.copy(stockObj)
                    }
                }
                else if($stateParams.action==='edit'){
                    if($stateParams.stockId){
                        var stockId = $stateParams.stockId;
                        if(StockService.editingStock && StockService.editingStockId){
                            $scope.stock = StockService.editingStock
                        }
                        else{
                            StockService.getStock(stockId).then(function(data){
                                $timeout(function () {
                                    $scope.stock = data;
                                });
                            },
                            // 非法
                            function(){
                                $state.go('index');
                            })
                        }
                    }
                    else{
                        // 非法
                        $state.go('index');
                    }
                }
                else{
                    // 非法
                    $state.go('index');
                }
            });
        }
        

        $scope.confirm = function(){
            // TODO: check if stock available!!!
            console.log($scope.stock);
            StockService.editingStock = $scope.stock;
            StockService.editingStockId = $stateParams.stockId ? $stateParams.stockId : null;
            StockService.uploadImage($scope.imagesToUpload[0]).then(function(data){
                console.log(data);
                $state.transitionTo('stockConfirm', {stock: $scope.stock});
            })
        }

        $scope.addItem = function () {
            $scope.stock.items.push({
                item_name: null,
                type: null,
                unit_price: null,
                unit_weight: null,
                quantity: null,
            })
        }

        $scope.deleteItem = function ($index) {
            $scope.stock.items.splice($index, 1);
        }
        

        function ifLastItemFilled(){
            // TODO: check if last item available!!!
            var index = $scope.stock.items.length();
            var lastItem = $scope.stock.items[index];
        }

    }]);
})();