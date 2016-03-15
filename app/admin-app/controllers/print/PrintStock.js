(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('PrintStock', PrintStock);

    PrintStock.$inject = ['$scope', '$timeout', '$window'];

    /* @ngInject */
    function PrintStock($scope, $timeout, $window) {
        $scope.stocks = angular.fromJson($window.localStorage.getItem('printStockData'));
        console.log($scope.stocks)
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