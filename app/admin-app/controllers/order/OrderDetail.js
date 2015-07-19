(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('OrderDetail', OrderDetail);

    OrderDetail.$inject = ['$scope', '$stateParams', 'OrderService', '$timeout'];

    /* @ngInject */
    function OrderDetail($scope, $stateParams, OrderService, $timeout) {
  
        $scope.order = null;

        activate();

        ////////////////

        function activate() {
            if($stateParams.orderId){
                OrderService.getOrderById($stateParams.orderId).then(function(data) {
                    $timeout(function () {
                        $scope.order = data;
                    })
                });
            }
        }
    }
})();