(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('TransDetailCtrl', TransDetailCtrl);

    TransDetailCtrl.$inject = ['$scope', 'TransService', 'InfoService', 'UserInfo','$stateParams', '$timeout', '$state', '$window'];

    /* @ngInject */
    function TransDetailCtrl($scope, TransService, InfoService, UserInfo, $stateParams, $timeout, $state, $window) {
        $scope.trans = null;
        $scope.warehouse = null;
        $scope.isConfirmShown = false;

        $scope.confirmTrans = confirmTrans;
        $scope.deleteTrans = deleteTrans;
        $scope.editTrans = editTrans;
        activate();

        ////////////////

        function activate() {
            if($stateParams.transId){
                var transId = $stateParams.transId;
                TransService.getTrans(transId).then(function (data) {
                    
                    return data;
                },
                function(){
                    $state.go('index');
                }).then(function (data) {
                    InfoService.getTypes().then(function (lts) {
                        data.items.forEach(function (item) {
                            lts.some(function (i) {
                                if(item.type == i.id){
                                    item.typeName = i.type_name;
                                    return true;
                                }
                            })
                        });

                        $timeout(function() {
                            $scope.trans = data;
                            $scope.trans.statusStr = InfoService.getStockStatusMapping(data.status);
                            $scope.isConfirmShown = data.to_email == UserInfo.email;
                            // $scope.isConfirmShown = true;
                        });


                    })
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


        function editTrans () {
            $state.go('transSubmit', {transId: $stateParams.transId});
        }
        function deleteTrans () {
            TransService.deleteTrans($stateParams.transId).then(function() {
                $state.go('transList');
            }, function () {
                // body...
            })
        }
        $scope.goBack = function () {
            $window.history.back();
        }
    }
})();