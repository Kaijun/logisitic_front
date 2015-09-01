(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('ProblemList', ProblemList);

    ProblemList.$inject = ['$scope', '$state', '$timeout', 'ProblemService'];

    /* @ngInject */
    function ProblemList($scope, $state, $timeout, ProblemService) {
        $scope.problemPkgs = [];

        $scope.goToDetail = goToDetail;
        activate();

        ////////////////

        function activate() {
            ProblemService.getProblemPkgs().then(function (data) {
                $scope.problemPkgs = data;
            });

        }
        function goToDetail (id) {
            $state.go('stockDetail', {stockId: id});
         }
    }
})();