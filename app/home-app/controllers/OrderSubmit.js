(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('OrderSubmitCtrl', OrderSubmitCtrl);

    OrderSubmitCtrl.$inject = ['$scope', 'OrderService', 'ProfileService', 'InfoService', '$q', '$timeout', '$state'];

    /* @ngInject */
    function OrderSubmitCtrl($scope, OrderService, ProfileService, InfoService, $q, $timeout, $state) {
        var orderObj = {
            address: null,
            logistic_path: null,
            coupon_code: null,
            items: [],
            extra_services: [],
            message: null,
            pay_method: null,
            warehouse: null, 
        }
        $scope.isConfirmShown = false;
        $scope.warehouses = [];
        $scope.logisticPaths = [];
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

        activate();

        ////////////////

        function activate() {
            var warehousePromise = InfoService.getWarehouses().then(function (data){
                $scope.warehouses = data;
            });
            var pathPromise = InfoService.getLogisticPaths(0).then(function (data){
                $scope.logisticPaths = data;
            });
            // TODO: add user Group!!! from UserInfo
            var extraSrvPromise = InfoService.getExtraServices(1, 0).then(function (data){
                 $scope.extraServices = data;
            });
            var addressListPromise = ProfileService.getAddressList().then(function (data) {
                if(data.length === 0){
                    alert('请先添加地址!');
                    $state.go('addressManage');
                }
                $scope.addressList = data;
            });
            $q.all([warehousePromise, pathPromise, extraSrvPromise, addressListPromise]).then(function () {
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
                            pkg.items.forEach(function (item) {
                                item.isSelected = false;
                                item.quantityToSend = 1;
                            });
                        });
                        $scope.packageList = data;
                    });
                })
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
            var addr = $scope.addressList.filter(function (item) {
                return item.id === parseInt($scope.order.address);
            });
            $scope.order.items = assembleItems();
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
                if(data.package_id && data.success==="true"){
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
                            unit_price: item.unit_price,
                            unit_weight: item.unit_weight
                        })
                    }
                });
            });
            return items;
        }

    }
})();