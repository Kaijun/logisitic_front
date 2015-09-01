(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('PrintTrans', PrintTrans);

    PrintTrans.$inject = ['$scope', '$timeout', '$window'];

    /* @ngInject */
    function PrintTrans($scope, $timeout, $window) {
        $scope.trans = angular.fromJson($window.localStorage.getItem('printTransData'));

        activate();

        ////////////////

        function activate() {
            $timeout(function () {
                $("#barcode1").JsBarcode($scope.trans.reference_code,{width:1.5,height:45});
            });

        }
    }
})();