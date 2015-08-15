(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('TransDetailCtrl', TransDetailCtrl);

    TransDetailCtrl.$inject = ['$scope', 'TransService', 'InfoService', 'UserInfo','$stateParams', '$timeout'];

    /* @ngInject */
    function TransDetailCtrl($scope, TransService, InfoService, UserInfo, $stateParams, $timeout) {
        $scope.trans = null;
        $scope.warehouse = null;
        $scope.isConfirmShown = false;

        $scope.confirmTrans = confirmTrans;
        activate();

        ////////////////

        function activate() {
            if($stateParams.transId){
                var transId = $stateParams.transId;
                TransService.getTrans(transId).then(function (data) {
                    $timeout(function() {
                        $scope.trans = data;
                        $scope.trans.statusStr = InfoService.getStockStatusMapping(data.status);
                        // $scope.isConfirmShown = data.to_email == UserInfo.email;
                        $scope.isConfirmShown = true;
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

        function confirmTrans(){
            TransService.confirmTrans($stateParams.transId).then(function() {
                $state.go($state.current, {transId: $stateParams.transId}, {reload: true});
            });
        }
    }
})();