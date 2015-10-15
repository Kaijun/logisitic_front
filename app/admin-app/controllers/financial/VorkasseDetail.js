(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('VorkasseDetail', VorkasseDetail);

    VorkasseDetail.$inject = ['$scope', '$timeout', 'AppConfig', 'InfoService', 'VorkasseService', '$stateParams', '$state', '$window'];

    /* @ngInject */
    function VorkasseDetail($scope, $timeout, AppConfig, InfoService, VorkasseService, $stateParams, $state, $window) {
        $scope.vorkasse = null;

        $scope.imageUrlPrefix = AppConfig.apiUrl+ '/image/';

        $scope.deleteVorkasse = deleteVorkasse;
        $scope.changeStatus = changeStatus;
        $scope.downloadAttachments = downloadAttachments;

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
                status: st,
            }).then(function(data) {
                if(data.success===true){
                    swal(msg, '', 'success');
                    $timeout(function () { 
                       $scope.vorkasse.statusStr = InfoService.getVorkasseStatusMapping(st);
                       $scope.vorkasse.status = st;
                    })
                }  

            }, function () {
                // body...
            })
        }

        function downloadAttachments () {
            if($scope.vorkasse.proof_files_paths.length>0){
                $scope.vorkasse.proof_files_paths.forEach(function (item) {
                    var a = $("<a>")
                    .attr("href", $scope.imageUrlPrefix+item)
                    .attr("download", item)
                    .appendTo("body");
                    a[0].click();
                    a.remove();
                })
            }
        }
    }
})();