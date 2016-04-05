(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('StockQuickCtrl', StockQuickCtrl);


    /* @ngInject */
    function StockQuickCtrl($scope, AppConfig, StockService, UserService, RoleService, LogisticService, $timeout, InfoService, $state, $filter, $window) {

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
        $scope.eanCode = null;
        $scope.userFound = null;
        $scope.isRequested = false;
        $scope.isStockFound = false;
        $scope.warehouses = [];
        $scope.warehouseChosen = null;
        $scope.transCompany = {
            all: [],
            chosen: null
        };
        $scope.roles = [];
        $scope.optionTypes = [];
        $scope.search = search;
        $scope.enterStock = enterStock;
        $scope.regStock = regStock;
        $scope.printStock = printStock;

        activate();

        ////////////////
        function activate() {
            LogisticService.getLogisticTypes().then(function (data) {
                $scope.optionTypes = data;
            })
            LogisticService.getTransCompanies().then(function (data) {
                $scope.transCompany.all = data;
                $scope.transCompany.chosen = data[0];
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

            // watch EanData 条形码扫描自动添加item
            var searchEanTimeout;
            $scope.$watch('eanCode', function (newValue, oldValue) {
                if(newValue === oldValue) return;

                if (searchEanTimeout) $timeout.cancel(searchEanTimeout);
                searchEanTimeout = $timeout(function() {
                    autoAddEanItem($scope.eanCode);
                }, TIMEOUT_DELAY);
            });

        }

        function search() {
            if($scope.serachText){
                StockService.getStockByRef($scope.serachText).then(function (data) {
                    if(data.success!=true){
                        swal('搜索错误', '', 'error');
                        return;
                    }

                    $scope.isRequested = true;

                    data = data.data.data;
                    data = data[0];

                    $scope.imageUrlPrefix = data ? $scope.imageUrlPrefix + data.user.id + '/' : $scope.imageUrlPrefix ;
                    console.log(data)
                    if(!data){
                        $scope.isStockFound = false;
                        $scope.submitData.reference_code = $scope.serachText;
                    }
                    else{

                        $scope.isStockFound = true;
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
                        unit_weight: $scope.stock.weight,
                        quantity: 1,
                        remain:1,
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
            if($scope.userFound){
                doReg();
            }
            else{
                swal({
                    title: "未填写库存码",
                    text: "包裹将归为待认领",
                    type: "warning",
                    showCancelButton: true,
                    closeOnConfirm: true
                }, function(){
                    $scope.submitData.stock_number = null;
                    doReg();
                });
            }

            function doReg() {
                $scope.submitData.need_check = $scope.submitData.need_check?1:0;
                $scope.submitData.warehouse_id = $scope.warehouseChosen.id;
                $scope.submitData.reference_code = $scope.transCompany.chosen.prefix + $scope.submitData.reference_code;

                StockService.submitStock($scope.submitData).then(function(data) {
                    $state.go('stockDetail', {stockId: data.package_id});
                })
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
