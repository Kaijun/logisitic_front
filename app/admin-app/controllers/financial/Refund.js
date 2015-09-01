(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('Refund', Refund);

    Refund.$inject = ['$scope'];

    /* @ngInject */
    function Refund($scope) {
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
                console.log(data);
            })
        }
        function checkAmountByStockNuml() {            
            FinanceService.getAmountByStockNum($scope.stockNum).then(function (data) {                
                $timeout(function () {
                    $scope.amount = data;
                })
                console.log(data);
            })
        }
        function charge() {
            FinanceService.chargeAmount({
                email: $scope.chargeEmail,
                stock_number: -$scope.chargeStockNum,
                amount: $scope.chargeAmount,
            }).then(function (data) {
                swal({
                    type: "success",
                    title: "退款成功!",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    closeOnConfirm: true,
                }, function () {
                    
                })
            });
            
        }
    }
})();