(function() {
    'use strict';

    angular
        .module('home.controllers')
        .controller('VorkasseDetailCtrl', VorkasseDetailCtrl);

    VorkasseDetailCtrl.$inject = ['$scope', 'VorkasseService', '$timeout', '$state', '$stateParams', 'InfoService', '$window'];

    /* @ngInject */
    function VorkasseDetailCtrl($scope, VorkasseService, $timeout, $state, $stateParams, InfoService, $window) {
    
        $scope.vorkasse = null;

        $scope.editVorkasse = editVorkasse;
        $scope.deleteVorkasse = deleteVorkasse;

        activate();

        ////////////////

        function activate() {

                if($stateParams.id){
                    var id = $stateParams.id;
                    VorkasseService.getVorkasse(id).then(function (data) {
                        $timeout(function() {
                            $scope.vorkasse = data;
                            $scope.vorkasse.statusStr = InfoService.getVorkasseStatusMapping(data.status);
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
                        InfoService.getLogisticPathById(data.ship_company,1).then(function (lp){
                            $timeout(function() {
                                $scope.logisticPath = lp;
                            })
                        });
                    })
                }
                else{
                    $state.go('index');
                }

        }

        function editVorkasse () {
            $state.go('vorkasseSubmit', {id: $stateParams.id});
        }
        function deleteVorkasse () {
            VorkasseService.deleteVorkasse($stateParams.id).then(function() {
                $state.go('vorkasseList');
            }, function () {
                // body...
            })
        }

        $scope.goBack = function () {
            $window.history.back();
        }
    }
})();