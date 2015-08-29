(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('OrderDetailCtrl', OrderDetailCtrl);

    OrderDetailCtrl.$inject = ['$scope', 'OrderService', 'InfoService', '$q', '$stateParams', '$state', '$timeout'];

    /* @ngInject */
    function OrderDetailCtrl($scope, OrderService, InfoService, $q, $stateParams, $state, $timeout) {
        
        $scope.order = null;
        $scope.warehouse = null;
        $scope.logisticPath = null;

        $scope.editOrder = editOrder;
        $scope.deleteOrder = deleteOrder;

        activate();

        ////////////////

        function activate() {

                if($stateParams.orderId){
                    var orderId = $stateParams.orderId;
                    OrderService.getOrderById(orderId).then(function (data) {
                        data.timestampStr = (new Date(data.timestamp.date)).toISOString().substring(0, 10);
                        $timeout(function() {
                            $scope.order = data;
                            $scope.order.statusStr = InfoService.getOrderStatusMapping(data.order_status);
                        });
                        return data;
                    },
                    function(){
                        $state.go('index');
                    }).then(function (data) {
                        InfoService.getWarehouseById(data.warehouse).then(function (wh){
                            $timeout(function() {
                                $scope.warehouse = wh;
                            })
                        });
                        InfoService.getLogisticPathById(data.ship_company,1).then(function (lp){
                            $timeout(function() {
                                $scope.logisticPath = lp;
                            })
                        });
                    })
                }
                else{
                    $state.go('index');
                }

        }

        function editOrder () {
            $state.go('orderSubmit', {orderId: $stateParams.orderId});
        }
        function deleteOrder () {
            OrderService.deleteOrder($stateParams.orderId).then(function() {
                $state.go('orderList');
            }, function () {
                // body...
            })
        }
    }
})();