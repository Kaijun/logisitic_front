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
        $scope.deleteStock = deleteStock;
        $scope.enterStock = enterStock;
        $scope.imageUrlPrefix = AppConfig.apiUrl+ '/image/';

        activate();

        ////////////////

        function activate() {
            if($scope.stockId){
                LogisticService.getLogisticTypes().then(function (data) {
                    $scope.optionTypes = data;
                }).then(function() {
                    return InfoService.getWarehouses().then(function (data) {
                        $scope.warehouses = data;
                    });
                }).then(function() {
                    StockService.getStock($scope.stockId).then(function (data) {
                        $scope.isRequested = true;

                        $scope.imageUrlPrefix = data.package ? $scope.imageUrlPrefix + data.package.user.id + '/' : $scope.imageUrlPrefix ;
                            data.warehouseName = $scope.warehouses.filter(function(item){
                                return parseInt(item.id)===parseInt(data.warehouse_id)
                            })[0].name
                            data.created_at = data.created_at.substring(0, 10);
                            data.updated_at = data.updated_at.substring(0, 10);
                            data.statusStr = InfoService.getStockStatusMapping(data.status);
                            data.items.map(function (i) {
                                var typeOption = $scope.optionTypes.filter(function (ot) {
                                    return parseInt(ot.id) === parseInt(i.type);
                                })[0];
                                return i.typeOption = typeOption;
                            });
                            data.isStockCheck = (data.items.length>0) && !(data.items.length===1&&data.items[0].type==$scope.optionTypes[0].id);
                            $timeout(function(){
                                $scope.stock = data;
                            });

                    }, function() {
                        $state.go('stockList');
                    })
                })
                
            }
            else{
                $state.go('stockList');
            }
        }


        function enterStock () {
            if($stateParams.stockId){
                //item存在
                var items;
                if($scope.stock.isStockCheck){
                    items = $scope.stock.items;
                }
                // item 不存在 整箱发货! 整箱的type是第一个type
                else{
                    items = [{
                        item_name: "整箱发货",
                        type: $scope.optionTypes[0].id,
                        unit_price: null,
                        unit_weight: $scope.stock.weight,
                        quantity: 1,
                    }];
                }
                StockService.enterStock($stateParams.stockId, {
                    items: items
                }).then(function(data) {
                    if(data.success===true){
                        swal('入库/修改包裹成功!', '', 'success');
                        $state.go($state.current, {}, {reload: true});
                    }
                });
            }
        }

        $scope.addItem = function () {
            $scope.stock.items.push({
                item_name: null,
                typeOption: $scope.optionTypes[0],
                type: null,
                typeName: null,
                unit_price: null,
                unit_weight: null,
                quantity: null,
            })
        }


        $scope.deleteItem = function ($index) {
            $scope.stock.items.splice($index, 1);
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