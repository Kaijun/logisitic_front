(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('PrintShip', PrintShip);

    PrintShip.$inject = ['$scope', '$timeout', '$window'];

    /* @ngInject */
    function PrintShip($scope, $timeout, $window) {
        $scope.orders = angular.fromJson($window.localStorage.getItem('printShipData'));

        activate();

        ////////////////

        function activate() {

        }

        $scope.generateBarcode = function(ref) {
            $timeout(function () {
                $("#barcode" + ref).JsBarcode(ref,{width:1.5,height:45});
            });
        }
    }
})();