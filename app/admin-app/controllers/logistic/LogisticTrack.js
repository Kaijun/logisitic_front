(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('LogisticTrack', LogisticTrack);

    LogisticTrack.$inject = ['$scope', '$state', '$timeout', 'LogisticService'];

    /* @ngInject */
    function LogisticTrack($scope, $state, $timeout, LogisticService) {
        
        $scope.logisticTracks = [];
        $scope.isPopupShown = false;
        $scope.trackName = '';

        $scope.deleteLogisticTrack = deleteLogisticTrack;
        $scope.addLogisticTrack = addLogisticTrack;
        $scope.cancle = cancle;
        $scope.submitLogisticTrack = submitLogisticTrack;

        activate();

        ////////////////

        function activate() {
            LogisticService.getLogisticTracks().then(function (data) {
                $timeout(function (argument) {
                    $scope.logisticTracks = data;
                })
                
            })
        }        
        function deleteLogisticTrack(lt){
            LogisticService.deleteLogisticTrack(lt.id).then(function (data) {
                $scope.logisticTracks.forEach(function (item, idx, arry) {
                    if(item.id == lt.id){
                        arry.splice(idx, 1);
                    }
                })
            })
        }

        function addLogisticTrack () {
            $scope.isPopupShown = true;
        }
        function cancle () {
            $scope.isPopupShown = false;
        }
        function submitLogisticTrack () {
            if($scope.trackName){
                LogisticService.submitLogisticTrack({name: $scope.trackName}).then(function (data) {
                    $scope.isPopupShown = false;
                    $state.go($state.current, {}, {reload: true})
                })
            }
        }
    }
})();