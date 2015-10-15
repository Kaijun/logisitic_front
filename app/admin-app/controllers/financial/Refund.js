(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('Refund', Refund);

    Refund.$inject = ['$scope', '$timeout', 'FinanceService', '$window'];

    /* @ngInject */
    function Refund($scope, $timeout, FinanceService, $window) {
        $scope.userEmail = '';
        $scope.stockNum = '';
        $scope.amount = '';

        $scope.chargeEmail = '';
        $scope.chargeStockNum = '';
        $scope.chargeAmount = '';

        $scope.checkAmountByEmail = checkAmountByEmail;
        $scope.checkAmountByStockNuml = checkAmountByStockNuml;
        $scope.charge = charge;

        ////////////////

        function checkAmountByEmail() {
            FinanceService.getAmountByEmail($scope.userEmail).then(function (data) {
                $timeout(function () {
                    $scope.amount = data;
                })
            })
        }
        function checkAmountByStockNuml() {            
            FinanceService.getAmountByStockNum($scope.stockNum).then(function (data) {                
                $timeout(function () {
                    $scope.amount = data;
                })
            })
        }
        function charge() {
            FinanceService.chargeAmount({
                email: $scope.chargeEmail,
                stock_number: $scope.chargeStockNum,
                amount: -$scope.chargeAmount,
            }).then(function (data) {
                if(data.success===true)
                    swal("退款成功", "", "success");
            });
            
        }
        $scope.goBack = function () {
            $window.history.back();
        }
    }
})();