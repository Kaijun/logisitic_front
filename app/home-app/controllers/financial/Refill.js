(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('Refill', Refill);

    Refill.$inject = ['$scope', '$state', 'FinancialService', '$timeout', 'UserInfo', '$window'];

    /* @ngInject */
    function Refill($scope, $state, FinancialService, $timeout, UserInfo, $window) {
        $scope.amount = null;

        ////////////////

        $scope.refill = function() {
            if($scope.amount){
                if(parseFloat($scope.amount)<0.01 || parseFloat($scope.amount)>1000000 ){
                    swal('金额范围', '金额范围应该在0.01到1000000之间', 'error')
                }
                else{
                    FinancialService.refill({amount: parseFloat($scope.amount)}).then(function(data) {
                        if(data['pay_url']){
                            swal({title: "跳转到支付宝中...", type: "info",  timer: 60000,   showConfirmButton: false });
                            $window.location.href = data['pay_url']
                        }
                    })
                }
            }
        }
    }
})();