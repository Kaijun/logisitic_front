(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('LogisticList', LogisticList);

    LogisticList.$inject = ['$scope', '$state', 'LogisticService', '$timeout'];

    /* @ngInject */
    function LogisticList($scope, $state, LogisticService, $timeout) {
        $scope.paths = [];
        $scope.deletePath = deletePath;
        $scope.editPath = editPath;

        activate();

        ////////////////

        function activate() {

            LogisticService.getLogistics().then(function (data) {
                $timeout(function () {
                    $scope.paths = data
                })
            })

        }

        function deletePath(path){
            LogisticService.deleteLogistic(path.id).then(function (data) {
                $scope.paths.forEach(function (item, idx, arry) {
                    if(item.id == path.id){
                        arry.splice(idx, 1);
                    }
                })
            })
        }
        function editPath(path){
            $state.go('logisticManage', {id: path.id}, {reload: true});
        }
    }
})();