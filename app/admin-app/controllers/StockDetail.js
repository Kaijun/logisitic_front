(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockDetailCtrl', StockDetailCtrl);

    StockDetailCtrl.$inject = ['$scope', '$state', 'LogisticService', '$stateParams', '$timeout', 'StockService', 'InfoService', 'AppConfig', '$window', '$filter'];

    /* @ngInject */
    function StockDetailCtrl($scope, $state, LogisticService, $stateParams, $timeout, StockService, InfoService, AppConfig, $window, $filter) {
        $scope.$stateParams = $stateParams;
        $scope.stock = null;
        $scope.stockId = $stateParams.stockId;
        $scope.deleteStock = deleteStock;
        $scope.enterStock = enterStock;
        $scope.printStock = printStock;
        $scope.imageUrlPrefix = AppConfig.apiUrl+ '/image/';

        $scope.eanCode = null;
        var TIMEOUT_DELAY = 500;

        activate();

        ////////////////

        function activate() {
            if($scope.stockId){
                LogisticService.getLogisticTypes().then(function (data) {
                    $scope.optionTypes = data;
                }).then(function() {
                    StockService.getStock($scope.stockId).then(function (data) {
                        $scope.isRequested = true;

                        $scope.imageUrlPrefix = data.user ? $scope.imageUrlPrefix + data.user.id + '/' : $scope.imageUrlPrefix ;
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


                        // watch EanData 条形码扫描自动添加item
                        var searchEanTimeout;
                        $scope.$watch('eanCode', function (newValue, oldValue) {
                            if(newValue === oldValue) return;

                            if (searchEanTimeout) $timeout.cancel(searchEanTimeout);
                            searchEanTimeout = $timeout(function() {
                                autoAddEanItem($scope.eanCode);
                            }, TIMEOUT_DELAY);
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
                        remain:1,
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
                remain: null,
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
                }, function () {
                    StockService.deleteStock($scope.stockId).then(function(data) {
                        $state.go('preStockList', {}, {reload: true});
                    });
                })
            }
        }


        $scope.autoAddEanItem = function() {
            if($scope.eanCode)
                autoAddEanItem($scope.eanCode)
        }

        function autoAddEanItem(code) {
            StockService.getEanData(code).then(function(data) {
                if(parseInt(data.status.code)===200){
                    var item = data.product.attributes;
                    switch(item.weight_extra){
                        case 'g':
                            item.weight = $filter('number')(item.weight/1000, 1);
                            break;
                        case 'kg':
                            item.weight = $filter('number')(item.weight, 1);
                            break;
                        case 'oz':
                            item.weight = $filter('number')(item.weight*28.35/1000, 1);
                            break;
                        default:
                            item.weight = 0;
                            break;
                    }
                    $scope.stock.items.push({
                        item_name: item.product,
                        typeOption: $scope.optionTypes[0],
                        type: null,
                        typeName: null,
                        unit_price: null,
                        unit_weight: item.weight,
                        quantity: null,
                    })
                }
                else{
                    swal({
                        title: "未找到条形码对应的商品",
                        timer: 1500,
                        showConfirmButton: false,
                        type: 'error',
                    });
                }
            })
        }

        function printStock() {
            $window.localStorage.setItem('printStockData', angular.toJson([$scope.stock]));
            var url = $state.href('printStock');
            var newWindow = $window.open(url,'_blank');
        }
    }
})();
