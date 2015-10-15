(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('VorkasseDetail', VorkasseDetail);

    VorkasseDetail.$inject = ['$scope', '$timeout', 'AppConfig', 'InfoService', 'VorkasseService', '$stateParams', '$state'];

    /* @ngInject */
    function VorkasseDetail($scope, $timeout, AppConfig, InfoService, VorkasseService, $stateParams, $state) {
        $scope.vorkasse = null;

        $scope.imageUrlPrefix = AppConfig.apiUrl+ '/image/';

        $scope.deleteVorkasse = deleteVorkasse;
        $scope.changeStatus = changeStatus;

        activate();

        ////////////////

        function activate() {

                if($stateParams.vorkasseId){
                    var id = $stateParams.vorkasseId;
                    VorkasseService.getVorkasse(id).then(function (data) {
                        $timeout(function() {
                            $scope.vorkasse = data;
                            $scope.imageUrlPrefix = $scope.imageUrlPrefix + data.user_id + '/';
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
        function changeStatus (st, msg) {
            VorkasseService.editVorkasse($stateParams.vorkasseId, {
                status: st
            }).then(function() {
                swal({
                        type: "success",
                        title: msg,
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        closeOnConfirm: true,
                    }, function () {
                       
                        $timeout(function() {
                           $scope.vorkasse.statusStr = InfoService.getVorkasseStatusMapping(st);
                        });
                })  

            }, function () {
                // body...
            })
        }
    }
})();