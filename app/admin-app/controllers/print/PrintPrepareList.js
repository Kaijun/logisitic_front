(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('PrintPrepareList', PrintPrepareList);

    PrintPrepareList.$inject = ['$scope', '$stateParams', '$timeout', '$window'];

    /* @ngInject */
    function PrintPrepareList($scope, $stateParams, $timeout, $window) {
        $scope.order = angular.fromJson($window.localStorage.getItem('printPrepareListData'));

        activate();

        ////////////////

        function activate() {
                $timeout(function () {
                    $('#qrcode').qrcode({width: 72,height: 72,text: "http://xxxlbag.com/admin/#/order/"+ $scope.order.id});
                    $("#barcode").JsBarcode($scope.order.reference_code,{width:1.5,height:72});
                });

        }
    }
})();