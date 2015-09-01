(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('PrintShip', PrintShip);

    PrintShip.$inject = ['$scope', '$timeout', '$window'];

    /* @ngInject */
    function PrintShip($scope, $timeout, $window) {
        $scope.order = angular.fromJson($window.localStorage.getItem('printShipData'));

        activate();

        ////////////////

        function activate() {
                $timeout(function () {
                    $("#barcode1").JsBarcode($scope.order.reference_code,{width:1.5,height:45});
                });

        }
    }
})();