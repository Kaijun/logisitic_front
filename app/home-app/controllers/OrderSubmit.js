(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('OrderSubmitCtrl', OrderSubmitCtrl);

    OrderSubmitCtrl.$inject = ['$scope', 'OrderService', 'ProfileService', 'InfoService', '$q', '$timeout', '$state', '$stateParams'];

    /* @ngInject */
    function OrderSubmitCtrl($scope, OrderService, ProfileService, InfoService, $q, $timeout, $state, $stateParams) {
        var orderObj = {
            address: null,
            logistic_path: null,
            coupon_code: null,
            items: [],
            declarations: [],
            extra_services: [],
            message: null,
            pay_method: null,
            warehouse: null, 
            auto_charge: 1
        }
        $scope.isConfirmShown = false;
        $scope.warehouses = [];
        $scope.logisticPaths = [];
        $scope.logisticPathChosen = null;
        $scope.extraServices = [];
        $scope.addressList  = [];
        $scope.packageList = [];
        $scope.addrInfo = null;
        $scope.allItems = [];

        $scope.getLogisticPathNameById = getLogisticPathNameById;
        $scope.getWarehouseNameById = getWarehouseNameById;
        $scope.confirmOrder = confirmOrder;
        $scope.submitOrder = submitOrder;
        $scope.editOrder = editOrder;
        $scope.deleteOrder = deleteOrder;
        $scope.toggleAllItems = toggleAllItems;
        activate();

        ////////////////

        function activate() {
            var warehousePromise = InfoService.getWarehouses().then(function (data){
                $scope.warehouses = data;
            });
            var pathPromise = InfoService.getLogisticPaths(3).then(function (data){
                $scope.logisticPaths = data;
                $scope.logisticPathChosen = $scope.logisticPaths[0];
                
            });
            // TODO: add user Group!!! from UserInfo
            // var extraSrvPromise = InfoService.getExtraServices(1, 3).then(function (data){
            //      $scope.extraServices = data;
            // });
            var addressListPromise = ProfileService.getAddressList().then(function (data) {
                if(data.length === 0){
                    alert('请先添加地址!');
                    $state.go('addressManage');
                }
                $scope.addressList = data;
            });
            $q.all([warehousePromise, pathPromise, addressListPromise]).then(function () {
                $scope.order = angular.copy(orderObj);
                $scope.order.warehouse = $scope.warehouses[0].id.toString();
                $scope.order.logistic_path = $scope.logisticPaths[0].id.toString();
                $scope.order.address = $scope.addressList[0].id.toString();
            }).then(function () {
                $scope.$watch('order.warehouse', function (newValue, oldValue) {
                    // 4 - 已入库
                    OrderService.getPackages(4, newValue).then(function (data) {
                        data.forEach(function (pkg) {
                            pkg.toggle = false;
                            pkg.isAllToggle = false;
                            pkg.items.forEach(function (item) {
                                item.isSelected = false;
                                item.quantityToSend = 1;
                            });

                        });
                        return data;
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
                        });
                    });
                });

                $scope.$watch('logisticPathChosen', function (newValue, oldValue) {
                    $scope.extraServices = $scope.logisticPathChosen.extra_services.filter(function (item) {
                        return (item.type==0 || item.type==3);
                    });
                });
            });
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


        function confirmOrder(){

            $scope.order.items = assembleItems();

            //validate items if empty
            if($scope.order.items.length===0){
                swal('请至少勾选一项发货物品', '', 'error');
                return;
            }


            $scope.order.logistic_path = $scope.logisticPathChosen.id;

            var addr = $scope.addressList.filter(function (item) {
                return item.id === parseInt($scope.order.address);
            });

            //报关单除掉整箱发货!!!
            InfoService.getTypes().then(function (lts) {
                $scope.order.declarations = angular.copy($scope.order.items).filter(function(item) {
                    return item.type != lts[0].id;
                });
            })
            
            
            $timeout(function () {
                $scope.addrInfo = addr[0];
                $scope.isConfirmShown = true;
            });
        }
        function editOrder () {
            $scope.isConfirmShown = false;
        }

        function submitOrder(){
            OrderService.submitOrder($scope.order).then(function (data) {
                if(data.package_id && data.success==true){
                    swal('提交发货订单成功', '', 'success');
                    $state.go('orderDetail', {orderId: data.ship_order_id});
                }
            })
        }

        function deleteOrder () {
            $scope.order = angular.copy(orderObj);
            $scope.isConfirmShown = false;
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

        $scope.addDeclaration = function () {
            $scope.order.declarations.push({
                item_name: null,
                unit_price: null,
                unit_weight: null,
                quantity: null,
            });
        }

        $scope.deleteDeclaration = function ($index) {
            $scope.order.declarations.splice($index, 1);
        }
    }
})();