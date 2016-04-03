(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('FinancialRecord', FinancialRecord);

    FinancialRecord.$inject = ['$scope', '$timeout', '$state', 'FinanceService', '$http'];

    /* @ngInject */
    function FinancialRecord($scope, $timeout, $state, FinanceService, $http) {
        $scope.records = [];
        $scope.pageInfo = null;
        $scope.requestPage = requestPage;
        activate();

        ////////////////

        function activate() {
            FinanceService.getRecords().then(function (data) {
                if(data.success===true){
                    data = data.data
                    $scope.records = data.data;

                    $timeout(function () {
                        $scope.pageInfo = data;
                    })
                }
            })
        }

        function requestPage (url) {
            $http.get(url).then(function (response) {
                response = response.data;
                if(response.success===true){
                    $scope.records = response.data.data;
                    $timeout(function () {
                        $scope.pageInfo = response.data;
                    }) 
                }
            })
        }
    }
})();