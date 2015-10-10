(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('FinancialRecord', FinancialRecord);

    FinancialRecord.$inject = ['$scope', '$timeout', '$state', 'FinanceService'];

    /* @ngInject */
    function FinancialRecord($scope, $timeout, $state, FinanceService) {
        $scope.records = [];

        activate();

        ////////////////

        function activate() {
            FinanceService.getRecords().then(function (data) {
                if(data.data){
                    $timeout(function () {
                        $scope.records = data.data;
                    })
                }
            })
        }
    }
})();