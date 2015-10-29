(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('ProblemList', ProblemList);

    ProblemList.$inject = ['$scope', '$state', '$timeout', 'ProblemService', 'InfoService'];

    /* @ngInject */
    function ProblemList($scope, $state, $timeout, ProblemService, InfoService) {
        $scope.type = "3";

        $scope.problemPkgs = [];

        $scope.goToDetail = goToDetail;
        activate();

        ////////////////

        function activate() {
            $scope.$watch('type', function () {
                ProblemService.getProblemPkgs($scope.type).then(function (data) {
                    data.forEach(function (item) {
                        item.updated_at = item.updated_at.date.substring(0, 10);
                    })
                    $scope.problemPkgs = data;               
                });
            })

            

        }
        function goToDetail (pkg) {
            var id = 0;
            switch($scope.type){
                // 预报问题件 遗弃...
                case "0":
                    id = pkg.package_id;
                    break;
                //订单
                case "1":
                    id = pkg.ship_order_id;
                    break;
                //移库
                case "2":
                    id = pkg.transaction_id;
                    break;
                //库存
                case "3":
                    id = pkg.package_id;
                    break;
            }
            $state.go('problemDetail', {type: $scope.type, id: id});
            
        }
    }
})();