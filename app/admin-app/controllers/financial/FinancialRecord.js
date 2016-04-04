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
        $scope.filterOptions = {
            user_name: null,
            amount: null,
            start: null,
            end: null,
        };
        $scope.filter = filter;
        $scope.clearFilter = clearFilter;
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
        function filter() {
            var opt = angular.copy($scope.filterOptions);
            if(opt.start instanceof Date && opt.end instanceof Date && opt.start>opt.end){
                swal('起始时间不能晚于截至时间', '', 'error')
                return 
            }
            if(opt.start instanceof Date) opt.start = opt.start.toISOString().substr(0,10);
            if(opt.end instanceof Date) opt.end = opt.end.toISOString().substr(0,10);
            FinanceService.queryRecords(opt).then(function(data) {
                if(data.success===true){
                    data = data.data
                    $scope.records = data.data;

                    $timeout(function () {
                        $scope.pageInfo = data;
                    })
                }
            })
        }
        function clearFilter() {
            $state.go($state.current, {}, {reload: true})
        }
    }
})();