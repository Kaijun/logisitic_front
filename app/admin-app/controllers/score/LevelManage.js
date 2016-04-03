(function() {
    'use strict';

    angular
        .module('admin.controllers')
        .controller('LevelManage', LevelManage);

    LevelManage.$inject = ['$scope', '$timeout', 'ScoreService', '$state', '$stateParams', 'ExtraSrvService', 'LogisticService', '$q'];

    /* @ngInject */
    function LevelManage($scope, $timeout, ScoreService, $state, $stateParams, ExtraSrvService, LogisticService, $q) {

        $scope.logisticPaths = null;
        $scope.extraServices = null;

        var logisticPathPromise = LogisticService.getLogistics().then(function(data) {
          data.map(function(item) {
            item.discount_ratio = 0;
            item.enable = false;
          })
          $scope.logisticPaths = data;
        });

        var extraServicePromise = ExtraSrvService.getExtraSrvs().then(function(data) {
          data.map(function(item) {
            item.discount_ratio = 0;
            item.enable = false;
          })
          $scope.extraServices = data;
        })


        $q.all([logisticPathPromise, extraServicePromise]).then(function() {

          active()

        })

        function active() {
          
          if($stateParams.levelId){
            ScoreService.getLevel($stateParams.levelId).then(function(data) {
              $scope.level = data;
              return data;
            }).then(function(data) {
              data.logistic_paths.forEach(function(item) {
                var enableId = parseInt(item.id);
                var discount_ratio = item.pivot.discount_ratio;
                $scope.logisticPaths.some(function(path) {
                  if(parseInt(path.id) === enableId){
                    path.enable = true;
                    path.discount_ratio = discount_ratio;
                    return true
                  }
                })
              })
              data.extra_services.forEach(function(item) {
                var enableId = parseInt(item.id);
                var discount_ratio = item.pivot.discount_ratio;
                $scope.extraServices.some(function(srv) {
                  if(parseInt(srv.id) === enableId){
                    srv.enable = true;
                    srv.discount_ratio = discount_ratio;
                    return true
                  }
                })
              })
            })

            $scope.submit = function() {
              $scope.level.logistic_paths = $scope.logisticPaths.filter(function(item) {
                return item.enable===true
              })
              $scope.level.extra_services = $scope.extraServices.filter(function(item) {
                return item.enable===true
              })
              ScoreService.editLevel($stateParams.levelId, $scope.level).then(function(data) {
                if(data.success===true){
                  swal('修改成功', '', 'success');
                  $state.go('levelList', {}, {reload: true});
                }
              })
            }

          }
          else{
            $scope.logisticPaths.forEach(function(item) {
              item.enable = true;
            })
            $scope.extraServices.forEach(function(item) {
              item.enable = true;
            })

            $scope.level = {
              'level_name': '',
              'lower_bound': 0,
              'usable_amount': 0,
              'usable_ratio': 0,
              'logistic_paths': [],
              'extra_services': [],
            }

            $scope.submit = function() {
              $scope.level.logistic_paths = $scope.logisticPaths.filter(function(item) {
                return item.enable===true
              })
              $scope.level.extra_services = $scope.extraServices.filter(function(item) {
                return item.enable===true
              })
              ScoreService.addLevel($scope.level).then(function(data) {
                if(data.success===true){
                  swal('添加成功', '', 'success');
                  $state.go('levelList', {}, {reload: true});
                }
              })
            }

          }

        }



    }
})();