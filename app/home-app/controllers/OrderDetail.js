(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('OrderDetailCtrl', OrderDetailCtrl);

    OrderDetailCtrl.$inject = ['$scope', 'OrderService', 'InfoService', '$timeout'];

    /* @ngInject */
    function OrderDetailCtrl($scope, OrderService, InfoService, $timeout) {
        
        $scope.order = null;

        activate();

        ////////////////

        function activate() {
            OrderService.getOrderById(28).then(function (data) {
                $timeout(function() {
                    $scope.order = data;
                })
            })
        }
    }
})();