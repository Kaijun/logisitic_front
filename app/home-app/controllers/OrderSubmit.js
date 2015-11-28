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
        $scope.selectedAddr  = null;
        $scope.packageList = [];
        $scope.addrInfo = null;
        $scope.allItems = [];
        $scope.estimateCost = {
            cost: 0,
            extra_service_cost: [],
        }

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
                $scope.selectedAddr = $scope.addressList.filter(function (item) {
                    return parseInt(item.is_default)===1;
                });
                $scope.selectedAddr = $scope.selectedAddr.length>0 ? $scope.selectedAddr[0] : $scope.addressList[0];
            });


            $q.all([warehousePromise, pathPromise, addressListPromise]).then(function () {
                $scope.order = angular.copy(orderObj);
                $scope.order.warehouse = $scope.warehouses[0].id.toString();
                $scope.order.logistic_path = $scope.logisticPaths[0].id.toString();
                $scope.order.address = $scope.addressList[0].id.toString();
            }).then(function () {
                
                $scope.$on('warehouseChanged', function (event, newValue) {
                    OrderService.getPackages(4, newValue).then(function (data) {
                        if(data.length===0){
                            swal('库存中没有可发货物品', '', 'error');
                        }

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
                })                
                $scope.$watch('order.warehouse', function (newValue, oldValue) {
                    $scope.$emit('warehouseChanged', newValue);
                });

                $scope.$watch('logisticPathChosen', function (newValue, oldValue) {
                    $scope.extraServices = $scope.logisticPathChosen.extra_services.filter(function (item) {
                        return (item.type==0 || item.type==3);
                    });
                });
            }).then(function () {
                // IF EDIT MODE!!!
                if($stateParams.orderId){
                    swal({
                        title: "警告",
                        text: "编辑订单将会删除旧订单, 重新提交新订单, 是否继续?",
                        showCancelButton: true,
                    }, function () {
                        var tempOrder = {};
                        OrderService.getOrderById($stateParams.orderId).then(function (data) {
                            tempOrder = data;
                        }).then(function () {
                            OrderService.deleteOrder($stateParams.orderId).then(function(data) {
                                if(data.success===true){
                                    swal("删除成功", "请点击确认继续编辑, 原有部分数据将会保留", "success");
                                    $timeout(function () {
                                        $scope.order = tempOrder;
                                        $scope.order.warehouse = $scope.order.warehouse.toString();
                                        $scope.$emit('warehouseChanged', $scope.order.warehouse);
                                        $scope.logisticPathChosen = $scope.logisticPaths.filter(function (item) {
                                            return parseInt($scope.order.ship_company)===parseInt(item.id)
                                        })[0];
                                        $scope.selectedAddr = $scope.addressList.filter(function (item) {
                                            return parseInt($scope.order.address.id)===parseInt(item.id);
                                        })[0];
                                    })
                                }
                            });
                        })

                        
                    })
                }
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
            $scope.order.address = $scope.selectedAddr.id;


            //报关单除掉整箱发货!!!
            InfoService.getTypes().then(function (lts) {
                $scope.order.declarations = angular.copy($scope.order.items).filter(function(item) {
                    return item.type != lts[0].id;
                });
            })
            
            var estimateObj = {};
            estimateObj.weight = (function () {
                var weight = 0;
                $scope.order.items.forEach(function (item) {
                    weight = weight + parseInt(item.unit_weight)*parseInt(item.quantity);
                })
                return weight;
            })();
            estimateObj.logistic_path = $scope.order.logistic_path;
            estimateObj.extra_services = angular.copy($scope.order.extra_services).map(function (es) {
                return es.id;
            })
            OrderService.getEstimatePrice(estimateObj).then(function (data) {
                $timeout(function () {
                    $scope.estimateCost = data;
                    $scope.isConfirmShown = true;
                });
            })
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