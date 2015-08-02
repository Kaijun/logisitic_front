(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('TransDetail', TransDetail);

    TransDetail.$inject = ['$scope', '$stateParams', '$timeout', 'TransService', 'InfoService'];

    /* @ngInject */
    function TransDetail($scope, $stateParams, $timeout, TransService, InfoService) {
        $scope.trans = null;
        $scope.submitTrans = submitTrans;
        $scope.printTrans = printTrans;
        activate();

        ////////////////

        function activate() {
            if($stateParams.transId){
                TransService.getTrans($stateParams.transId).then(function(data) {
                    $timeout(function () {
                        $scope.trans = data;
                        $scope.trans.statusStr = InfoService.getStockStatusMapping(data.status);
                    })
                });
            }
        }

        function submitTrans () {
            TransService.editTrans($stateParams.transId, {
                status: 10
            }).then(function (response) {
                console.log(response)
            })
        }
        function printTrans () {
            TransService.editTrans($stateParams.transId, {
                status: 8
            }).then(function (response) {
                console.log(response)
            })
        }
    }
})();