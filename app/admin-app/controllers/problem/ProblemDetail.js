(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('ProblemDetail', ProblemDetail);

    ProblemDetail.$inject = ['ProblemService', '$scope', '$timeout', '$state', '$stateParams'];

    /* @ngInject */
    function ProblemDetail(ProblemService, $scope, $timeout, $state, $stateParams) {

        $scope.problemPkg = null;
        $scope.solveProblem = solveProblem;

        activate();

        ////////////////

        function activate() {
            if($stateParams.type!==null && $stateParams.id!==null){
                var type = $stateParams.type;
                var id = $stateParams.id;
                ProblemService.getProblemPkg(type, id).then(function (data) {
                    $scope.problemPkg = data;
                });
            }
        }

        function solveProblem(){
            ProblemService.solveProblemPkg({
                transaction_id: 1,
                status: 9,
                description: "哈哈",
            }).then(function (data) {
                console.log(data);
            })
        }
    }
})();