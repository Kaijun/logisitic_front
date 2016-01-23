(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('Refill', Refill);

    Refill.$inject = ['$scope', '$timeout', 'FinanceService', '$window', '$state'];

    /* @ngInject */
    function Refill($scope, $timeout, FinanceService, $window, $state) {
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
                amount: $scope.chargeAmount,
            }).then(function (data) {
                if(data.success===true){
                    swal("充值成功", "", "success");
                    $state.go('financialRecord', {}, {reload: true});
                }
            });
            
        }

        $scope.goBack = function () {
            $window.history.back();
        }
    }
})();