(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('OrderSubmitCtrl', OrderSubmitCtrl);

    OrderSubmitCtrl.$inject = ['$scope'];

    /* @ngInject */
    function OrderSubmitCtrl($scope) {
        $scope.isConfirmShown = false;

        activate();

        ////////////////

        function activate() {
        }
    }
})();