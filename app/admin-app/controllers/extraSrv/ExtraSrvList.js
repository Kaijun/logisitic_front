(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('ExtraSrvList', ExtraSrvList);

    ExtraSrvList.$inject = ['$scope', '$state', '$timeout', 'ExtraSrvService'];

    /* @ngInject */
    function ExtraSrvList($scope, $state, $timeout, ExtraSrvService) {
        $scope.extraSrvs = [];
        $scope.deleteExtraSrv = deleteExtraSrv;
        $scope.editExtraSrv = editExtraSrv;

        activate();

        ////////////////

        function activate() {

            ExtraSrvService.getExtraSrvs().then(function (data) {
                $timeout(function () {
                    $scope.extraSrvs = data
                })
            })

        }

        function deleteExtraSrv(srv){
            ExtraSrvService.deleteExtraSrv(srv.id).then(function (data) {
                $scope.extraSrvs.forEach(function (item, idx, arry) {
                    if(item.id == srv.id){
                        arry.splice(idx, 1);
                    }
                })
            })
        }
        function editExtraSrv(srv){
            $state.go('extraSrvManage', {id: srv.id}, {reload: true});
        }
    }
})();