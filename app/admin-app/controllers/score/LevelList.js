(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('LevelList', LevelList);

    LevelList.$inject = ['$scope', '$timeout', 'ScoreService', '$http', '$state'];

    /* @ngInject */
    function LevelList($scope, $timeout, ScoreService, $http, $state) {

        $scope.levels = null;



        ScoreService.getLevelList().then(function(data){
            $scope.levels = data;
        })
        
        $scope.deleteLevel = function(lvl) {
          if(lvl.id){
            swal({
                title: "确认删除?",
                showCancelButton: true,
            }, function () {
                ScoreService.deleteLevel(lvl.id).then(function(data) {
                    $scope.levels = $scope.levels.filter(function(item) {
                      return item.id != lvl.id
                    })
                });
            })
          }
        }

    }
})();