(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('VorkasseDetail', VorkasseDetail);

    VorkasseDetail.$inject = ['$scope', '$timeout', 'InfoService', 'VorkasseService', '$stateParams', '$state'];

    /* @ngInject */
    function VorkasseDetail($scope, $timeout, InfoService, VorkasseService, $stateParams, $state) {
        $scope.vorkasse = null;
        $scope.deleteVorkasse = deleteVorkasse;

        activate();

        ////////////////

        function activate() {

                if($stateParams.vorkasseId){
                    var id = $stateParams.vorkasseId;
                    VorkasseService.getVorkasse(id).then(function (data) {
                        $timeout(function() {
                            $scope.vorkasse = data;
                            $scope.vorkasse.statusStr = InfoService.getVorkasseStatusMapping(data.status);
                        });
                        return data;
                    },
                    function(){
                        $state.go('index');
                    })
                }
                else{
                    $state.go('index');
                }

        }

        function deleteVorkasse () {
            VorkasseService.deleteVorkasse($stateParams.vorkasseId).then(function() {
                $state.go('vorkasseList');
            }, function () {
                // body...
            })
        }
    }
})();