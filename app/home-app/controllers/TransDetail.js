(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('TransDetailCtrl', TransDetailCtrl);

    TransDetailCtrl.$inject = ['$scope', 'TransService', 'InfoService', '$stateParams', '$timeout'];

    /* @ngInject */
    function TransDetailCtrl($scope, TransService, InfoService, $stateParams, $timeout) {
        $scope.trans = null;
        $scope.warehouse = null;
        activate();

        ////////////////

        function activate() {
            if($stateParams.transId){
                var transId = $stateParams.transId;
                TransService.getTrans(transId).then(function (data) {
                    $timeout(function() {
                        $scope.trans = data;
                        $scope.trans.statusStr = InfoService.getStockStatusMapping(data.status);
                    });
                    return data;
                },
                function(){
                    $state.go('index');
                }).then(function (data) {
                    InfoService.getWarehouseById(data.warehouse).then(function (wh){
                        $timeout(function() {
                            $scope.warehouse = wh;
                        })
                    });
                })
            }
            else{
                $state.go('index');
            }
        }
    }
})();