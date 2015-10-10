(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('FinancialRecordCtrl', FinancialRecordCtrl);

    FinancialRecordCtrl.$inject = ['$scope', '$state', 'FinancialService', '$timeout', 'UserInfo'];

    /* @ngInject */
    function FinancialRecordCtrl($scope, $state, FinancialService, $timeout, UserInfo) {
        var vm = this;
        $scope.records = [];
        $scope.userInfo = UserInfo;

        activate();

        ////////////////

        function activate() {
            FinancialService.getRecords().then(function (data) {
                $timeout(function () {
                    $scope.records = data;
                })
            });
        }
    }
})();