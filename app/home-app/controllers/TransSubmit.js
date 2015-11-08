(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('TransSubmitCtrl', TransSubmitCtrl);

    TransSubmitCtrl.$inject = ['$scope', '$timeout', 'InfoService', 'TransService', 'OrderService', '$q', '$state'];

    /* @ngInject */
    function TransSubmitCtrl($scope, $timeout, InfoService, TransService, OrderService, $q, $state) {
        $scope.isConfirmShown = false;
        var transObj = {
            to_stock_number: null,
            to_email: null,
            items: [],
            warehouse: null, 
            message: null, 
            pay_method: null, 
            extra_services: [],
        }

        $scope.warehouses = [];
        $scope.logisticPaths = [];
        $scope.packageList = [];

        $scope.confirm = confirm;
        $scope.submit = submit;
        $scope.edit = edit;
        $scope.cancle = cancle;
        $scope.getWarehouseNameById = getWarehouseNameById;
        $scope.getLogisticPathNameById = getLogisticPathNameById;
        $scope.toggleAllItems = toggleAllItems;

        activate();

        ////////////////

        function activate() {
            var warehousePromise = InfoService.getWarehouses().then(function (data){
                $scope.warehouses = data;
            });
            var pathPromise = InfoService.getLogisticPaths(2).then(function (data){
                $scope.logisticPaths = data;
            });

            $q.all([warehousePromise, pathPromise]).then(function () {
                $scope.trans = angular.copy(transObj);
                $scope.trans.warehouse = $scope.warehouses[0].id.toString();
                $scope.trans.logistic_path = $scope.logisticPaths[0].id.toString();
            }).then(function () {
                $scope.$watch('trans.warehouse', function (newValue, oldValue) {
                    // 4 - 已入库
                    OrderService.getPackages(4, newValue).then(function (data) {
                        data.forEach(function (pkg) {
                            pkg.toggle = false;
                            pkg.items.forEach(function (item) {
                                item.isSelected = false;
                                item.quantityToSend = 1;
                            })
                        });
                        return data
                    }).then(function (data) {
                        InfoService.getTypes().then(function (lts) {
                            data.forEach(function (pkg) {
                                pkg.items.forEach(function (item) {
                                    lts.some(function (i) {
                                        if(item.type == i.id){
                                            item.typeName = i.type_name;
                                            return true;
                                        }
                                    })
                                });
                            })

                            $scope.packageList = data;
                        })
                    });
                })
            });
        }

        function confirm () {
            $scope.trans.items = assembleItems();
             //validate items if empty
            if($scope.trans.items.length===0){
                swal('请至少勾选一项发货物品', '', 'error');
                return;
            }
            $timeout(function () {
                $scope.isConfirmShown = true;
                console.log($scope.trans.extra_services)
            })
        }
        function submit () {
            TransService.submitTrans($scope.trans).then(function (data) {
                if(data.package_id && data.success===true){

                    swal('提交移库订单成功', '', 'success');
                    $state.go('transDetail', {transId: data.trans_order_id});
                }
            })
        }
        function edit () {
            $scope.isConfirmShown = false;
        }
        function cancle () {
            $scope.trans = angular.copy(transObj);
            $scope.isConfirmShown = false;
        }

        function getLogisticPathNameById (lpId) {
            if(lpId){
                var lp = $scope.logisticPaths.filter(function (item) {
                   return item.id === parseInt(lpId);
                });
                return angular.isArray(lp)&&lp.length>0 ? lp[0].name : '';
            }
        }        
        function getWarehouseNameById (whId) {
            if(whId){
                var wh = $scope.warehouses.filter(function (item) {
                   return item.id === parseInt(whId);
                });
                return angular.isArray(wh)&&wh.length>0 ? wh[0].name : '';
            }
        }

        function assembleItems(){
            var items = [];
            $scope.packageList.forEach(function (pkg) {
                pkg.items.forEach(function (item) {
                    if(item.isSelected===true){
                        items.push({
                            id: item.id,
                            quantity: item.quantityToSend,
                            item_name: item.item_name,
                            type: item.type,
                            typeName: item.typeName,
                            unit_price: item.unit_price,
                            unit_weight: item.unit_weight
                        })
                    }
                });
            });
            return items;
        }        

        function toggleAllItems (pkg) {
            if(pkg.isAllToggle===true){
                pkg.items.forEach(function (item) {
                    item.isSelected = true;
                    item.quantityToSend = item.remain;
                });
                pkg.isAllToggle = true;
            }
            else{
                pkg.items.forEach(function (item) {
                    item.isSelected = false;
                    item.quantityToSend = 1;
                });
                pkg.isAllToggle = false;
            }

        }
    }
})();