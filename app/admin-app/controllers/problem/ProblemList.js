(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('ProblemList', ProblemList);

    ProblemList.$inject = ['$scope', '$state', '$timeout', 'ProblemService', 'InfoService'];

    /* @ngInject */
    function ProblemList($scope, $state, $timeout, ProblemService, InfoService) {
        $scope.type = "0";

        $scope.problemPkgs = [];

        $scope.goToDetail = goToDetail;
        activate();

        ////////////////

        function activate() {
            $scope.$watch('type', function () {
                ProblemService.getProblemPkgs($scope.type).then(function (data) {
                    $scope.problemPkgs = data;               
                });
            })

            

        }
        function goToDetail (pkg) {
            var id = 0;
            switch($scope.type){
                case "0":
                    id = pkg.package_id;
                    break;
                case "1":
                    id = pkg.ship_order_id;
                    break;
                case "2":
                    id = pkg.transaction_id;
                    break;
                case "3":
                    id = pkg.package_id;
                    break;
            }
            $state.go('problemDetail', {type: $scope.type, id: id});
            
        }
    }
})();