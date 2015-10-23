(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockQuickCtrl', StockQuickCtrl);


    /* @ngInject */
    function StockQuickCtrl($scope, AppConfig, StockService, UserService, RoleService, LogisticService, $timeout, InfoService, $state) {
        
        $scope.imageUrlPrefix = AppConfig.apiUrl+ '/image/';

        var TIMEOUT_DELAY = 500;
        $scope.stock = null;
        $scope.serachText = null;
        $scope.submitData = {
            stock_number: null,
            warehouse_id: null,
            reference_code: null,
            need_check: null, //1-需要验证, 0-不需要验证
            weight: null,
        }
        $scope.userFound = null;
        $scope.isRequested = false;
        $scope.isStockFound = false;
        $scope.warehouses = [];
        $scope.warehouseChosen = [];
        $scope.roles = [];
        $scope.optionTypes = [];
        $scope.search = search;
        $scope.enterStock = enterStock;
        $scope.regStock = regStock;

        activate();

        ////////////////
        function activate() {
            LogisticService.getLogisticTypes().then(function (data) {
                $scope.optionTypes = data;
            })


            var searchStockTimeout;
            $scope.$watch('serachText', function (newValue, oldValue) {
                if(newValue === oldValue) return;

                if (searchStockTimeout) $timeout.cancel(searchStockTimeout);
                searchStockTimeout = $timeout(function() {
                    search();
                }, TIMEOUT_DELAY); 
            });

            var searchUserimeout;
            $scope.$watch('submitData.stock_number', function (newValue, oldValue) {
                if(newValue === oldValue) return;
                if (searchUserimeout) $timeout.cancel(searchUserimeout);
                searchUserimeout = $timeout(function() {
                    UserService.getUserByStockNumber($scope.submitData.stock_number).then(function (data) {
                        if(data.success==true){
                            $scope.userFound = data.user;
                            $scope.userFound.roleName = $scope.roles.filter(function (item) {
                                return parseInt(item.id) === parseInt(data.user.role_id);
                            })[0].role_name
                        }
                        else{
                            $scope.userFound = null;
                        }
                    });
                }, TIMEOUT_DELAY*2); 
            });

            InfoService.getWarehouses().then(function (data) {
                $scope.warehouses = data;
                $scope.warehouseChosen = data[0];
            });
            RoleService.getRoles().then(function (data) {
                $scope.roles = data;
            });
        }

        function search() {
            if($scope.serachText){
                StockService.getStockByTrackNr($scope.serachText).then(function (data) {
                    $scope.isRequested = true;

                    $scope.imageUrlPrefix = data.package ? $scope.imageUrlPrefix + data.package.user.id + '/' : $scope.imageUrlPrefix ;

                    if(data.package==null){
                        $scope.isStockFound = false;
                        $scope.submitData.reference_code = $scope.serachText;
                    }
                    else{
                        $scope.isStockFound = true;
                        data = data.package;
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
                        data.isStockCheck = data.items.length>0;
                        $timeout(function(){
                            $scope.stock = data;
                        });
                    }
                });
            }
        }

        function enterStock () {
            if($scope.stock.id){
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
                        unit_weight: null,
                        quantity: 1,
                    }];
                }
                StockService.enterStock($scope.stock.id, {
                    items: items
                }).then(function(data) {
                    if(data.success===true){
                        swal('入库/修改包裹成功!', '', 'success');
                        $state.go($state.current, {}, {reload: true});
                    }
                });
            }
        }

        function goToDetail () {
            $state.go('stockDetail', {stockId: $scope.stock.package_id});
        }

        function regStock () {
            $scope.submitData.need_check = $scope.submitData.need_check?1:0;
            $scope.submitData.warehouse_id = $scope.warehouseChosen.id;
            StockService.submitStock($scope.submitData).then(function(data) {
                $state.go('stockDetail', {stockId: data.package_id});
            })
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
        
    }
})();